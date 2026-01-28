"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useCartStore } from "@/stores/useCartStore";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, Truck, MapPin, Wallet, Landmark, ChevronRight } from "lucide-react";
import { useCheckoutMutation } from "@/hooks/mutations/useOrderMutations";
import { addressService } from "@/services/addressService";
import { Address } from "@/types/address";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CheckoutPage = () => {
  const router = useRouter();
  const { productsInCart, clearCart } = useCartStore();
  const checkoutMutation = useCheckoutMutation();
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [notes, setNotes] = useState("");
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await addressService.getAddresses();
        setAddresses(data);
        const def = data.find(a => a.is_default) || data[0];
        if (def) setSelectedAddress(def);
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
      } finally {
        setIsLoadingAddresses(false);
      }
    };
    fetchAddresses();
  }, []);

  if (productsInCart.length === 0) {
    if (typeof window !== 'undefined') router.replace('/cart');
    return null;
  }

  const subtotal = productsInCart.reduce((sum, item) => sum + parseFloat(item.price) * (item.quantity || 1), 0);
  const total = subtotal; // Shipping fee would be dynamic in production

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      alert("Please select a shipping address");
      return;
    }

    const payload = {
      products: productsInCart.map(p => ({ id: p.id, quantity: p.quantity })),
      shipping_address: `${selectedAddress.name}, ${selectedAddress.phone}, ${selectedAddress.street}, ${selectedAddress.barangay}, ${selectedAddress.city}, ${selectedAddress.postal_code}`,
      payment_method: paymentMethod,
      delivery_method: "Standard Delivery",
      notes: notes
    };

    checkoutMutation.mutate(payload, {
      onSuccess: () => {
        clearCart();
        router.push('/orders?success=true');
      }
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MapPin className="text-primary" size={20} />
                  Shipping Address
                </h2>
                <Button variant="outline" size="sm" onClick={() => router.push('/profile?section=address')}>Manage</Button>
              </div>

              {isLoadingAddresses ? (
                <Skeleton className="h-24 w-full rounded-xl" />
              ) : selectedAddress ? (
                <div className="p-4 rounded-xl border-2 border-primary/20 bg-primary/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{selectedAddress.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedAddress.phone}</p>
                      <p className="text-sm mt-1">
                        {selectedAddress.street}, {selectedAddress.barangay}, {selectedAddress.city}, {selectedAddress.postal_code}
                      </p>
                    </div>
                    <Badge variant="secondary">Default</Badge>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center border-2 border-dashed rounded-xl">
                  <p className="text-muted-foreground mb-4">No addresses found</p>
                  <Button onClick={() => router.push('/profile?section=address')}>Add New Address</Button>
                </div>
              )}
            </section>

            {/* Payment Method */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="text-primary" size={20} />
                Payment Method
              </h2>

              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PaymentOption 
                  id="COD" 
                  value="COD" 
                  title="Cash on Delivery" 
                  description="Pay when you receive the items" 
                  icon={<Wallet size={20} />} 
                />
                <PaymentOption 
                  id="GCASH" 
                  value="GCASH" 
                  title="GCash" 
                  description="Pay via GCash app" 
                  disabled 
                  icon={<Landmark size={20} />} 
                />
              </RadioGroup>
            </section>

            {/* Note to Seller */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Note to Seller (Optional)</h2>
              <Textarea 
                placeholder="Any special requests or instructions..." 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-none"
              />
            </section>
          </div>

          {/* Side Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Order Details</h2>
                
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6">
                    {productsInCart.map(item => (
                        <div key={item.id} className="flex gap-3">
                            <img 
                                src={item.image ? `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${item.image}` : "https://placehold.co/100x100"} 
                                alt={item.name}
                                className="h-12 w-12 rounded object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.quantity} x ₱{parseFloat(item.price).toLocaleString()}</p>
                            </div>
                            <div className="text-sm font-bold">
                                ₱{(parseFloat(item.price) * (item.quantity || 1)).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₱{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping Fee</span>
                    <span className="font-medium">₱0.00</span>
                  </div>
                </div>
                
                <hr className="my-4" />
                
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">₱{total.toLocaleString()}</span>
                </div>
                
                <Button 
                    className="w-full mt-6 h-12 rounded-full text-lg font-bold shadow-lg"
                    onClick={handlePlaceOrder}
                    disabled={checkoutMutation.isPending}
                >
                  {checkoutMutation.isPending ? "Processing..." : "Place Order"}
                </Button>
                
                <p className="mt-4 text-[10px] text-center text-muted-foreground">
                    By placing an order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </section>
              
              <div className="flex items-center gap-3 bg-primary/10 p-4 rounded-xl border border-primary/20">
                <Truck className="text-primary" size={24} />
                <div>
                   <p className="text-xs font-bold uppercase tracking-wider text-primary">Standard Delivery</p>
                   <p className="text-[10px] text-muted-foreground">Estimated arrival in 3-5 business days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const PaymentOption = ({ id, value, title, description, icon, disabled = false }: any) => (
  <div className={cn(
    "relative flex items-center gap-4 rounded-xl border-2 p-4 transition-all cursor-pointer hover:bg-muted/50",
    disabled ? "opacity-50 grayscale cursor-not-allowed" : ""
  )}>
    <RadioGroupItem value={value} id={id} disabled={disabled} className="sr-only" />
    <Label 
        htmlFor={id} 
        className={cn(
            "flex-1 flex items-center gap-4 cursor-pointer",
            disabled ? "cursor-not-allowed" : ""
        )}
    >
      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
        {icon}
      </div>
      <div>
        <p className="font-bold">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </Label>
    <div className="absolute right-4">
        {/* custom indicator would go here */}
    </div>
  </div>
);

export default CheckoutPage;
