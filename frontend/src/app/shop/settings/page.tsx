"use client";

import React, { useState } from "react";
import { Button } from "@/components/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/shared/ui/card";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import { Textarea } from "@/components/shared/ui/textarea";
import { Separator } from "@/components/shared/ui/separator";
import { 
  Store, 
  Camera, 
  Save, 
  AlertCircle,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { useSnackbar } from "@/components/shared/context/SnackbarContext";
import { Skeleton } from "@/components/shared/ui/skeleton";
import Link from "next/link";
import useAuthStore from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/profile/useProfileQuery";
import { useDeleteShop } from "@/hooks/shop/useShopMutations";
import { useUpdateProfile } from "@/hooks/profile/useProfileMutations";
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

const ShopSettingsPage = () => {
  const { openSnackbar } = useSnackbar();
  const router = useRouter();
  const { setSellerMode, setAuth, id, accessToken, name } = useAuthStore();
  
  const { data: profile, isLoading: loading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const deleteShopMutation = useDeleteShop();

  const [confirmName, setConfirmName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const shopData = profile?.shop;

  const handleDeleteShop = async () => {
    if (confirmName !== shopData?.name) {
      openSnackbar("Shop name does not match!", "error");
      return;
    }

    deleteShopMutation.mutate({
      password: confirmPassword,
      shop_name: confirmName
    }, {
      onSuccess: () => {
        openSnackbar("Shop successfully deleted", "success");
        setAuth(accessToken, 'customer', id, name, false);
        setSellerMode(false);
        setTimeout(() => router.push("/home"), 1500);
      },
      onError: (err: any) => {
        openSnackbar(err.response?.data?.message || "Failed to delete shop", "error");
      }
    });
  };

  const handleUpdateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("shop_name", shopData?.name || "");
    formData.append("description", shopData?.description || "");
    formData.append("shipping_fee", String(shopData?.shipping_fee ?? 0));

    const logoInput = document.getElementById("logo_image") as HTMLInputElement;
    if (logoInput?.files?.[0]) formData.append("logo_image", logoInput.files[0]);

    const bannerInput = document.getElementById("banner_image") as HTMLInputElement;
    if (bannerInput?.files?.[0]) formData.append("banner_image", bannerInput.files[0]);

    updateProfileMutation.mutate(formData, {
      onSuccess: () => {
        openSnackbar("Shop settings updated successfully", "success");
      },
      onError: () => {
        openSnackbar("Failed to update shop settings", "error");
      }
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[500px] w-full rounded-2xl" />
      </div>
    );
  }

  if (!shopData) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <AlertCircle size={48} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">No Shop Found</h2>
        <p className="text-gray-500 mt-2">You need to create a shop first to access these settings.</p>
        <Button className="mt-6" asChild>
           <Link href="/profile">Go to Profile</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Shop Settings</h1>
          <p className="text-gray-500">Manage your store&apos;s public identity and logistics.</p>
        </div>
      </div>

      <form onSubmit={handleUpdateShop} className="space-y-8">
        <Card className="border-none shadow-sm overflow-hidden rounded-2xl bg-white">
          <CardHeader className="bg-green-50/50 border-b border-green-100 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-lg text-white">
                <Store size={20} />
              </div>
              <div>
                <CardTitle className="text-xl">Store Identity</CardTitle>
                <CardDescription>Configure how customers see your shop.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <Label>Shop Logo</Label>
                 <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-2xl overflow-hidden border-2 border-dashed bg-gray-50 flex items-center justify-center group overflow-hidden relative">
                       {shopData.logo_image ? (
                          <img src={`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${shopData.logo_image}`} alt={`${shopData.name} logo`} className="h-full w-full object-cover" />
                       ) : (
                          <Store size={32} className="text-gray-300" />
                       )}
                    </div>
                    <div>
                       <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('logo_image')?.click()}>
                          <Camera size={16} className="mr-2" />
                          Change Logo
                       </Button>
                       <input type="file" id="logo_image" className="hidden" accept="image/*" />
                       <p className="text-[10px] text-muted-foreground mt-2">Recommended: Square image, max 2MB</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <Label>Shop Banner</Label>
                 <div className="relative h-24 w-full rounded-2xl overflow-hidden border bg-muted group">
                    {shopData.banner_image ? (
                       <img src={`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${shopData.banner_image}`} alt={`${shopData.name} banner`} className="h-full w-full object-cover" />
                    ) : (
                       <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm font-medium">No banner set</div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Button type="button" variant="secondary" size="sm" onClick={() => document.getElementById('banner_image')?.click()}>
                          <Camera size={16} className="mr-2" />
                          Change Banner
                       </Button>
                    </div>
                    <input type="file" id="banner_image" className="hidden" accept="image/*" />
                 </div>
                 <p className="text-[10px] text-muted-foreground text-right italic">Banners appear at the top of your shop page</p>
              </div>
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="shop_name">Shop Name</Label>
                <Input 
                  id="shop_name" 
                  defaultValue={shopData.name || ""} 
                  className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
                  placeholder="The Heritage Shop"
                />
                <p className="text-[10px] text-gray-400">This is public and searchable.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipping_fee">Flat Shipping Fee (₱)</Label>
                <Input 
                  id="shipping_fee" 
                  type="number"
                  defaultValue={shopData.shipping_fee || 0} 
                  className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
                />
                <p className="text-[10px] text-gray-400">Standard delivery fee per order.</p>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Shop Description</Label>
                <Textarea 
                  id="description" 
                  rows={5}
                  defaultValue={shopData.description || ""} 
                  placeholder="Tell customers about your products, your history, and what makes your shop unique..."
                  className="bg-gray-50 border-gray-200 focus:bg-white transition-all resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 sticky bottom-4 z-10">
           <Button type="submit" disabled={updateProfileMutation.isPending || deleteShopMutation.isPending} className="h-12 px-10 rounded-xl shadow-lg shadow-green-600/20 bg-green-600 hover:bg-green-700 text-white font-bold transition-all">
             {updateProfileMutation.isPending ? "Saving Changes..." : "Save Shop Settings"}
             <Save size={18} className="ml-2" />
           </Button>
        </div>
      </form>

      <Separator className="my-10" />

      {/* Danger Zone */}
      <div className="space-y-6 pb-12">
        <div>
          <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
            <AlertTriangle size={24} />
            Danger Zone
          </h2>
          <p className="text-sm text-gray-500 mt-1">Irreversible actions for your shop.</p>
        </div>

        <Card className="border-red-100 bg-red-50/30 overflow-hidden rounded-2xl">
          <CardHeader className="border-b border-red-100 bg-red-50/50">
            <CardTitle className="text-lg text-red-900">Close Shop Forever</CardTitle>
            <CardDescription className="text-red-700/70">
              This will permanently delete your shop, products, and analytics. This action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <p className="text-sm text-red-800 font-medium">To confirm, please prepare your shop name and password.</p>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="rounded-xl h-12 px-8 font-bold shadow-lg shadow-red-200">
                    <Trash2 size={18} className="mr-2" />
                    Delete My Shop
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold text-red-600">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600 text-lg">
                      This action is <span className="font-bold text-red-600">permanent</span>. All your data will be wiped from Icon Shoppers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  
                  <div className="py-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="confirm_name" className="text-sm font-bold">Type your shop name &quot;<span className="text-red-600">{shopData.name}</span>&quot; to confirm:</Label>
                      <Input 
                        id="confirm_name" 
                        value={confirmName}
                        onChange={(e) => setConfirmName(e.target.value)}
                        placeholder={shopData.name}
                        className="bg-white border-red-200 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm_password font-bold" className="text-sm">Enter your account password:</Label>
                      <Input 
                        id="confirm_password" 
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-white border-red-200 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <AlertDialogFooter className="gap-3">
                    <AlertDialogCancel className="h-12 rounded-xl text-lg font-semibold bg-gray-100 border-none hover:bg-gray-200">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteShop();
                      }}
                      disabled={deleteShopMutation.isPending || !confirmName || !confirmPassword}
                      className="h-12 rounded-xl text-lg font-bold bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-200"
                    >
                      {deleteShopMutation.isPending ? "Deleting..." : "Permanently Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShopSettingsPage;
