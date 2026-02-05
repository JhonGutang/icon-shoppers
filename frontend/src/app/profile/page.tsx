"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/shared/layout/Navbar";
import { addressService } from "@/services/addressService";
import { getProfile, updateProfile } from "@/services/authService";
import { Address, NewAddress } from "@/types/address";
import { Button } from "@/components/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/shared/ui/card";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import { Textarea } from "@/components/shared/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/shared/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { 
  User as UserIcon, 
  Store, 
  MapPin, 
  Plus, 
  Trash2, 
  Camera, 
  Save, 
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Package,
  Sparkles
} from "lucide-react";
import { useSnackbar } from "@/components/shared/context/SnackbarContext";
import { Skeleton } from "@/components/shared/ui/skeleton";
import { Separator } from "@/components/shared/ui/separator";
import { Badge } from "@/components/shared/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/shared/ui/dialog";
import { cn } from "@/lib/utils";
import useAuthStore from "@/stores/useAuthStore";
import SkeletonLayer from "@/components/shared/skeletons/SkeletonLayer";
import ProfileSkeleton from "@/components/shared/skeletons/ProfileSkeleton";

const ProfilePageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section");
  const { openSnackbar } = useSnackbar();
  const { userType } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  
  // Refs for scrolling
  const userSectionRef = useRef<HTMLDivElement>(null);
  const shopSectionRef = useRef<HTMLDivElement>(null);
  const addressSectionRef = useRef<HTMLDivElement>(null);

  // Address dialog state
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState<NewAddress>({
    name: "",
    phone: "",
    street: "",
    barangay: "",
    city: "",
    postal_code: "",
    is_default: false
  });

  const fetchData = async () => {
    // Keep loading true for at least 500ms to avoid flicker if fast
    const minLoadTime = new Promise(resolve => setTimeout(resolve, 800));
    const dataLoad = Promise.all([
      getProfile(),
      addressService.getAddresses()
    ]);

    try {
      const [[profileResponse, addressResponse]] = await Promise.all([dataLoad, minLoadTime]);
      setProfileData(profileResponse);
      setAddresses(addressResponse);
    } catch (err) {
      openSnackbar("Failed to load profile data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && sectionParam) {
      setTimeout(() => {
        if (sectionParam === "merchant" && shopSectionRef.current) {
          shopSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (sectionParam === "address" && addressSectionRef.current) {
          addressSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (sectionParam === "customer" && userSectionRef.current) {
          userSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [loading, sectionParam]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      
      // User data
      formData.append("user_name", profileData.name);
      formData.append("email", profileData.email);
      formData.append("contact_number", profileData.contactNumber);
      if (profileData.middleName) formData.append("middle_name", profileData.middleName);
      
      // Shop data (if merchant)
      if (userType === 'merchant' && profileData.shop) {
        formData.append("shop_name", profileData.shop.name);
        formData.append("description", profileData.shop.description || "");
        formData.append("shipping_fee", profileData.shop.shipping_fee || "0");
      }

      // Files
      const profileInput = document.getElementById("profile_picture") as HTMLInputElement;
      if (profileInput?.files?.[0]) formData.append("profile_picture", profileInput.files[0]);

      const logoInput = document.getElementById("logo_image") as HTMLInputElement;
      if (logoInput?.files?.[0]) formData.append("logo_image", logoInput.files[0]);

      const bannerInput = document.getElementById("banner_image") as HTMLInputElement;
      if (bannerInput?.files?.[0]) formData.append("banner_image", bannerInput.files[0]);

      await updateProfile(formData);
      openSnackbar("Profile updated successfully", "success");
      fetchData(); // Refresh data
    } catch (err) {
      openSnackbar("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  // Address Handlers
  const handleCreateAddress = async () => {
    try {
      await addressService.createAddress(newAddress);
      setIsAddressDialogOpen(false);
      openSnackbar("Address added successfully", "success");
      const updatedAddresses = await addressService.getAddresses();
      setAddresses(updatedAddresses);
      setNewAddress({ name: "", phone: "", street: "", barangay: "", city: "", postal_code: "", is_default: false });
    } catch (err) {
      openSnackbar("Failed to add address", "error");
    }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      await addressService.deleteAddress(id);
      openSnackbar("Address deleted", "info");
      setAddresses(addresses.filter(a => a.id !== id));
    } catch (err) {
      openSnackbar("Failed to delete address", "error");
    }
  };

  const handleSetDefaultAddress = async (id: number) => {
    try {
      await addressService.setDefault(id);
      openSnackbar("Default address updated", "success");
      const updatedAddresses = await addressService.getAddresses();
      setAddresses(updatedAddresses);
    } catch (err) {
      openSnackbar("Failed to update default address", "error");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-stone-50/50 pb-20">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <SkeletonLayer isLoading={loading} fallback={<ProfileSkeleton />}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Col: Main Form & Settings */}
            <div className="lg:col-span-2 space-y-10">
              <div className="mb-2">
                <h1 className="text-3xl font-black tracking-tight text-stone-900">Your Profile</h1>
                <p className="mt-1 text-stone-500 font-medium">Manage your personal information and shipping details</p>
              </div>

              <form id="profile-form" onSubmit={handleUpdateProfile} className="space-y-10">
                {/* User Profile Section */}
                <Card ref={userSectionRef} className="border border-stone-200 shadow-sm overflow-hidden rounded-3xl bg-white">
                  <CardHeader className="bg-stone-50 px-8 py-6 border-b border-stone-100 flex flex-row items-center gap-4">
                    <div className="bg-[#0E6835] p-2.5 rounded-xl text-white shadow-lg shadow-[#0E6835]/20">
                      <UserIcon size={20} />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-stone-900">Personal Information</CardTitle>
                      <CardDescription className="text-stone-500">Update your personal details and profile picture</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-3 gap-10">
                      <div className="flex flex-col items-center gap-6">
                        <div className="relative group">
                          <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-stone-100 bg-stone-50 flex items-center justify-center shadow-inner">
                            {profileData?.avatar || profileData?.profile_picture ? (
                               <img 
                                src={profileData?.avatar || profileData?.profile_picture} 
                                alt="Profile" 
                                className="h-full w-full object-cover" 
                               />
                            ) : (
                              <UserIcon size={48} className="text-stone-300" />
                            )}
                          </div>
                          <label 
                            htmlFor="profile_picture" 
                            className="absolute bottom-0 right-0 h-10 w-10 bg-[#0E6835] text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-[#0E6835]/90 transition-all hover:scale-110 active:scale-95"
                          >
                            <Camera size={16} />
                          </label>
                          <input type="file" id="profile_picture" className="hidden" accept="image/*" />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 text-center">JPG, GIF or PNG. Max 2MB</p>
                      </div>

                      <div className="md:col-span-2 space-y-6">
                        <div className="grid md:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label htmlFor="user_name" className="text-stone-700 font-semibold">Full Name</Label>
                            <Input 
                              id="user_name" 
                              value={profileData?.name || ""} 
                              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                              placeholder="Juan Dela Cruz"
                              className="bg-stone-50 border-stone-200 focus-visible:ring-[#0E6835] focus-visible:border-[#0E6835] h-11"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="middle_name" className="text-stone-700 font-semibold">Middle Name (Optional)</Label>
                            <Input 
                              id="middle_name" 
                              value={profileData?.middleName || ""} 
                              onChange={(e) => setProfileData({...profileData, middleName: e.target.value})}
                              placeholder="Santos"
                              className="bg-stone-50 border-stone-200 focus-visible:ring-[#0E6835] focus-visible:border-[#0E6835] h-11"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-stone-700 font-semibold">Email Address</Label>
                            <Input 
                              id="email" 
                              type="email"
                              value={profileData?.email || ""} 
                              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                              className="bg-stone-50 border-stone-200 focus-visible:ring-[#0E6835] focus-visible:border-[#0E6835] h-11"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contact_number" className="text-stone-700 font-semibold">Contact Number</Label>
                            <Input 
                              id="contact_number" 
                              value={profileData?.contactNumber || ""} 
                              onChange={(e) => setProfileData({...profileData, contactNumber: e.target.value})}
                              placeholder="09123456789"
                              className="bg-stone-50 border-stone-200 focus-visible:ring-[#0E6835] focus-visible:border-[#0E6835] h-11"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Addresses Section */}
                <div ref={addressSectionRef} className="space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="bg-[#0E6835] p-2.5 rounded-xl text-white shadow-lg shadow-[#0E6835]/20">
                            <MapPin size={20} />
                         </div>
                         <div>
                            <h2 className="text-xl font-bold text-stone-900">Shipping Addresses</h2>
                            <p className="text-sm text-stone-500">Manage your delivery locations</p>
                         </div>
                      </div>
                      
                      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                        <DialogTrigger asChild>
                          <Button type="button" variant="outline" className="rounded-xl border-stone-200 text-stone-700 font-bold hover:bg-stone-50 hover:text-[#0E6835]">
                            <Plus className="mr-2" size={16} />
                            Add New
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                          <DialogHeader className="px-8 pt-8 pb-4 bg-stone-50 border-b border-stone-100">
                            <DialogTitle className="text-xl font-black text-stone-900">Add New Address</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-5 p-8">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <Label htmlFor="addr_name">Contact Person</Label>
                                <Input id="addr_name" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} className="bg-stone-50 border-stone-200 focus-visible:ring-[#0E6835]" />
                              </div>
                              <div className="space-y-2">
                                 <Label htmlFor="addr_phone">Phone Number</Label>
                                <Input id="addr_phone" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="bg-stone-50 border-stone-200 focus-visible:ring-[#0E6835]" />
                              </div>
                            </div>
                            <div className="space-y-2">
                               <Label htmlFor="street">Street / Building / House No.</Label>
                               <Input id="street" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="bg-stone-50 border-stone-200 focus-visible:ring-[#0E6835]" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-2">
                                  <Label htmlFor="barangay">Barangay</Label>
                                  <Input id="barangay" value={newAddress.barangay} onChange={e => setNewAddress({...newAddress, barangay: e.target.value})} className="bg-stone-50 border-stone-200 focus-visible:ring-[#0E6835]" />
                               </div>
                               <div className="space-y-2">
                                  <Label htmlFor="city">City</Label>
                                  <Input id="city" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="bg-stone-50 border-stone-200 focus-visible:ring-[#0E6835]" />
                               </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="postal_code">Postal Code</Label>
                                <Input id="postal_code" value={newAddress.postal_code} onChange={e => setNewAddress({...newAddress, postal_code: e.target.value})} className="bg-stone-50 border-stone-200 focus-visible:ring-[#0E6835]" />
                            </div>
                          </div>
                          <DialogFooter className="px-8 pb-8">
                             <Button 
                              type="button" 
                              onClick={handleCreateAddress} 
                              disabled={!newAddress.name || !newAddress.city} 
                              className="w-full h-12 rounded-xl bg-[#0E6835] text-white hover:bg-[#0E6835]/90 text-[11px] font-black uppercase tracking-widest"
                            >
                              Save Address
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {addresses.map((address) => (
                        <Card key={address.id} className={cn(
                          "rounded-2xl border transition-all relative group overflow-hidden",
                          address.is_default 
                            ? "border-[#0E6835] bg-[#0E6835]/5 shadow-sm" 
                            : "border-stone-200 bg-white hover:border-[#0E6835]/50 hover:shadow-md"
                        )}>
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                   <h3 className="font-bold text-stone-900">{address.name}</h3>
                                   {address.is_default && (
                                     <Badge className="bg-[#0E6835]/10 text-[#0E6835] hover:bg-[#0E6835]/20 border-0 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 h-auto">
                                       Default
                                     </Badge>
                                   )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-stone-500 font-medium bg-stone-100/50 w-fit px-2 py-1 rounded-md">
                                  <span className="text-stone-400">Phone:</span> {address.phone}
                                </div>
                                <p className="text-sm mt-3 text-stone-600 leading-relaxed font-medium">
                                  {address.street}, {address.barangay}<br />
                                  {address.city}, {address.postal_code}
                                </p>
                              </div>
                              
                              <div className="flex flex-col gap-2">
                                 <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors" onClick={() => handleDeleteAddress(address.id)}>
                                    <Trash2 size={16} />
                                 </Button>
                                 {!address.is_default && (
                                   <Button type="button" variant="ghost" size="sm" className="text-[10px] h-7 px-2 text-[#0E6835] hover:bg-[#0E6835]/10 font-bold" onClick={() => handleSetDefaultAddress(address.id)}>
                                     Set Default
                                   </Button>
                                 )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {addresses.length === 0 && (
                        <div className="md:col-span-2 py-16 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-stone-200 bg-stone-50/50 text-stone-400">
                          <MapPin size={40} className="mb-3 opacity-20" />
                          <p className="text-sm font-medium">No shipping addresses saved yet.</p>
                          <Button type="button" variant="link" onClick={() => setIsAddressDialogOpen(true)} className="text-[#0E6835] font-bold">
                            Add your first address
                          </Button>
                        </div>
                      )}
                   </div>
                </div>

                {/* Shop Settings Section - Only for Merchants */}
                {userType === 'merchant' && (
                  <Card ref={shopSectionRef} className="border border-stone-200 shadow-sm overflow-hidden rounded-3xl bg-white">
                    <CardHeader className="bg-stone-50 px-8 py-6 border-b border-stone-100 flex flex-row items-center gap-4">
                      <div className="bg-[#0E6835] p-2.5 rounded-xl text-white shadow-lg shadow-[#0E6835]/20">
                        <Store size={20} />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-stone-900">Shop Settings</CardTitle>
                        <CardDescription className="text-stone-500">Manage your public store presence and logistics</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <Label className="text-stone-700 font-semibold">Shop Logo</Label>
                           <div className="flex items-center gap-6">
                              <div className="h-24 w-24 rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 flex items-center justify-center">
                                 {profileData?.shop?.logo_image ? (
                                    <img src={`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${profileData.shop.logo_image}`} alt="Shop Logo" className="h-full w-full object-cover" />
                                 ) : (
                                    <Store size={32} className="text-stone-300" />
                                 )}
                              </div>
                              <div>
                                 <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('logo_image')?.click()} className="rounded-lg border-stone-200 font-bold text-stone-600">
                                    <Camera size={16} className="mr-2" />
                                    Change Logo
                                 </Button>
                                 <input type="file" id="logo_image" className="hidden" accept="image/*" />
                                 <p className="text-[10px] text-stone-400 mt-2 font-medium">Recommended: 400x400px</p>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <Label className="text-stone-700 font-semibold">Shop Banner</Label>
                           <div className="relative h-24 w-full rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 group">
                              {profileData?.shop?.banner_image ? (
                                 <img src={`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${profileData.shop.banner_image}`} alt="Shop Banner" className="h-full w-full object-cover" />
                              ) : (
                                 <div className="h-full w-full flex items-center justify-center text-stone-400 text-sm font-medium">No banner set</div>
                              )}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <Button type="button" variant="secondary" size="sm" onClick={() => document.getElementById('banner_image')?.click()} className="backdrop-blur-md bg-white/20 text-white border-white/40 hover:bg-white/30">
                                    <Camera size={16} className="mr-2" />
                                    Change Banner
                                 </Button>
                              </div>
                              <input type="file" id="banner_image" className="hidden" accept="image/*" />
                           </div>
                        </div>
                      </div>

                      <Separator className="bg-stone-100" />

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="shop_name" className="text-stone-700 font-semibold">Shop Name</Label>
                          <Input 
                            id="shop_name" 
                            value={profileData?.shop?.name || ""} 
                            onChange={(e) => setProfileData({
                              ...profileData, 
                              shop: {...profileData.shop, name: e.target.value}
                            })}
                            className="bg-stone-50 border-stone-200 focus-visible:ring-[#0E6835] focus-visible:border-[#0E6835] h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="shipping_fee" className="text-stone-700 font-semibold">Flat Shipping Fee (₱)</Label>
                          <Input 
                            id="shipping_fee" 
                            type="number"
                            value={profileData?.shop?.shipping_fee || 0} 
                            onChange={(e) => setProfileData({
                              ...profileData, 
                              shop: {...profileData.shop, shipping_fee: e.target.value}
                            })}
                            className="bg-stone-50 border-stone-200 focus-visible:ring-[#0E6835] focus-visible:border-[#0E6835] h-11"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label htmlFor="description" className="text-stone-700 font-semibold">Shop Description</Label>
                          <Textarea 
                            id="description" 
                            rows={4}
                            value={profileData?.shop?.description || ""} 
                            onChange={(e) => setProfileData({
                              ...profileData, 
                              shop: {...profileData.shop, description: e.target.value}
                            })}
                            placeholder="Tell customers about your local products..."
                            className="bg-stone-50 border-stone-200 focus-visible:ring-[#0E6835] focus-visible:border-[#0E6835] resize-none"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-end pt-4 sticky bottom-6 z-10 pointer-events-none">
                   <div className="pointer-events-auto shadow-2xl rounded-xl">
                     <Button 
                        type="submit" 
                        disabled={saving} 
                        className="inline-flex items-center justify-center gap-2 px-8 h-14 rounded-xl bg-[#0E6835] text-white hover:bg-[#0E6835]/90 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-[#0E6835]/20 transition-all active:scale-[0.98]"
                      >
                       {saving ? "Saving Changes..." : "Save Profile Changes"}
                       <Save size={18} className="ml-1" />
                     </Button>
                   </div>
                </div>
              </form>
            </div>
            
            {/* Right Col: Shop Ad / Extra Info */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                
                {/* Shop Recruitment - Sticky Ad Style */}
                {userType !== 'merchant' && !profileData?.shop && (
                   <div className="relative overflow-hidden rounded-3xl bg-stone-900 text-white shadow-2xl transform transition-transform hover:scale-[1.02] duration-300 group">
                     {/* Background Pattern */}
                     <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[300px] w-[300px] rounded-full bg-[#0E6835] blur-3xl opacity-30 group-hover:opacity-40 transition-opacity"></div>
                     <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-[200px] w-[200px] rounded-full bg-stone-500 blur-3xl opacity-20"></div>
                     
                     <div className="relative p-8 flex flex-col items-center text-center space-y-6">
                       <div className="w-16 h-16 rounded-2xl bg-[#0E6835] flex items-center justify-center shadow-lg shadow-green-900/50 mb-2">
                         <Store size={32} className="text-white" />
                       </div>
                       
                       <div className="space-y-2">
                         <h2 className="text-3xl font-black tracking-tight leading-none">
                           Start Selling <br /><span className="text-[#4CC292]">Today</span>
                         </h2>
                         <p className="text-stone-400 text-sm leading-relaxed max-w-[200px] mx-auto">
                           Join thousands of local sellers and grow your business with us.
                         </p>
                       </div>
                       
                       <div className="w-full space-y-3 py-4 border-y border-white/10">
                         <div className="flex items-center justify-center gap-2 text-sm font-bold text-stone-200">
                           <CheckCircle2 size={16} className="text-[#4CC292]" />
                           Zero Listing Fees
                         </div>
                         <div className="flex items-center justify-center gap-2 text-sm font-bold text-stone-200">
                           <Sparkles size={16} className="text-[#4CC292]" />
                           Instant Payouts
                         </div>
                         <div className="flex items-center justify-center gap-2 text-sm font-bold text-stone-200">
                           <TrendingUp size={16} className="text-[#4CC292]" />
                           Grow Audience
                         </div>
                       </div>
                       
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              type="button"
                              className="w-full h-14 rounded-2xl bg-[#4CC292] text-stone-900 hover:bg-[#3db082] font-black text-xs uppercase tracking-widest shadow-lg shadow-[#4CC292]/20 transition-all hover:translate-y-[-2px]"
                            >
                              Create Shop
                              <ArrowRight className="ml-2" size={16} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-3xl border-none shadow-2xl p-8 max-w-md">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-2xl font-black text-center mb-2">Ready to open your shop?</AlertDialogTitle>
                              <AlertDialogDescription className="text-stone-500 text-center text-base">
                                You are about to be redirected to our specialized shop creation page. Please have your shop details and visuals ready!
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-8 flex-col sm:flex-col gap-3">
                              <AlertDialogAction 
                                onClick={() => router.push('/create-shop')}
                                className="w-full h-12 rounded-xl text-xs uppercase tracking-widest font-black bg-[#0E6835] hover:bg-[#0E6835]/90 text-white"
                              >
                                Yes, Let's Go!
                              </AlertDialogAction>
                              <AlertDialogCancel className="w-full h-12 rounded-xl border-stone-200 text-stone-500 font-bold mt-0">Maybe Later</AlertDialogCancel>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <p className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">Terms & Conditions Apply</p>
                     </div>
                   </div>
                )}
                
                {/* Additional Sidebar Info if needed */}
                <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
                   <h3 className="font-bold text-stone-900 mb-2 flex items-center gap-2">
                     <Package size={18} className="text-[#0E6835]"/>
                     Pending Orders
                   </h3>
                   <p className="text-sm text-stone-500 mb-4">You have no pending orders at the moment.</p>
                   <Button variant="outline" className="w-full rounded-xl text-stone-600 font-bold text-xs h-10" onClick={() => router.push('/orders')}>
                     View All Orders
                   </Button>
                </div>
              </div>
            </div>

          </div>
        </SkeletonLayer>
      </main>
    </div>
  );
};

export default function ProfilePage() {
  return (
    <Suspense fallback={
       <div className="flex min-h-screen flex-col bg-stone-50/50">
          <Navbar />
          <main className="container mx-auto px-4 py-8 max-w-7xl">
              <ProfileSkeleton />
          </main>
       </div>
    }>
      <ProfilePageContent />
    </Suspense>
  );
}
