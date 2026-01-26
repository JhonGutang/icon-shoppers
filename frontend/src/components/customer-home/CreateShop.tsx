"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "../context/SnackbarContext";
import { createShop } from "@/services/shopService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Loader2, ArrowRight } from "lucide-react";
import useAuthStore from "@/stores/useAuthStore";

const CreateShop = () => {
  const router = useRouter();
  const { openSnackbar } = useSnackbar();
  const { setAuth, setSellerMode, accessToken, id } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
  });

  const categories = ["Food", "Electronics", "Art", "Clothing", "Home & Living"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.category) {
      openSnackbar("Please fill in all fields", "error");
      return;
    }

    setIsLoading(true);
    try {
      await createShop(form);
      
      // Update local storage/store to reflect merchant status
      setAuth(accessToken, "merchant", id);
      setSellerMode(true);

      openSnackbar("Shop created successfully! You are now a merchant. Switching to Seller Mode...", "success");
      
      // Redirect to Root which will now show user status
      setTimeout(() => {
          router.push("/");
      }, 1000);
    } catch (error: any) {
      console.error(error);
      openSnackbar(error.response?.data?.message || "Failed to create shop", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full py-10">
      <Card className="w-full max-w-2xl shadow-xl border-t-4 border-t-green-600">
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-50 h-16 w-16 rounded-full flex items-center justify-center mb-4">
            <Store className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Become a Merchant</CardTitle>
          <CardDescription className="text-gray-500 text-lg">
            Ready to share your gourmet delights with the world? <br />
            Create your shop in seconds.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 px-8">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">Shop Name</Label>
              <Input
                id="name"
                placeholder="e.g. Maria's Gourmet Kitchen"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-12 border-gray-200 focus-visible:ring-green-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-semibold">Category</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForm({ ...form, category: cat })}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        form.category === cat 
                        ? "bg-green-600 text-white shadow-md shadow-green-100" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">Shop Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us what makes your shop unique..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="min-h-[120px] border-gray-200 focus-visible:ring-green-500"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 px-8 pb-8">
            <Button 
                type="submit" 
                className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-95" 
                disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" />
                  <span>Creating your shop...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Open My Shop</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
            <p className="text-center text-xs text-gray-400">
              By clicking &quot;Open My Shop&quot;, you agree to our Merchant Terms &amp; Conditions.
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateShop;
