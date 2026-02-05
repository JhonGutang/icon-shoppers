"use client";

import React, { useState } from "react";
import useCustomerActions from "@/hooks/customer/useCustomerActions";
import { ProductInCart, ProductWithShop, Shop } from "@/types/product";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import { Textarea } from "@/components/shared/ui/textarea";
import { Minus, Plus, Trash, ChevronRight, ChevronLeft, MapPin, CreditCard, ShoppingBag } from "lucide-react";
import { Separator } from "@/components/shared/ui/separator";

interface CheckoutContainerProps {
  products: ProductInCart[];
  shop: Shop;
  productsWithShops: ProductWithShop[];
  setProductsWithShops: React.Dispatch<React.SetStateAction<ProductWithShop[] | null>>;
}

const CheckoutContainer: React.FC<CheckoutContainerProps> = ({
  products,
  shop,
  setProductsWithShops,
}) => {
  const { handleCheckout, handleRemoveToCart } = useCustomerActions();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [shippingData, setShippingData] = useState({
    shipping_address: "",
    notes: "",
    payment_method: "COD",
  });

  const handleRemoveProduct = async (productId: number) => {
    await handleRemoveToCart(productId);
    setProductsWithShops((prev) => {
      if (!prev) return prev;
      return prev
        .map((shopData) => {
          if (shopData.shop.id === shop.id) {
            const filteredProducts = shopData.products.filter((p) => p.id !== productId);
            return { ...shopData, products: filteredProducts };
          }
          return shopData;
        })
        .filter((shopData) => shopData.products.length > 0);
    });
  };

  const handleQuantityChange = (productId: number, type: "increment" | "decrement") => {
    setProductsWithShops((prev) => {
      if (!prev) return prev;
      return prev.map((shopData) => {
        if (shopData.shop.id === shop.id) {
          const updatedProducts = shopData.products.map((product) => {
            if (product.id === productId) {
              const newQuantity = type === "increment" 
                ? product.quantity + 1 
                : product.quantity > 1 
                  ? product.quantity - 1 
                  : 1;
              return { ...product, quantity: newQuantity };
            }
            return product;
          });
          return { ...shopData, products: updatedProducts };
        }
        return shopData;
      });
    });
  };

  const subtotal = products.reduce((sum, product) => 
    sum + Number(product.price) * Number(product.quantity), 0
  );
  const shippingFee = Number(shop.shipping_fee) || 0;
  const total = subtotal + shippingFee;

  const nextStep = () => {
    if (step < 3) setStep((s) => (s + 1) as any);
  };

  const prevStep = () => {
    if (step > 1) setStep((s) => (s - 1) as any);
  };

  const handleFinalCheckout = async () => {
    await handleCheckout("checkout", products, shippingData);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Progress Tracker */}
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center gap-2 ${step >= 1 ? "text-green-600 font-bold" : "text-gray-400 font-medium text-sm"}`}>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? "border-green-600 bg-green-50" : "border-gray-200"}`}>1</div>
          <span className="hidden sm:inline">Cart Review</span>
        </div>
        <div className="flex-1 h-px bg-gray-200 mx-4"></div>
        <div className={`flex items-center gap-2 ${step >= 2 ? "text-green-600 font-bold" : "text-gray-400 font-medium text-sm"}`}>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? "border-green-600 bg-green-50" : "border-gray-200"}`}>2</div>
          <span className="hidden sm:inline">Shipping Detail</span>
        </div>
        <div className="flex-1 h-px bg-gray-200 mx-4"></div>
        <div className={`flex items-center gap-2 ${step >= 3 ? "text-green-600 font-bold" : "text-gray-400 font-medium text-sm"}`}>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? "border-green-600 bg-green-50" : "border-gray-200"}`}>3</div>
          <span className="hidden sm:inline">Place Order</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Review Your Items from {shop.name}</CardTitle>
                <CardDescription>Verify quantities before proceeding to shipping.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex gap-4 p-4 border rounded-lg hover:border-green-200 transition-colors">
                    <img
                      src={`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${product.image}`}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleRemoveProduct(product.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 border rounded-full p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => handleQuantityChange(product.id, "decrement")}
                            disabled={product.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-4 text-center text-sm font-medium">{product.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => handleQuantityChange(product.id, "increment")}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="font-bold text-green-700">₱{(Number(product.price) * Number(product.quantity)).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Destination</CardTitle>
                <CardDescription>Where should we deliver your gourmet items?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Full Delivery Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Barangay, Street, House Number, Landmark..."
                    value={shippingData.shipping_address}
                    onChange={(e) => setShippingData({ ...shippingData, shipping_address: e.target.value })}
                    className="min-h-[100px] focus-visible:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes for Merchant (Optional)</Label>
                  <Input
                    id="notes"
                    placeholder="Extra spicy, call me when outside, etc."
                    value={shippingData.notes}
                    onChange={(e) => setShippingData({ ...shippingData, notes: e.target.value })}
                    className="focus-visible:ring-green-500"
                  />
                </div>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3 text-blue-700">
                  <CreditCard className="h-5 w-5 shrink-0" />
                  <div className="text-sm">
                    <strong>Note:</strong> We currently only support <strong>Cash on Delivery (COD)</strong> for this merchant.
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order Confirmation</CardTitle>
                  <CardDescription>Review all details before placing your order.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        <MapPin className="h-4 w-4" /> Shipping Address
                      </div>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded border">{shippingData.shipping_address || "No address provided"}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        <ShoppingBag className="h-4 w-4" /> Payment Method
                      </div>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded border">Cash on Delivery (COD)</p>
                    </div>
                  </div>
                  {shippingData.notes && (
                    <div className="space-y-2">
                      <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Notes</div>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded border italic">&quot;{shippingData.notes}&quot;</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm uppercase text-gray-400">Items from {shop.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {products.map((p) => (
                    <div key={p.id} className="flex justify-between text-sm py-1 border-b border-dashed last:border-0">
                      <span>{p.name} <span className="text-gray-400">x{p.quantity}</span></span>
                      <span className="font-medium">₱{(Number(p.price) * Number(p.quantity)).toFixed(2)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₱{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Fee</span>
                <span>₱{shippingFee.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-green-700">₱{total.toFixed(2)}</span>
              </div>
              
              <div className="pt-4 space-y-3">
                {step < 3 ? (
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg" 
                    onClick={nextStep}
                    disabled={step === 2 && !shippingData.shipping_address}
                  >
                    Proceed to Next Step <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg shadow-lg shadow-green-100" 
                    onClick={handleFinalCheckout}
                  >
                    Place My Order <ShoppingBag className="ml-2 h-4 w-4" />
                  </Button>
                )}
                
                {step > 1 ? (
                  <Button 
                    variant="ghost" 
                    className="w-full text-gray-500" 
                    onClick={prevStep}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back to Previous Step
                  </Button>
                ) : (
                  <div className="text-center text-xs text-gray-400">
                    By proceeding, you agree to our Terms of Service
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutContainer;
