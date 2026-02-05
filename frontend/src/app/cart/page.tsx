"use client";

import React, { useMemo, useState } from "react";
import Navbar from "@/components/shared/layout/Navbar";
import { useCartStore } from "@/stores/useCartStore";
import { ProductInCart } from "@/types/product";
import { Button } from "@/components/shared/ui/button";
import { Trash2, ShoppingBag, Plus, Minus, Store, Check, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cartService } from "@/services/cartService";
import { useSnackbar } from "@/components/shared/context/SnackbarContext";
import SkeletonLayer from "@/components/shared/skeletons/SkeletonLayer";
import CartSkeleton from "@/components/shared/skeletons/CartSkeleton";
import { Checkbox } from "@/components/shared/ui/checkbox";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const router = useRouter();
  const { 
    productsInCart, 
    removeProduct, 
    addProduct, 
    deleteProduct, 
    minusQuantity, 
    fetchCart,
    setProductsToCheckout 
  } = useCartStore();
  const { openSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Initialize cart on mount if not already done
  React.useEffect(() => {
    const initCart = async () => {
      if (productsInCart.length === 0) {
        await fetchCart();
      }
      setIsLoading(false);
    };
    initCart();
  }, []);

  // Sync selectedIds if products are removed from cart
  React.useEffect(() => {
    const currentProductIds = productsInCart.map(p => p.id);
    setSelectedIds(prev => prev.filter(id => currentProductIds.includes(id)));
  }, [productsInCart]);

  // Group items by shop
  const groupedItems = useMemo(() => {
    const groups: Record<number, { shopName: string; items: ProductInCart[] }> = {};
    
    productsInCart.forEach((item) => {
      const shopId = item.shop_id || 0;
      const shopName = item.shop?.name || item.shop_name || "Unknown Shop";
      
      if (!groups[shopId]) {
        groups[shopId] = { shopName, items: [] };
      }
      groups[shopId].items.push(item);
    });
    
    return groups;
  }, [productsInCart]);

  const selectedProducts = useMemo(() => {
    return productsInCart.filter(p => selectedIds.includes(p.id));
  }, [productsInCart, selectedIds]);

  const subtotal = selectedProducts.reduce((sum, item) => sum + parseFloat(item.price) * (item.quantity || 1), 0);

  const handleUpdateQuantity = async (product: ProductInCart, delta: number) => {
    if (delta > 0) {
      addProduct(product);
      await cartService.addToCart(product.id, 1);
    } else if (delta < 0) {
      if (product.quantity > 1) {
        minusQuantity(product.id);
        await cartService.removeFromCart(product.id);
      } else {
        deleteProduct(product.id);
        await cartService.removeFromCart(product.id);
      }
    }
  };

  const handleRemoveItem = async (id: number) => {
    deleteProduct(id);
    await cartService.removeFromCart(id);
    openSnackbar("Item removed from cart", "info");
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === productsInCart.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(productsInCart.map(p => p.id));
    }
  };

  const toggleShopSelection = (shopId: string, items: ProductInCart[]) => {
    const itemIds = items.map(i => i.id);
    const allSelected = itemIds.every(id => selectedIds.includes(id));
    
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !itemIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...itemIds])));
    }
  };

  const toggleItemSelection = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleProceedToCheckout = () => {
    if (selectedProducts.length === 0) {
      openSnackbar("Please select at least one item to checkout", "error");
      return;
    }
    setProductsToCheckout(selectedProducts);
    router.push('/checkout');
  };

  return (
    <div className="flex min-h-screen flex-col bg-stone-50/50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-stone-900">Shopping Cart</h1>
            <p className="text-stone-500 mt-1 font-medium">Manage items you want to purchase</p>
          </div>
          
          {productsInCart.length > 0 && (
            <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-full border-2 border-stone-200 shadow-sm relative z-10">
              <Checkbox 
                id="select-all" 
                className="border-[#0E6835] border-2 h-5 w-5 data-[state=checked]:bg-[#0E6835] data-[state=checked]:border-[#0E6835]"
                checked={selectedIds.length === productsInCart.length && productsInCart.length > 0}
                onCheckedChange={toggleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm font-black cursor-pointer select-none text-stone-900">
                Select All ({productsInCart.length} items)
              </label>
            </div>
          )}
        </div>

        <SkeletonLayer isLoading={isLoading} fallback={<CartSkeleton />}>
        {productsInCart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {Object.entries(groupedItems).map(([shopId, group]) => {
                const shopItemIds = group.items.map(i => i.id);
                const isShopAllSelected = shopItemIds.every(id => selectedIds.includes(id));
                
                return (
                  <div key={shopId} className="rounded-2xl border border-stone-200 overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
                    <div className="bg-stone-50 px-4 py-4 border-b border-stone-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          className="border-[#0E6835] border-2"
                          checked={isShopAllSelected}
                          onCheckedChange={() => toggleShopSelection(shopId, group.items)}
                        />
                        <div className="flex items-center gap-2">
                          <Store size={18} className="text-[#0E6835]" />
                          <span className="font-bold text-lg text-stone-900">{group.shopName}</span>
                        </div>
                      </div>
                      <Link href={`/shops/${shopId}`} className="text-xs text-[#0E6835] hover:underline font-bold">
                        Visit Shop
                      </Link>
                    </div>
                    
                    <div className="divide-y">
                      {group.items.map((item) => (
                        <div key={item.id} className={`p-5 flex gap-4 transition-colors ${selectedIds.includes(item.id) ? "bg-[#0E6835]/5" : ""}`}>
                          <div className="pt-2">
                            <Checkbox 
                              className="border-[#0E6835] border-2"
                              checked={selectedIds.includes(item.id)}
                              onCheckedChange={() => toggleItemSelection(item.id)}
                            />
                          </div>
                          
                          <div className="h-24 w-24 flex-shrink-0 rounded-xl overflow-hidden bg-muted border border-border">
                            <img 
                              src={item.image ? `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${item.image}` : "https://placehold.co/100x100"} 
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <Link href={`/products/${item.slug || item.id}`} className="font-bold text-lg text-stone-900 hover:text-[#0E6835] transition-colors line-clamp-1">
                                {item.name}
                              </Link>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-red-500 shrink-0" onClick={() => handleRemoveItem(item.id)}>
                                <Trash2 size={18} />
                              </Button>
                            </div>
                            
                            <p className="text-lg text-[#0E6835] font-black mt-1">₱{parseFloat(item.price).toLocaleString()}</p>
                            
                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center gap-1 rounded-full border-2 border-muted bg-muted/20 px-1 shadow-sm">
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white" onClick={() => handleUpdateQuantity(item, -1)}>
                                  <Minus size={14} />
                                </Button>
                                <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white" onClick={() => handleUpdateQuantity(item, 1)}>
                                  <Plus size={14} />
                                </Button>
                              </div>
                              
                              <div className="text-sm font-medium text-muted-foreground">
                                Total: <span className="text-foreground">₱{(parseFloat(item.price) * item.quantity).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-3xl border-2 border-primary/10 bg-card p-8 shadow-xl">
                <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                   Summary
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-stone-500">
                    <span className="text-sm">Items Selected</span>
                    <span className="font-bold text-stone-900">{selectedIds.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 text-sm">Subtotal</span>
                    <span className="font-bold text-stone-900">₱{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-xs text-[#0E6835] font-bold uppercase tracking-wider">Shipping</span>
                    <span className="text-[10px] text-stone-400 italic font-medium">Calculated next step</span>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t-2 border-dashed border-stone-100">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-stone-900">Estimated Total</span>
                    <span className="text-2xl font-black text-[#0E6835]">₱{subtotal.toLocaleString()}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleProceedToCheckout}
                  disabled={selectedIds.length === 0}
                  className="w-full mt-8 h-11 rounded-xl bg-[#0E6835] text-white hover:bg-[#0E6835]/90 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-[#0E6835]/10 transition-all active:scale-[0.98]"
                >
                  Checkout Now
                </Button>
                
                <Link href="/search" className="flex items-center justify-center gap-2 mt-6 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                  <ShoppingBag size={18} />
                  Continue Shopping
                </Link>

                {selectedIds.length > 0 && (
                  <div className="mt-6 flex items-center gap-2 text-[10px] text-muted-foreground bg-muted/30 p-3 rounded-lg">
                    <CheckCircle2 size={12} className="text-green-500" />
                    You are checking out {selectedIds.length} items from {Object.keys(groupedItems).length} stores.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-96 flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted shadow-inner">
              <ShoppingBag size={48} className="text-muted-foreground/50" />
            </div>
            <h2 className="text-2xl font-black">Your cart is lonely</h2>
            <p className="mt-2 text-muted-foreground max-w-xs">Looks like you haven&apos;t added anything yet. Discover our latest collections!</p>
            <Button asChild className="mt-8 rounded-full px-10 h-12 text-lg font-bold">
              <Link href="/search">
                Start Exploring
              </Link>
            </Button>
          </div>
        )}
        </SkeletonLayer>
      </main>
    </div>
  );
};

export default CartPage;
