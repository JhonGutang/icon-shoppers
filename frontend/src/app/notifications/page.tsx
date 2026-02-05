"use client";

import React from "react";
import Navbar from "@/components/shared/layout/Navbar";
import NotificationPage from "@/components/notifications/NotificationPage";
import { useRouter } from "next/navigation";

const CustomerNotifications = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-muted/30">
            <Navbar />
            <main className="py-8">
                <NotificationPage 
                    title="My Notifications" 
                    onBack={() => router.back()}
                />
            </main>
        </div>
    );
};

export default CustomerNotifications;
