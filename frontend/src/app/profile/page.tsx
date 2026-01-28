"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { addressService } from "@/services/addressService";
import { getProfile, updateProfile } from "@/services/authService";
import { Address, NewAddress } from "@/types/address";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  User as UserIcon, 
  Store, 
  MapPin, 
  Plus, 
  Trash2, 
  Edit2, 
  Camera, 
  Save, 
  ChevronRight,
  Package,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useSnackbar } from "@/components/context/SnackbarContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import useAuthStore from "@/stores/useAuthStore";

const ProfilePageContent = () => {
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section");
  // ... rest of lines 46-511
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
    setLoading(true);
    try {
      const [profileResponse, addressResponse] = await Promise.all([
        getProfile(),
        addressService.getAddresses()
      ]);
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

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-muted/30">
        <Navbar />
        <main className="container mx-auto px-4 py-8 space-y-8">
           <Skeleton className="h-64 w-full rounded-2xl" />
           <Skeleton className="h-96 w-full rounded-2xl" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30 pb-12">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Your Account</h1>
            <p className="mt-2 text-gray-500">Manage your personal information, shop settings, and billing addresses.</p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-8">
            {/* User Profile Section */}
            <Card ref={userSectionRef} className="border-none shadow-sm overflow-hidden rounded-2xl bg-white">
              <CardHeader className="bg-primary/5 border-b border-primary/10 px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary p-2 rounded-lg text-white">
                    <UserIcon size={20} />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Personal Information</CardTitle>
                    <CardDescription>Update your personal details and profile picture.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-10">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                      <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-muted bg-muted flex items-center justify-center">
                        {profileData.avatar || profileData.profile_picture ? (
                           <img 
                            src={profileData.avatar || profileData.profile_picture} 
                            alt="Profile" 
                            className="h-full w-full object-cover" 
                           />
                        ) : (
                          <UserIcon size={48} className="text-muted-foreground" />
                        )}
                      </div>
                      <label 
                        htmlFor="profile_picture" 
                        className="absolute bottom-0 right-0 h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-primary/90 transition-colors"
                      >
                        <Camera size={18} />
                      </label>
                      <input type="file" id="profile_picture" className="hidden" accept="image/*" />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">JPG, GIF or PNG. Max size 2MB</p>
                  </div>

                  <div className="md:col-span-2 space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="user_name">Full Name</Label>
                        <Input 
                          id="user_name" 
                          value={profileData.name} 
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          placeholder="Juan Dela Cruz"
                          className="bg-muted/30 focus-visible:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="middle_name">Middle Name (Optional)</Label>
                        <Input 
                          id="middle_name" 
                          value={profileData.middleName || ""} 
                          onChange={(e) => setProfileData({...profileData, middleName: e.target.value})}
                          placeholder="Santos"
                          className="bg-muted/30"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={profileData.email} 
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="bg-muted/30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact_number">Contact Number</Label>
                        <Input 
                          id="contact_number" 
                          value={profileData.contactNumber || ""} 
                          onChange={(e) => setProfileData({...profileData, contactNumber: e.target.value})}
                          placeholder="09123456789"
                          className="bg-muted/30"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Addresses Section */}
            <div ref={addressSectionRef} className="space-y-6 pt-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="bg-orange-500 p-2 rounded-lg text-white">
                        <MapPin size={20} />
                     </div>
                     <h2 className="text-2xl font-bold tracking-tight">Shipping Addresses</h2>
                  </div>
                  
                  <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline" className="rounded-full">
                        <Plus className="mr-2" size={18} />
                        Add Address
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add New Address</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                           <Label htmlFor="addr_name">Contact Person</Label>
                          <Input id="addr_name" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="addr_phone">Phone Number</Label>
                          <Input id="addr_phone" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                           <div className="space-y-2">
                              <Label htmlFor="street">Street</Label>
                              <Input id="street" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor="barangay">Barangay</Label>
                              <Input id="barangay" value={newAddress.barangay} onChange={e => setNewAddress({...newAddress, barangay: e.target.value})} />
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                           <div className="space-y-2">
                              <Label htmlFor="city">City</Label>
                              <Input id="city" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor="postal_code">Postal Code</Label>
                              <Input id="postal_code" value={newAddress.postal_code} onChange={e => setNewAddress({...newAddress, postal_code: e.target.value})} />
                           </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" onClick={handleCreateAddress} disabled={!newAddress.name || !newAddress.city} className="w-full">Save Address</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <Card key={address.id} className={cn(
                      "rounded-2xl border transition-all relative group",
                      address.is_default ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/20"
                    )}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                               <h3 className="font-bold">{address.name}</h3>
                               {address.is_default && <Badge variant="secondary" className="bg-primary/10 text-primary border-0 text-[10px] h-5">Default</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground">{address.phone}</p>
                            <p className="text-sm mt-3 text-gray-600 leading-snug">
                              {address.street}, {address.barangay}<br />
                              {address.city}, {address.postal_code}
                            </p>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                             <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteAddress(address.id)}>
                                <Trash2 size={16} />
                             </Button>
                             {!address.is_default && (
                               <Button type="button" variant="ghost" size="sm" className="text-[10px] h-6 px-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleSetDefaultAddress(address.id)}>
                                 Set Default
                               </Button>
                             )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {addresses.length === 0 && (
                    <div className="md:col-span-2 py-12 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
                      <MapPin size={40} className="mb-2 opacity-20" />
                      <p className="text-sm">No shipping addresses saved.</p>
                    </div>
                  )}
               </div>
            </div>

            {/* Shop Settings Section - Only for Merchants */}
            {userType === 'merchant' && (
              <Card ref={shopSectionRef} className="border-none shadow-sm overflow-hidden rounded-2xl bg-white">
                <CardHeader className="bg-green-50/50 border-b border-green-100 px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-600 p-2 rounded-lg text-white">
                      <Store size={20} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Shop Settings</CardTitle>
                      <CardDescription>Manage your public store presence and logistics.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <Label>Shop Logo</Label>
                       <div className="flex items-center gap-6">
                          <div className="h-24 w-24 rounded-2xl overflow-hidden border bg-muted flex items-center justify-center">
                             {profileData.shop?.logo_image ? (
                                <img src={profileData.shop.logo_image} className="h-full w-full object-cover" />
                             ) : (
                                <Store size={32} className="text-muted-foreground" />
                             )}
                          </div>
                          <div>
                             <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('logo_image')?.click()}>
                                <Camera size={16} className="mr-2" />
                                Change Logo
                             </Button>
                             <input type="file" id="logo_image" className="hidden" accept="image/*" />
                             <p className="text-[10px] text-muted-foreground mt-2">Recommended: 400x400px</p>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <Label>Shop Banner</Label>
                       <div className="relative h-24 w-full rounded-2xl overflow-hidden border bg-muted group">
                          {profileData.shop?.banner_image ? (
                             <img src={profileData.shop.banner_image} className="h-full w-full object-cover" />
                          ) : (
                             <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">No banner set</div>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <Button type="button" variant="secondary" size="sm" onClick={() => document.getElementById('banner_image')?.click()}>
                                <Camera size={16} className="mr-2" />
                                Change Banner
                             </Button>
                          </div>
                          <input type="file" id="banner_image" className="hidden" accept="image/*" />
                       </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="shop_name">Shop Name</Label>
                      <Input 
                        id="shop_name" 
                        value={profileData.shop?.name || ""} 
                        onChange={(e) => setProfileData({
                          ...profileData, 
                          shop: {...profileData.shop, name: e.target.value}
                        })}
                        className="bg-muted/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipping_fee">Flat Shipping Fee (₱)</Label>
                      <Input 
                        id="shipping_fee" 
                        type="number"
                        value={profileData.shop?.shipping_fee || 0} 
                        onChange={(e) => setProfileData({
                          ...profileData, 
                          shop: {...profileData.shop, shipping_fee: e.target.value}
                        })}
                        className="bg-muted/30"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="description">Shop Description</Label>
                      <Textarea 
                        id="description" 
                        rows={4}
                        value={profileData.shop?.description || ""} 
                        onChange={(e) => setProfileData({
                          ...profileData, 
                          shop: {...profileData.shop, description: e.target.value}
                        })}
                        placeholder="Tell customers about your local products..."
                        className="bg-muted/30"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}


            <div className="flex justify-end sticky bottom-8 z-10">
               <Button type="submit" disabled={saving} className="px-8 py-6 rounded-full shadow-xl bg-primary hover:bg-primary/90 text-lg font-bold">
                 {saving ? "Saving Changes..." : "Save Profile Changes"}
                 <Save size={20} className="ml-2" />
               </Button>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
};

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col bg-muted/30">
        <Navbar />
        <main className="container mx-auto px-4 py-8 space-y-8">
           <Skeleton className="h-64 w-full rounded-2xl" />
           <Skeleton className="h-96 w-full rounded-2xl" />
        </main>
      </div>
    }>
      <ProfilePageContent />
    </Suspense>
  );
}
