"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { addressService } from "@/services/addressService";
import { Address, NewAddress } from "@/types/address";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Plus, Trash2, CheckCircle2, MoreVertical, Edit2 } from "lucide-react";
import { useSnackbar } from "@/components/context/SnackbarContext";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AddressesPage = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const { openSnackbar } = useSnackbar();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [newAddress, setNewAddress] = useState<NewAddress>({
    name: "",
    phone: "",
    street: "",
    barangay: "",
    city: "",
    postal_code: "",
    is_default: false
  });

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const data = await addressService.getAddresses();
      setAddresses(data);
    } catch (err) {
      openSnackbar("Failed to fetch addresses", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleCreate = async () => {
    try {
      await addressService.createAddress(newAddress);
      setIsDialogOpen(false);
      openSnackbar("Address added successfully", "success");
      fetchAddresses();
      setNewAddress({ name: "", phone: "", street: "", barangay: "", city: "", postal_code: "", is_default: false });
    } catch (err) {
      openSnackbar("Failed to add address", "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await addressService.deleteAddress(id);
      openSnackbar("Address deleted", "info");
      setAddresses(addresses.filter(a => a.id !== id));
    } catch (err) {
      openSnackbar("Failed to delete address", "error");
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await addressService.setDefault(id);
      openSnackbar("Default address updated", "success");
      fetchAddresses();
    } catch (err) {
      openSnackbar("Failed to update default address", "error");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Shipping Addresses</h1>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full px-6">
                <Plus className="mr-2" size={18} />
                Add New Address
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">Phone</Label>
                  <Input id="phone" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="street" className="text-right">Street</Label>
                  <Input id="street" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="barangay" className="text-right">Barangay</Label>
                  <Input id="barangay" value={newAddress.barangay} onChange={e => setNewAddress({...newAddress, barangay: e.target.value})} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="city" className="text-right">City</Label>
                  <Input id="city" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="postal_code" className="text-right">Postal Code</Label>
                  <Input id="postal_code" value={newAddress.postal_code} onChange={e => setNewAddress({...newAddress, postal_code: e.target.value})} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreate} disabled={!newAddress.name || !newAddress.city}>Save Address</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <Card key={address.id} className={cn(
                "overflow-hidden rounded-2xl border-2 transition-all",
                address.is_default ? "border-primary/40 bg-primary/5 shadow-md" : "border-border hover:border-primary/20"
              )}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <MapPin size={20} />
                    </div>
                    {address.is_default && (
                      <Badge className="bg-primary text-primary-foreground border-0">Primary</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg">{address.name}</h3>
                    <p className="text-sm text-muted-foreground">{address.phone}</p>
                    <p className="text-sm mt-2 leading-relaxed">
                      {address.street}, {address.barangay}<br />
                      {address.city}, {address.postal_code}
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t flex items-center justify-between">
                    <div className="flex gap-2">
                       {!address.is_default && (
                         <Button variant="ghost" size="sm" onClick={() => handleSetDefault(address.id)} className="text-primary hover:bg-primary/10">Set as Primary</Button>
                       )}
                    </div>
                    <div className="flex gap-1">
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Edit2 size={16} /></Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-red-50" onClick={() => handleDelete(address.id)}><Trash2 size={16} /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {addresses.length === 0 && (
              <div className="md:col-span-2 flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-card">
                  <MapPin size={48} className="text-muted-foreground mb-4 opacity-50" />
                  <p className="font-bold text-lg">No addresses added yet</p>
                  <p className="text-sm text-muted-foreground">Add a shipping address to start ordering.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
export default AddressesPage;
