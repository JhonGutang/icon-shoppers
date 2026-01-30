"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "../context/SnackbarContext";
import { useCreateShop } from "@/hooks/mutations/useShopMutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Loader2, ArrowRight, Camera, Image as ImageIcon, Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";
import useAuthStore from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";

interface FormErrors {
  name?: string;
  description?: string;
  category?: string;
  shipping_fee?: string;
  password?: string;
  logo_image?: string;
  banner_image?: string;
}

const CreateShop = () => {
  const router = useRouter();
  const { openSnackbar } = useSnackbar();
  const { setAuth, setSellerMode, accessToken, id } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  
  const createShopMutation = useCreateShop();
  
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    shipping_fee: "0",
    status: "active",
    password: "",
  });

  const [files, setFiles] = useState<{
    logo: File | null;
    banner: File | null;
  }>({
    logo: null,
    banner: null,
  });

  const [previews, setPreviews] = useState<{
    logo: string | null;
    banner: string | null;
  }>({
    logo: null,
    banner: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const categories = ["Food", "Electronics", "Art", "Clothing", "Home & Living"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > (type === 'logo' ? 2 * 1024 * 1024 : 5 * 1024 * 1024)) {
        openSnackbar(`${type === 'logo' ? 'Logo' : 'Banner'} size must be less than ${type === 'logo' ? '2MB' : '5MB'}`, "error");
        return;
      }
      
      setFiles(prev => ({ ...prev, [type]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
      
      setErrors(prev => ({ ...prev, [`${type}_image`]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Shop name is required";
    if (!form.description.trim()) newErrors.description = "Shop description is required";
    if (!form.category) newErrors.category = "Please select a category";
    if (!form.shipping_fee || isNaN(Number(form.shipping_fee))) newErrors.shipping_fee = "Shipping fee must be a valid number";
    if (!form.password) newErrors.password = "Account password is required for confirmation";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      openSnackbar("Please fix the errors in the form", "error");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("shipping_fee", form.shipping_fee);
    formData.append("status", form.status);
    formData.append("password", form.password);
    
    if (files.logo) formData.append("logo_image", files.logo);
    if (files.banner) formData.append("banner_image", files.banner);

    createShopMutation.mutate(formData, {
      onSuccess: () => {
        setAuth(accessToken, "merchant", id, true);
        setSellerMode(true);
        openSnackbar("Shop created successfully!", "success");
        setTimeout(() => router.push("/shop"), 1500);
      },
      onError: (error: any) => {
        const backendMessage = error.response?.data?.message || "Failed to create shop";
        openSnackbar(backendMessage, "error");
        if (error.response?.data?.errors) {
          setErrors(error.response.data.errors);
        }
      }
    });
  };

  return (
    <div className="flex justify-center items-center h-full py-10 px-4">
      <Card className="w-full max-w-3xl shadow-2xl border-none rounded-3xl overflow-hidden bg-white">
        <div className="h-2 bg-green-600 w-full" />
        <CardHeader className="text-center pt-10 pb-6 px-8">
          <div className="mx-auto bg-green-50 h-20 w-20 rounded-2xl flex items-center justify-center mb-4 rotate-3 shadow-inner">
            <Store className="h-10 w-10 text-green-600 -rotate-3" />
          </div>
          <CardTitle className="text-4xl font-extrabold tracking-tight text-gray-900 border-none px-0">Forge Your Legacy</CardTitle>
          <CardDescription className="text-gray-500 text-lg max-w-md mx-auto mt-2">
            Create a premium storefront and start connecting with local shoppers in seconds.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-10 px-10 pb-10">
            {/* Visuals Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="h-5 w-5 text-green-600" />
                <h3 className="font-bold text-gray-800 uppercase tracking-widest text-xs">Visual Branding</h3>
              </div>
              
              <div className="grid md:grid-cols-12 gap-6">
                {/* Banner Upload */}
                <div className="md:col-span-8 group relative h-40 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 transition-all hover:bg-gray-100/50">
                  {previews.banner ? (
                    <img src={previews.banner} alt="Banner preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                      <ImageIcon size={32} />
                      <span className="text-xs font-medium">Upload Shop Banner</span>
                    </div>
                  )}
                  <button 
                    type="button" 
                    onClick={() => bannerInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
                  >
                    <div className="bg-white p-3 rounded-full text-green-600 shadow-xl">
                      <Camera size={24} />
                    </div>
                  </button>
                  <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} />
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-gray-600 shadow-sm border border-white">BANNER (1200x400)</span>
                  </div>
                </div>

                {/* Logo Upload */}
                <div className="md:col-span-4 group relative h-40 aspect-square mx-auto rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 bg-emerald-50 transition-all hover:bg-emerald-100/30">
                  {previews.logo ? (
                    <img src={previews.logo} alt="Logo preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-emerald-300 gap-2">
                      <Store size={32} />
                      <span className="text-xs font-medium">Shop Logo</span>
                    </div>
                  )}
                  <button 
                    type="button" 
                    onClick={() => logoInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
                  >
                    <div className="bg-white p-3 rounded-full text-green-600 shadow-xl">
                      <Camera size={20} />
                    </div>
                  </button>
                  <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                </div>
              </div>
            </div>

            {/* Identity Section */}
            <div className="space-y-6 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Store className="h-5 w-5 text-green-600" />
                <h3 className="font-bold text-gray-800 uppercase tracking-widest text-xs">Shop Identity</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="name" className={cn("text-xs font-bold uppercase tracking-wider", errors.name && "text-red-500")}>Shop Name <span className="text-red-500">*</span></Label>
                    {errors.name && <span className="text-[10px] font-bold text-red-500 animate-in fade-in slide-in-from-right-2">{errors.name}</span>}
                  </div>
                  <Input
                    id="name"
                    placeholder="e.g. Maria's Gourmet Kitchen"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={cn(
                      "h-14 border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white transition-all text-lg",
                      errors.name && "border-red-500 ring-1 ring-red-500 bg-red-50/10"
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="shipping_fee" className={cn("text-xs font-bold uppercase tracking-wider", errors.shipping_fee && "text-red-500")}>Shipping Fee (₱) <span className="text-red-500">*</span></Label>
                    {errors.shipping_fee && <span className="text-[10px] font-bold text-red-500">{errors.shipping_fee}</span>}
                  </div>
                  <Input
                    id="shipping_fee"
                    type="number"
                    value={form.shipping_fee}
                    onChange={(e) => setForm({ ...form, shipping_fee: e.target.value })}
                    className={cn(
                        "h-14 border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white transition-all text-lg",
                        errors.shipping_fee && "border-red-500 ring-1 ring-red-500"
                    )}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className={cn("text-xs font-bold uppercase tracking-wider", errors.category && "text-red-500")}>Primary Category <span className="text-red-500">*</span></Label>
                  {errors.category && <span className="text-[10px] font-bold text-red-500">{errors.category}</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setForm({ ...form, category: cat });
                        setErrors(prev => ({...prev, category: undefined}));
                      }}
                      className={cn(
                        "px-6 py-3 rounded-2xl text-sm font-bold transition-all border-2",
                        form.category === cat 
                          ? "bg-green-600 text-white border-green-600 shadow-lg shadow-green-100 scale-105" 
                          : "bg-white text-gray-500 border-gray-100 hover:border-green-200 hover:text-green-600",
                        errors.category && form.category !== cat && "border-red-200"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="description" className={cn("text-xs font-bold uppercase tracking-wider", errors.description && "text-red-500")}>Shop Story <span className="text-red-500">*</span></Label>
                  {errors.description && <span className="text-[10px] font-bold text-red-500">{errors.description}</span>}
                </div>
                <Textarea
                  id="description"
                  placeholder="Share your passion, the origin of your products, and what makes your shop a local favorite..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={cn(
                    "min-h-[160px] max-h-[300px] border-gray-100 bg-gray-50/50 rounded-2xl focus:bg-white transition-all text-base p-5 leading-relaxed",
                    errors.description && "border-red-500 ring-1 ring-red-500 bg-red-50/10"
                  )}
                />
              </div>

              <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => setForm(f => ({ ...f, status: f.status === 'active' ? 'inactive' : 'active' }))}
                  style={{ backgroundColor: form.status === 'active' ? '#16a34a' : '#e5e7eb' }}
                >
                  <span
                    className={cn(
                      "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
                      form.status === 'active' ? "translate-x-5" : "translate-x-1"
                    )}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800">Shop Visibility</span>
                  <span className="text-[10px] text-gray-400">{form.status === 'active' ? 'Publicly visible and searchable' : 'Currently hidden (you can enable it later)'}</span>
                </div>
              </div>
            </div>

            {/* Confirmation Section */}
            <div className="pt-10 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="h-5 w-5 text-green-600" />
                <h3 className="font-bold text-gray-800 uppercase tracking-widest text-xs">Security Confirmation</h3>
              </div>
              
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 mb-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-2 rounded-xl text-green-600 shadow-sm">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-green-900">Merchant Responsibility</h4>
                    <p className="text-xs text-green-800 mt-1 leading-relaxed">By creating this shop, you confirm that all information provided is accurate and that you adhere to our Merchant Conduct Policy.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password" className={cn("text-xs font-bold uppercase tracking-wider", errors.password && "text-red-500")}>Confirm your account Password <span className="text-red-500">*</span></Label>
                    {errors.password && <span className="text-[10px] font-bold text-red-500">{errors.password}</span>}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className={cn(
                        "h-14 pl-12 pr-12 border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white transition-all text-lg",
                        errors.password && "border-red-500 ring-1 ring-red-500 bg-red-50/10"
                      )}
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-green-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="px-10 pb-12">
            <Button 
                type="submit" 
                className="w-full h-16 text-xl font-black bg-green-600 hover:bg-green-700 shadow-2xl shadow-green-200 transition-all active:scale-[0.98] rounded-2xl disabled:opacity-70" 
                disabled={createShopMutation.isPending}
            >
              {createShopMutation.isPending ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="animate-spin h-6 w-6" />
                  <span>Enrolling your business...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span>Open My Shop</span>
                  <ArrowRight className="h-6 w-6" />
                </div>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      {/* Toast-like Success Overlay (Optional Visual) */}
      {createShopMutation.isPending && false && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-500">
           <div className="flex flex-col items-center gap-4">
              <div className="bg-green-100 p-6 rounded-full text-green-600 animate-bounce">
                 <CheckCircle2 size={64} />
              </div>
              <h2 className="text-3xl font-black text-gray-900">Your Legacy Awaits</h2>
              <p className="text-gray-500 font-medium">Redirecting you to the Seller Dashboard...</p>
           </div>
        </div>
      )}
    </div>
  );
};

// Simple icon for consistency if not imported
function ShieldCheck({ size }: { size: number }) {
  return <CheckCircle2 size={size} />;
}

export default CreateShop;
