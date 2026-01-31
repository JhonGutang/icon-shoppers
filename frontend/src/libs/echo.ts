import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<any>;
  }
}

import axiosInstance from "@/hooks/useAxios";
import { AxiosResponse } from "axios";

const getEcho = () => {
    if (typeof window === 'undefined') return null;

    window.Pusher = Pusher;

    const API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://localhost:8000";

    return new Echo({
        broadcaster: "reverb",
        key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || "iconshopperskey",
        wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || "127.0.0.1",
        wsPort: process.env.NEXT_PUBLIC_REVERB_PORT ? parseInt(process.env.NEXT_PUBLIC_REVERB_PORT) : 8080,
        wssPort: process.env.NEXT_PUBLIC_REVERB_PORT ? parseInt(process.env.NEXT_PUBLIC_REVERB_PORT) : 8080,
        forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME || "http") === "https",
        enabledTransports: (process.env.NEXT_PUBLIC_REVERB_SCHEME || "http") === "https" ? ["wss"] : ["ws"],
        authorizer: (channel: any) => {
            return {
                authorize: (socketId: string, callback: Function) => {
                    axiosInstance.post(`${API_URL}/api/broadcasting/auth`, {
                        socket_id: socketId,
                        channel_name: channel.name
                    })
                    .then((response: AxiosResponse) => {
                        console.log(`🔐 Channel Auth Success: ${channel.name}`);
                        callback(false, response.data);
                    })
                    .catch((error: any) => {
                        console.error(`❌ Channel Auth Error: ${channel.name}`, error);
                        callback(true, error);
                    });
                }
            };
        },
    });
};

const echo = getEcho();

// Logging and Connection Strategy
if (echo && typeof window !== 'undefined') {
    console.log("🔌 Initializing WebSocket connection...");

    echo.connector.pusher.connection.bind("connected", () => {
        console.log("✅ WebSocket Connected: Reverb connection established.");
        const socketId = echo.socketId();
        if (socketId) {
            axiosInstance.defaults.headers.common['X-Socket-ID'] = socketId;
            console.log("🆔 Set X-Socket-ID header:", socketId);
        }
    });

    echo.connector.pusher.connection.bind("disconnected", () => {
        console.log("❌ WebSocket Disconnected.");
    });

    echo.connector.pusher.connection.bind("error", (error: any) => {
        console.error("⚠️ WebSocket Connection Error:", error);
    });

    echo.connector.pusher.connection.bind("state_change", (states: any) => {
        console.log(`📡 WebSocket State Change: ${states.previous} -> ${states.current}`);
    });
}

export default echo!;
