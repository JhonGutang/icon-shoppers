"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/components/shared/context/SnackbarContext";
import { useCreateShop } from "@/hooks/shop/useShopMutations";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import { Textarea } from "@/components/shared/ui/textarea";
import { Store, Loader2, ArrowRight, Camera, Image as ImageIcon, Eye, EyeOff, Lock, CheckCircle2, ChevronLeft, Package, ShieldCheck } from "lucide-react";
import useAuthStore from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
  const { setAuth, setSellerMode, accessToken, id, name } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
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

  const validateStep = (step: number) => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (step === 1) {
      if (!form.name.trim()) newErrors.name = "Shop name is required";
      if (!form.description.trim()) newErrors.description = "Shop description is required";
      if (!form.category) newErrors.category = "Please select a category";
    }

    if (step === 3) {
      if (!form.shipping_fee || isNaN(Number(form.shipping_fee))) newErrors.shipping_fee = "Shipping fee must be a number";
      if (!form.password) newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    } else {
      setErrors({});
    }

    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    } else {
      openSnackbar("Please fill in all required fields", "error");
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(createShopMutation.isPending ? currentStep : 3)) { // Prevent submission if invalid
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
        setAuth(accessToken, "merchant", id, name, true);
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

  const steps = [
    { id: 1, label: "Essentials", description: "Name & Category" },
    { id: 2, label: "Branding", description: "Logo & Banner" },
    { id: 3, label: "Finalize", description: "Settings & Security" }
  ];

  return (
    <div className="flex h-full w-full overflow-hidden bg-stone-50/50">
      
      {/* Left Sidebar - Progress */}
      <div className="w-80 border-r border-stone-200 bg-white/50 backdrop-blur-sm p-8 flex flex-col hidden md:flex">
         <div className="mb-12">
            <div className="flex items-center gap-3">
                <div className="bg-[#0E6835] p-2.5 rounded-xl shadow-lg shadow-[#0E6835]/20">
                    <Store className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="font-black text-xl text-stone-900 tracking-tight leading-none">Setup Shop</h1>
                    <span className="text-xs text-stone-500 font-medium">Build your legacy</span>
                </div>
            </div>
         </div>

         <div className="flex-1 relative">
            {/* Connecting Line */}
            <div className="absolute left-[19px] top-4 bottom-[calc(100%-140px)] w-0.5 bg-stone-100 -z-10"></div>
            
            {/* Active Line Progress */}
            <div 
                className="absolute left-[19px] top-4 w-0.5 bg-[#0E6835] transition-all duration-500 ease-in-out -z-10" 
                style={{ height: `${((currentStep - 1) / (steps.length - 1)) * (steps.length * 60)}px` }} 
            ></div>

            <div className="flex flex-col gap-12">
                {steps.map((step) => (
                    <div key={step.id} className="flex items-start gap-4 group cursor-pointer" onClick={() => step.id < currentStep && setCurrentStep(step.id)}>
                        <div 
                            className={cn(
                                "relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 font-bold text-sm shrink-0",
                                currentStep >= step.id 
                                    ? "bg-[#0E6835] border-white text-white shadow-lg shadow-[#0E6835]/20 ring-1 ring-[#0E6835]" 
                                    : "bg-white border-stone-200 text-stone-300"
                            )}
                        >
                            {currentStep > step.id ? <CheckCircle2 size={18} /> : step.id}
                        </div>
                        <div className="pt-1.5 transition-all duration-300">
                            <h3 className={cn("text-xs font-black uppercase tracking-widest", currentStep >= step.id ? "text-[#0E6835]" : "text-stone-400")}>
                                {step.label}
                            </h3>
                            <p className="text-[10px] text-stone-400 font-medium mt-0.5">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
         </div>

         <div className="text-[10px] text-stone-400 font-medium leading-relaxed">
            Need help? <span className="text-[#0E6835] underline cursor-pointer">Contact Support</span>
         </div>
      </div>

      {/* Right Content - Form */}
      <div className="flex-1 flex flex-col h-full bg-stone-50/30 overflow-hidden relative">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            
            {/* Mobile Header (Only visible on small screens) */}
            <div className="md:hidden p-4 border-b border-stone-200 bg-white flex justify-between items-center">
                 <span className="font-bold text-stone-900">Step {currentStep} of 3</span>
                 <span className="text-xs font-black uppercase text-[#0E6835]">{steps[currentStep-1].label}</span>
            </div>

            <div className="flex-1 h-full overflow-y-auto custom-scrollbar px-6 pt-6 lg:px-12 lg:pt-12" style={{ scrollbarGutter: "stable" }}>
                <div className="max-w-4xl w-full h-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="min-h-full w-full flex flex-col justify-start"
                        >
                            {/* Step Titles */}
                            <div className="mb-8">
                                <h2 className="text-3xl font-black text-stone-900 tracking-tight">
                                    {currentStep === 1 && "Let's start with the basics"}
                                    {currentStep === 2 && "Make it stand out"}
                                    {currentStep === 3 && "Final Touches"}
                                </h2>
                                <p className="text-stone-500 mt-2 text-lg font-light">
                                    {currentStep === 1 && "Tell us about your business so customers can find you."}
                                    {currentStep === 2 && "Add visuals that represent your brand's personality."}
                                    {currentStep === 3 && "Configure your shop settings and secure your account."}
                                </p>
                            </div>

                            {/* Step 1 Form */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                     <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <Label htmlFor="name" className={cn("text-xs font-bold uppercase tracking-wider text-stone-600", errors.name && "text-red-500")}>Shop Name <span className="text-red-500">*</span></Label>
                                                {errors.name && <span className="text-[10px] font-bold text-red-500 animate-in fade-in slide-in-from-right-2">{errors.name}</span>}
                                            </div>
                                            <Input
                                                id="name"
                                                placeholder="e.g. Maria's Gourmet Kitchen"
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                className={cn(
                                                "h-14 border-stone-200 bg-white rounded-xl focus:bg-white focus:ring-[#0E6835] focus:border-[#0E6835] transition-all text-lg placeholder:text-stone-300 text-stone-800 shadow-sm",
                                                errors.name && "border-red-500 ring-1 ring-red-500 bg-red-50/10"
                                                )}
                                                autoFocus
                                            />
                                        </div>
                                        
                                        <div className="space-y-3">
                                             <div className="flex justify-between">
                                                <Label className={cn("text-xs font-bold uppercase tracking-wider text-stone-600", errors.category && "text-red-500")}>Primary Category <span className="text-red-500">*</span></Label>
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
                                                        "px-5 py-2.5 rounded-xl text-xs font-bold transition-all border shadow-sm",
                                                        form.category === cat 
                                                        ? "bg-[#0E6835] text-white border-[#0E6835] shadow-lg shadow-[#0E6835]/20 scale-105" 
                                                        : "bg-white text-stone-500 border-stone-100 hover:border-[#0E6835]/30 hover:text-[#0E6835]",
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
                                                <Label htmlFor="description" className={cn("text-xs font-bold uppercase tracking-wider text-stone-600", errors.description && "text-red-500")}>Shop Story <span className="text-red-500">*</span></Label>
                                                {errors.description && <span className="text-[10px] font-bold text-red-500">{errors.description}</span>}
                                            </div>
                                            <Textarea
                                                id="description"
                                                placeholder="Share your passion, the origin of your products, and what makes your shop a local favorite..."
                                                value={form.description}
                                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                                className={cn(
                                                    "field-sizing-fixed min-h-[160px] border-stone-200 bg-white rounded-2xl focus:bg-white focus:ring-[#0E6835] focus:border-[#0E6835] transition-all text-base p-5 leading-relaxed placeholder:text-stone-300 text-stone-800 shadow-sm resize-none",
                                                    errors.description && "border-red-500 ring-1 ring-red-500 bg-red-50/10"
                                                )}
                                            />
                                        </div>
                                     </div>
                                </div>
                            )}

                            {/* Step 2 Form */}
                            {currentStep === 2 && (
                                <div className="space-y-8">
                                     <div className="flex flex-col gap-8">
                                        <div className="space-y-3">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-stone-600">Shop Banner</Label>
                                            <div className="group relative h-48 rounded-2xl overflow-hidden border-2 border-dashed border-stone-200 bg-white transition-all hover:bg-stone-50 hover:border-stone-300">
                                                {previews.banner ? (
                                                    <img src={previews.banner} alt="Banner preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 gap-2">
                                                        <ImageIcon size={32} />
                                                        <span className="text-xs font-medium">Upload Shop Banner (1200x400)</span>
                                                    </div>
                                                )}
                                                <button 
                                                    type="button" 
                                                    onClick={() => bannerInputRef.current?.click()}
                                                    className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]"
                                                >
                                                    <div className="bg-white p-3 rounded-full text-[#0E6835] shadow-xl transform group-hover:scale-110 transition-transform">
                                                        <Camera size={24} />
                                                    </div>
                                                </button>
                                                <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                             <Label className="text-xs font-bold uppercase tracking-wider text-stone-600">Shop Logo</Label>
                                             <div className="flex items-center gap-6">
                                                <div className="group relative h-32 w-32 shrink-0 rounded-2xl overflow-hidden border-2 border-dashed border-stone-200 bg-white transition-all hover:bg-stone-50 hover:border-stone-300">
                                                    {previews.logo ? (
                                                        <img src={previews.logo} alt="Logo preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 gap-2">
                                                            <Store size={24} />
                                                            <span className="text-[10px] font-medium">Logo</span>
                                                        </div>
                                                    )}
                                                    <button 
                                                        type="button" 
                                                        onClick={() => logoInputRef.current?.click()}
                                                        className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]"
                                                    >
                                                        <div className="bg-white p-2.5 rounded-full text-[#0E6835] shadow-xl transform group-hover:scale-110 transition-transform">
                                                            <Camera size={18} />
                                                        </div>
                                                    </button>
                                                    <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                                                </div>
                                                <div className="space-y-2">
                                                    <h4 className="font-bold text-stone-800 text-sm">Logo Guidelines</h4>
                                                    <p className="text-xs text-stone-500 leading-relaxed max-w-xs">
                                                        Upload a clear image of your logo. Square images work best (e.g. 400x400px). 
                                                        Max file size is 2MB.
                                                    </p>
                                                </div>
                                             </div>
                                        </div>
                                     </div>
                                </div>
                            )}

                            {/* Step 3 Form */}
                            {currentStep === 3 && (
                                <div className="space-y-8">
                                     <div className="space-y-6">
                                        <div className="p-6 bg-white rounded-2xl border border-stone-100 shadow-sm space-y-6">
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <Label htmlFor="shipping_fee" className={cn("text-xs font-bold uppercase tracking-wider text-stone-600", errors.shipping_fee && "text-red-500")}>Shipping Fee (₱) <span className="text-red-500">*</span></Label>
                                                        {errors.shipping_fee && <span className="text-[10px] font-bold text-red-500">{errors.shipping_fee}</span>}
                                                    </div>
                                                    <Input
                                                        id="shipping_fee"
                                                        type="number"
                                                        value={form.shipping_fee}
                                                        onChange={(e) => setForm({ ...form, shipping_fee: e.target.value })}
                                                        className={cn(
                                                            "h-14 border-stone-200 bg-stone-50/30 rounded-xl focus:bg-white focus:ring-[#0E6835] focus:border-[#0E6835] transition-all text-lg placeholder:text-stone-400 text-stone-800",
                                                            errors.shipping_fee && "border-red-500 ring-1 ring-red-500"
                                                        )}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold uppercase tracking-wider text-stone-600">Shop Status</Label>
                                                    <div className="flex items-center space-x-3 bg-stone-50/50 p-3 rounded-xl border border-stone-200 h-14 cursor-pointer hover:bg-stone-100 transition-colors"
                                                         onClick={() => setForm(f => ({ ...f, status: f.status === 'active' ? 'inactive' : 'active' }))}
                                                    >
                                                        <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                        style={{ backgroundColor: form.status === 'active' ? '#0E6835' : '#e5e7eb' }}
                                                        >
                                                        <span
                                                            className={cn(
                                                            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
                                                            form.status === 'active' ? "translate-x-5" : "translate-x-1"
                                                            )}
                                                        />
                                                        </div>
                                                        <div className="flex flex-col leading-none">
                                                        <span className="text-sm font-bold text-stone-800">{form.status === 'active' ? 'Active' : 'Hidden'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                             </div>
                                        </div>

                                        <div className="space-y-4 pt-2">
                                            <div className="bg-white rounded-2xl p-5 border border-amber-100 flex gap-4 shadow-sm">
                                                 <div className="bg-amber-100 p-2 rounded-lg h-fit text-amber-700">
                                                    <ShieldCheck className="shrink-0" size={20} />
                                                 </div>
                                                 <div className="space-y-1">
                                                    <h4 className="text-sm font-bold text-stone-900">Security Check</h4>
                                                    <div className="text-xs text-stone-500 leading-relaxed">
                                                        Please enter your password to confirm that you are the owner of this account and authorize the creation of this shop.
                                                    </div>
                                                 </div>
                                            </div>

                                            <div className="space-y-2 relative">
                                                <div className="flex justify-between">
                                                    <Label htmlFor="password" className={cn("text-xs font-bold uppercase tracking-wider text-stone-600", errors.password && "text-red-500")}>Account Password <span className="text-red-500">*</span></Label>
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
                                                        "h-14 pl-12 pr-12 border-stone-200 bg-white rounded-xl focus:bg-white focus:ring-[#0E6835] focus:border-[#0E6835] transition-all text-lg text-stone-800 placeholder:text-stone-300 shadow-sm",
                                                        errors.password && "border-red-500 ring-1 ring-red-500 bg-red-50/10"
                                                    )}
                                                    />
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={20} />
                                                    <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-[#0E6835] transition-colors"
                                                    >
                                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                     </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-stone-200 bg-white/50 backdrop-blur-md flex gap-4 md:px-12 items-center">
                {currentStep > 1 && (
                     <Button 
                     type="button"
                     onClick={handleBack}
                     variant="ghost"
                     className="h-11 rounded-xl text-stone-500 hover:bg-stone-100 hover:text-stone-900 font-bold uppercase tracking-widest text-[11px] px-6"
                    >
                     <ChevronLeft className="mr-2 h-4 w-4" />
                     Back
                    </Button>
                )}

                <Button 
                    type="submit" 
                    onClick={(e) => {
                        if (currentStep < 3) {
                            e.preventDefault();
                            handleNext();
                        }
                    }}
                    className="flex-1 h-11 rounded-xl bg-[#0E6835] text-white hover:bg-[#0E6835]/90 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-[#0E6835]/10 transition-all active:scale-[0.98] disabled:opacity-70"
                    disabled={createShopMutation.isPending}
                >
                {currentStep < 3 ? (
                    <>
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                ) : (
                    <>
                        {createShopMutation.isPending ? (
                            <div className="flex items-center gap-3">
                            <Loader2 className="animate-spin h-4 w-4" />
                            <span>Processing...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                            <span>Open My Shop</span>
                            <Package className="h-4 w-4" />
                            </div>
                        )}
                    </>
                )}
                </Button>
            </div>
        </form>
      </div>
      
      {/* Toast-like Success Overlay */}
      {createShopMutation.isPending && false && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-500">
           <div className="flex flex-col items-center gap-4">
              <div className="bg-stone-100 p-6 rounded-full text-[#0E6835] animate-bounce">
                 <CheckCircle2 size={64} />
              </div>
              <h2 className="text-3xl font-black text-stone-900">Your Legacy Awaits</h2>
              <p className="text-stone-500 font-medium">Redirecting you to the Seller Dashboard...</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default CreateShop;
