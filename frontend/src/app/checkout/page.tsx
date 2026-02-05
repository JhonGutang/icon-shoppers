"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/shared/layout/Navbar";
import { useCartStore } from "@/stores/useCartStore";
import { Button } from "@/components/shared/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/shared/ui/radio-group";
import { Label } from "@/components/shared/ui/label";
import { Textarea } from "@/components/shared/ui/textarea";
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  Wallet, 
  Landmark, 
  ShoppingBasket,
  ChevronLeft,
  Store,
  MessageSquareQuote,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/shared/ui/alert-dialog";
import { useCheckoutMutation } from "@/hooks/order/useOrderMutations";
import { addressService } from "@/services/addressService";
import { Address } from "@/types/address";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/shared/ui/skeleton";
import { Badge } from "@/components/shared/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ProductInCart } from "@/types/product";

const CheckoutPage = () => {
  const router = useRouter();
  const { productsToCheckout, clearCart, clearProductsToCheckout } = useCartStore();
  const checkoutMutation = useCheckoutMutation();
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [notes, setNotes] = useState("");
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

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

  useEffect(() => {
    if (productsToCheckout.length === 0 && !isNavigating) {
      router.replace('/cart');
    }
  }, [productsToCheckout, router, isNavigating]);

  // Group items by shop for display
  const groupedOrders = useMemo(() => {
    const groups: Record<number, { shopName: string; shopLogo?: string; items: ProductInCart[] }> = {};
    
    productsToCheckout.forEach((item) => {
      const shopId = item.shop_id || 0;
      const shopName = item.shop?.name || item.shop_name || "Unknown Shop";
      const shopLogo = item.shop?.logo_image;
      
      if (!groups[shopId]) {
        groups[shopId] = { shopName, shopLogo, items: [] };
      }
      groups[shopId].items.push(item);
    });
    
    return groups;
  }, [productsToCheckout]);

  const subtotal = productsToCheckout.reduce((sum, item) => sum + parseFloat(item.price) * (item.quantity || 1), 0);
  const total = subtotal; // Shipping fee would be dynamic in production

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      alert("Please select a shipping address");
      return;
    }
    setIsConfirmDialogOpen(true);
  };

  const confirmOrder = () => {
    if (!selectedAddress) return;

    const payload = {
      products: productsToCheckout.map(p => ({ id: p.id, quantity: p.quantity })),
      shipping_address: `${selectedAddress.name}, ${selectedAddress.phone}, ${selectedAddress.street}, ${selectedAddress.barangay}, ${selectedAddress.city}, ${selectedAddress.postal_code}`,
      payment_method: paymentMethod,
      delivery_method: "Standard Delivery",
      notes: notes
    };

    checkoutMutation.mutate(payload, {
      onSuccess: () => {
        setIsNavigating(true);
        router.push('/orders');
        clearCart();
        clearProductsToCheckout();
      }
    });
  };

  if (productsToCheckout.length === 0) return null;

  return (
    <div className="flex min-h-screen flex-col bg-stone-50/50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-10 flex-1">
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full bg-white shadow-sm hover:shadow-md transition-all border border-stone-100">
              <ChevronLeft size={24} className="text-stone-600" />
            </Button>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-stone-900">Checkout</h1>
              <nav className="flex items-center gap-2 text-sm text-stone-400 mt-1">
                <Link href="/cart" className="hover:text-[#0E6835] transition-colors font-medium">Cart</Link>
                <span>/</span>
                <span className="text-stone-900 font-bold">Checkout</span>
              </nav>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50 text-[#0E6835] rounded-full border border-green-100 text-sm font-bold">
            <ShieldCheck size={18} />
            Secure Checkout
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Column - Order details (Grouped by Shop) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-black flex items-center gap-3 text-stone-900">
                <ShoppingBasket className="text-[#0E6835]" size={24} />
                Order Details
                <Badge variant="outline" className="ml-2 font-bold px-3 py-1 bg-white border-stone-200 text-stone-600">
                  {productsToCheckout.length} Items
                </Badge>
              </h2>
            </div>
            
            <div className="space-y-6">
              {Object.entries(groupedOrders).map(([shopId, group]) => (
                <div key={shopId} className="bg-white rounded-[2rem] border border-stone-200 overflow-hidden shadow-sm transition-all hover:shadow-md group">
                  {/* Shop Header */}
                  <div className="bg-stone-50 px-8 py-5 border-b border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-[#0E6835]/10 flex items-center justify-center overflow-hidden border-2 border-[#0E6835]/20">
                         {group.shopLogo ? (
                           <img 
                            src={`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${group.shopLogo}`} 
                            alt={group.shopName}
                            className="h-full w-full object-cover"
                           />
                         ) : (
                           <Store size={20} className="text-[#0E6835]" />
                         ) }
                      </div>
                      <div>
                        <span className="font-black text-lg block leading-none text-stone-900">{group.shopName}</span>
                        <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mt-1 block">Official Store</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-stone-100 text-stone-600 font-bold border-none capitalize">
                      {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                    </Badge>
                  </div>

                  {/* Products List */}
                  <div className="divide-y divide-stone-50 bg-white">
                    {group.items.map((item) => (
                      <div key={item.id} className="p-8 flex gap-6 hover:bg-stone-50/50 transition-colors">
                        <div className="h-28 w-28 flex-shrink-0 rounded-[1.5rem] overflow-hidden bg-stone-50 border border-stone-100 shadow-inner">
                          <img 
                            src={item.image ? `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${item.image}` : "https://placehold.co/100x100"} 
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0 py-1">
                          <div className="flex flex-col h-full justify-between">
                            <div>
                              <p className="font-bold text-lg text-stone-900 mb-1 line-clamp-1 group-hover:text-[#0E6835] transition-colors">{item.name}</p>
                              <p className="text-stone-400 text-sm line-clamp-2 leading-relaxed">Quality fulfillment from {group.shopName}</p>
                            </div>
                            
                            <div className="flex items-end justify-between mt-4">
                              <div className="flex items-center gap-3 text-stone-400">
                                <span className="text-sm font-medium">Quantity:</span>
                                <Badge variant="outline" className="bg-white font-black text-sm px-3 rounded-lg border-2 border-stone-100 text-stone-900">
                                  {item.quantity}
                                </Badge>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-stone-300 font-medium mb-1 line-through">₱{(parseFloat(item.price) * 1.2).toLocaleString()}</p>
                                <p className="text-2xl font-black text-[#0E6835]">₱{parseFloat(item.price).toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shop Order Footer (Brief info) */}
                  <div className="bg-stone-50 px-8 py-4 border-t border-stone-100 flex items-center justify-between">
                     <div className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                        <Truck size={14} className="text-[#0E6835]" />
                        Next Day Shipping Available
                     </div>
                     <div className="flex items-baseline gap-2">
                        <span className="text-xs font-bold text-stone-400">Store Subtotal:</span>
                        <span className="text-lg font-black text-stone-900">₱{group.items.reduce((acc, i) => acc + (parseFloat(i.price) * i.quantity), 0).toLocaleString()}</span>
                     </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Guarantee / Security */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-8 rounded-[2rem] bg-indigo-50/50 border border-indigo-100/50">
               <div className="h-14 w-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <ShieldCheck size={32} />
               </div>
               <div>
                  <h4 className="font-black text-indigo-900 leading-none mb-1">Icon Shoppers Protection</h4>
                  <p className="text-sm text-indigo-700/70">Your payment is only released to the seller once you confirm receipt of order.</p>
               </div>
            </div>
          </div>

          {/* Sidebar Column - Shipping, Payment, Notes */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              {/* Shipping Address Container */}
              <section className="bg-white rounded-[2rem] border border-stone-200 p-8 shadow-sm overflow-hidden relative">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black flex items-center gap-3 text-stone-900">
                    <MapPin className="text-[#0E6835]" size={24} />
                    Shipping
                  </h2>
                  <Button variant="outline" size="sm" onClick={() => router.push('/profile?section=address')} className="rounded-full font-bold px-4 border-2 border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors">
                    Change
                  </Button>
                </div>

                {isLoadingAddresses ? (
                  <Skeleton className="h-32 w-full rounded-2xl" />
                ) : selectedAddress ? (
                  <div className="p-5 rounded-2xl border-2 border-[#0E6835]/10 bg-[#0E6835]/5 group transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-black text-lg text-[#0E6835]">{selectedAddress.name}</p>
                      <Badge className="bg-[#0E6835] text-white font-bold border-none text-[10px]">DEFAULT</Badge>
                    </div>
                    <p className="text-sm font-bold text-stone-500 mb-3">{selectedAddress.phone}</p>
                    <div className="bg-white/50 p-3 rounded-xl border border-[#0E6835]/5">
                      <p className="text-xs font-semibold leading-relaxed text-stone-600">
                        {selectedAddress.street}, {selectedAddress.barangay}, {selectedAddress.city}, {selectedAddress.postal_code}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50">
                    <AlertCircle className="mx-auto text-stone-300 mb-3" size={32} />
                    <p className="text-sm font-bold text-stone-400 mb-4">No shipping address found</p>
                    <Button onClick={() => router.push('/profile?section=address')} className="rounded-full bg-[#0E6835]">Add Address</Button>
                  </div>
                )}
              </section>

              {/* Payment Method Container */}
              <section className="bg-white rounded-[2rem] border border-stone-200 p-8 shadow-sm">
                <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-stone-900">
                  <CreditCard className="text-[#0E6835]" size={24} />
                  Payment
                </h2>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  <PaymentOption 
                    id="COD" 
                    value="COD" 
                    title="Cash on Delivery" 
                    description="Pay with cash upon arrival" 
                    icon={<Wallet size={20} />} 
                  />
                  <PaymentOption 
                    id="GCASH" 
                    value="GCASH" 
                    title="GCash" 
                    description="Coming Soon" 
                    disabled 
                    icon={<Landmark size={20} />} 
                  />
                </RadioGroup>
              </section>

              {/* Note to Seller Container */}
              <section className="bg-white rounded-[2rem] border border-stone-200 p-8 shadow-sm">
                <h2 className="text-xl font-black mb-4 flex items-center gap-3 text-stone-900">
                   <MessageSquareQuote className="text-[#0E6835]" size={24} />
                   Note to Seller
                </h2>
                <Textarea 
                  placeholder="Optional: Example 'Please handle with care'..." 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="resize-none rounded-2xl border-2 border-stone-100 bg-stone-50/50 focus:bg-white focus:border-[#0E6835]/30 transition-all h-24 font-medium"
                />
              </section>

            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Checkout Bar */}
      <div className="sticky bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-stone-200 z-50 py-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Left Side: Summary Details */}
            <div className="flex items-center gap-8 text-stone-900">
              <div className="hidden md:block">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Items Selected</p>
                <p className="text-sm font-bold">{productsToCheckout.length} Products</p>
              </div>
              
              <div className="h-10 w-px bg-stone-200 hidden md:block"></div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-black text-stone-400 uppercase tracking-widest">Total Payable</span>
                  <span className="text-[10px] font-bold text-[#0E6835] bg-green-50 px-2 py-0.5 rounded-full border border-green-100">FREE SHIPPING</span>
                </div>
                <p className="text-2xl font-black text-[#0E6835] leading-none mt-1">
                  ₱{total.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Right Side: Action Button */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="hidden xl:flex items-center gap-2 text-stone-400 mr-4">
                <ShieldCheck size={14} className="text-[#0E6835]" />
                <span className="text-[10px] font-bold uppercase tracking-tight">Protected Transaction</span>
              </div>
              <Button 
                className="flex-1 sm:flex-none h-11 px-10 rounded-xl bg-[#0E6835] text-white hover:bg-[#0E6835]/90 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-[#0E6835]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                onClick={handlePlaceOrder}
                disabled={checkoutMutation.isPending}
              >
                {checkoutMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>SYNCING...</span>
                  </div>
                ) : (
                  "Place Order Now"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent className="rounded-[3rem] p-0 overflow-hidden border border-stone-200 shadow-2xl max-w-md bg-white">
          <div className="p-10 pb-6 flex flex-col items-center text-center">
            {/* Theme Badge */}
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-[#0E6835] text-[10px] font-black uppercase tracking-[0.3em] mb-6">
              <ShieldCheck size={12} />
              Final Confirmation
            </div>
            
            <AlertDialogHeader className="space-y-3">
              <AlertDialogTitle className="text-3xl font-black tracking-tight text-stone-900">
                Ready to <span className="italic font-light">Order?</span>
              </AlertDialogTitle>
              <AlertDialogDescription className="text-stone-500 font-light text-base leading-relaxed">
                Please review your details one last time. Your local fresh goods are just one click away!
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          
          <div className="px-10 pb-10 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Total Payable</p>
                  <p className="text-3xl font-black text-[#0E6835] leading-none">₱{total.toLocaleString()}</p>
                </div>
                <Badge variant="outline" className="h-6 rounded-full border-stone-200 text-stone-400 font-bold text-[10px]">
                  COD PAYMENT
                </Badge>
              </div>
              
              <div className="p-5 rounded-[1.5rem] bg-stone-50 border border-stone-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#0E6835] shadow-sm border border-stone-100 shrink-0">
                  <MapPin size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Shipping To</p>
                  <p className="text-xs font-bold text-stone-900 line-clamp-2 leading-relaxed">
                    {selectedAddress?.street}, {selectedAddress?.barangay}, {selectedAddress?.city}
                  </p>
                </div>
              </div>
            </div>

            <AlertDialogFooter className="flex-col sm:flex-row gap-3">
              <AlertDialogCancel className="w-full sm:flex-1 h-11 rounded-xl border-2 border-stone-100 font-bold text-stone-600 hover:bg-stone-50 transition-all text-[11px] uppercase tracking-widest">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={(e) => {
                  e.preventDefault();
                  confirmOrder();
                }}
                disabled={checkoutMutation.isPending}
                className="w-full sm:flex-1 h-11 rounded-xl bg-[#0E6835] text-white font-black hover:bg-green-800 shadow-lg shadow-green-900/20 transition-all text-[11px] uppercase tracking-widest flex items-center justify-center"
              >
                {checkoutMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Place Order"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const PaymentOption = ({ id, value, title, description, icon, disabled = false }: any) => (
  <div className={cn(
    "relative flex items-center gap-4 rounded-2xl border-2 p-5 transition-all cursor-pointer group",
    disabled ? "opacity-30 grayscale cursor-not-allowed border-stone-200" : "hover:border-[#0E6835]/50 hover:bg-[#0E6835]/5 border-stone-100",
    !disabled && "has-[:checked]:border-[#0E6835] has-[:checked]:bg-[#0E6835]/5"
  )}>
    <RadioGroupItem value={value} id={id} disabled={disabled} className="sr-only" />
    <Label 
        htmlFor={id} 
        className={cn(
            "flex-1 flex items-center gap-4 cursor-pointer",
            disabled ? "cursor-not-allowed" : ""
        )}
    >
      <div className={cn(
        "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm bg-stone-50 text-stone-400",
        "group-has-[:checked]:bg-[#0E6835] group-has-[:checked]:text-white"
      )}>
        {icon}
      </div>
      <div>
        <p className="font-black text-stone-900">{title}</p>
        <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">{description}</p>
      </div>
    </Label>
  </div>
);

export default CheckoutPage;
