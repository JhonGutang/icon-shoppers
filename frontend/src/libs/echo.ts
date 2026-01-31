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

    const host = process.env.NEXT_PUBLIC_REVERB_HOST || "127.0.0.1";
    const cleanHost = host.replace(/^https?:\/\//, "");

    const scheme = process.env.NEXT_PUBLIC_REVERB_SCHEME || "http";
    const isHttps = scheme === "https";

    console.log("🔌 WebSocket Configuration:", {
        host: cleanHost,
        port: process.env.NEXT_PUBLIC_REVERB_PORT,
        scheme: scheme,
        key: process.env.NEXT_PUBLIC_REVERB_APP_KEY ? "EXISTS" : "MISSING"
    });

    return new Echo({
        broadcaster: "reverb",
        key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || "iconshopperskey",
        wsHost: cleanHost,
        wsPort: process.env.NEXT_PUBLIC_REVERB_PORT ? parseInt(process.env.NEXT_PUBLIC_REVERB_PORT) : (isHttps ? 443 : 8080),
        wssPort: process.env.NEXT_PUBLIC_REVERB_PORT ? parseInt(process.env.NEXT_PUBLIC_REVERB_PORT) : (isHttps ? 443 : 8080),
        forceTLS: isHttps,
        enabledTransports: ["ws", "wss"],
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
                        console.error(`❌ Channel Auth Error: ${channel.name}`, {
                            message: error.message,
                            status: error.response?.status,
                            statusText: error.response?.statusText,
                            data: error.response?.data,
                            config: {
                                url: error.config?.url,
                                method: error.config?.method,
                                headers: error.config?.headers
                            }
                        });
                        
                        // Pass a more useful error object back to Pusher/Echo
                        const authError = new Error(error.response?.data?.message || error.message || "Auth failed");
                        (authError as any).status = error.response?.status;
                        
                        callback(true, authError);
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

    echo.connector.pusher.connection.bind("state_change", (states: any) => {
        console.log(`📡 WebSocket State Change: ${states.previous} -> ${states.current}`);
    });

    echo.connector.pusher.connection.bind("connected", () => {
        console.log("✅ WebSocket Connected: Reverb connection established.");
        const socketId = echo.socketId();
        if (socketId) {
            axiosInstance.defaults.headers.common['X-Socket-ID'] = socketId;
            console.log("🆔 Set X-Socket-ID header:", socketId);
        }
    });

    echo.connector.pusher.connection.bind("connecting", () => {
        console.log("⏳ WebSocket Connecting...");
    });

    echo.connector.pusher.connection.bind("unavailable", () => {
        console.log("🚫 WebSocket Unavailable.");
    });

    echo.connector.pusher.connection.bind("failed", () => {
        console.log("� WebSocket Failed.");
    });
}

export default echo!;
