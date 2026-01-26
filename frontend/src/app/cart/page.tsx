"use client";

import React, { useMemo } from "react";
import Navbar from "@/components/Navbar";
import { useCartStore } from "@/stores/useCartStore";
import { ProductInCart } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag, Plus, Minus, Store } from "lucide-react";
import Link from "next/link";
import { cartService } from "@/services/cartService";
import { useSnackbar } from "@/components/context/SnackbarContext";

const CartPage = () => {
  const { productsInCart, removeProduct, addProduct, deleteProduct } = useCartStore();
  const { openSnackbar } = useSnackbar();

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

  const subtotal = productsInCart.reduce((sum, item) => sum + parseFloat(item.price) * (item.quantity || 1), 0);

  const handleUpdateQuantity = (product: ProductInCart, delta: number) => {
    if (delta > 0) {
      addProduct(product);
      cartService.addToCart(product.id, 1);
    } else {
      // Manual quantity update if needed, but current store handles it via add/remove
      // For now, let's keep it simple as the existing store logic
    }
  };

  const handleRemoveItem = (id: number) => {
    deleteProduct(id);
    cartService.removeFromCart(id);
    openSnackbar("Item removed from cart", "info");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">Shopping Cart</h1>

        {productsInCart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {Object.entries(groupedItems).map(([shopId, group]) => (
                <div key={shopId} className="rounded-2xl border border-border overflow-hidden bg-card">
                  <div className="bg-muted/30 px-4 py-3 border-b flex items-center gap-2">
                    <Store size={18} className="text-primary" />
                    <span className="font-bold">{group.shopName}</span>
                  </div>
                  
                  <div className="divide-y">
                    {group.items.map((item) => (
                      <div key={item.id} className="p-4 flex gap-4">
                        <div className="h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                          <img 
                            src={item.image ? `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${item.image}` : "https://placehold.co/100x100"} 
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${item.slug || item.id}`} className="font-semibold hover:text-primary transition-colors line-clamp-1">
                            {item.name}
                          </Link>
                          <p className="text-sm text-primary font-bold">₱{parseFloat(item.price).toLocaleString()}</p>
                          
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-1 rounded-full border px-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => handleUpdateQuantity(item, -1)}>
                                <Minus size={14} />
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => handleUpdateQuantity(item, 1)}>
                                <Plus size={14} />
                              </Button>
                            </div>
                            
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveItem(item.id)}>
                              <Trash2 size={18} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₱{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping Fee</span>
                    <span className="text-muted-foreground text-xs italic">Calculated at checkout</span>
                  </div>
                </div>
                
                <hr className="my-4" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₱{subtotal.toLocaleString()}</span>
                </div>
                
                <Button asChild className="w-full mt-6 h-12 rounded-full text-lg font-bold shadow-lg">
                  <Link href="/checkout">
                    Proceed to Checkout
                  </Link>
                </Button>
                
                <Link href="/search" className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <ShoppingBag size={16} />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-96 flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ShoppingBag size={40} className="text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold">Your cart is empty</h2>
            <p className="mt-2 text-muted-foreground">Add some items to get started!</p>
            <Button asChild className="mt-6 rounded-full px-8">
              <Link href="/search">
                Start Shopping
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
