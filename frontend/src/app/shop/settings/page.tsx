"use client";

import React, { useState, useEffect } from "react";
import { getProfile, updateProfile } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Store, 
  Camera, 
  Save, 
  AlertCircle 
} from "lucide-react";
import { useSnackbar } from "@/components/context/SnackbarContext";
import { Skeleton } from "@/components/ui/skeleton";

const ShopSettingsPage = () => {
  const { openSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [shopData, setShopData] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const profile = await getProfile();
      if (profile && profile.shop) {
        setShopData(profile.shop);
      } else {
        openSnackbar("No shop found for this account", "error");
      }
    } catch (err) {
      openSnackbar("Failed to load shop settings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      
      // Shop data
      formData.append("shop_name", shopData.name);
      formData.append("description", shopData.description || "");
      formData.append("shipping_fee", shopData.shipping_fee || "0");

      // Files
      const logoInput = document.getElementById("logo_image") as HTMLInputElement;
      if (logoInput?.files?.[0]) formData.append("logo_image", logoInput.files[0]);

      const bannerInput = document.getElementById("banner_image") as HTMLInputElement;
      if (bannerInput?.files?.[0]) formData.append("banner_image", bannerInput.files[0]);

      await updateProfile(formData);
      openSnackbar("Shop settings updated successfully", "success");
      fetchData(); // Refresh data
    } catch (err) {
      openSnackbar("Failed to update shop settings", "error");
    } finally {
      setSaving(false);
    }
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
           <a href="/profile">Go to Profile</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Shop Settings</h1>
          <p className="text-gray-500">Manage your store's public identity and logistics.</p>
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
                          <img src={shopData.logo_image} className="h-full w-full object-cover" />
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
                       <img src={shopData.banner_image} className="h-full w-full object-cover" />
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
                  value={shopData.name || ""} 
                  onChange={(e) => setShopData({...shopData, name: e.target.value})}
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
                  value={shopData.shipping_fee || 0} 
                  onChange={(e) => setShopData({...shopData, shipping_fee: e.target.value})}
                  className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
                />
                <p className="text-[10px] text-gray-400">Standard delivery fee per order.</p>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Shop Description</Label>
                <Textarea 
                  id="description" 
                  rows={5}
                  value={shopData.description || ""} 
                  onChange={(e) => setShopData({...shopData, description: e.target.value})}
                  placeholder="Tell customers about your products, your history, and what makes your shop unique..."
                  className="bg-gray-50 border-gray-200 focus:bg-white transition-all resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 sticky bottom-4 z-10">
           <Button type="submit" disabled={saving} className="h-12 px-10 rounded-xl shadow-lg shadow-green-600/20 bg-green-600 hover:bg-green-700 text-white font-bold transition-all">
             {saving ? "Saving Changes..." : "Save Shop Settings"}
             <Save size={18} className="ml-2" />
           </Button>
        </div>
      </form>
    </div>
  );
};

export default ShopSettingsPage;
