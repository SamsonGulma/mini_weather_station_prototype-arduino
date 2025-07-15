"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, History, Wifi, WifiOff, Zap, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNetworkStatus } from "@/hooks/use-network-status";

export function Navigation() {
    const pathname = usePathname();
    const { isOnline, lastUpdated } = useNetworkStatus();

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg shadow-black/5">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Zap className="h-5 w-5 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                    Weather Station
                                </h1>
                                <p className="text-xs text-gray-500 font-medium">
                                    Real-time monitoring
                                </p>
                            </div>
                        </div>

                        <nav className="flex space-x-2">
                            <Link
                                href="/"
                                className={cn(
                                    "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2",
                                    pathname === "/"
                                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-white/50 backdrop-blur-sm"
                                )}
                            >
                                <Activity className="h-4 w-4" />
                                Dashboard
                            </Link>
                            <Link
                                href="/analysis"
                                className={cn(
                                    "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2",
                                    pathname === "/analysis"
                                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-white/50 backdrop-blur-sm"
                                )}
                            >
                                <BarChart2 className="h-4 w-4" />
                                Analysis
                            </Link>
                            <Link
                                href="/history"
                                className={cn(
                                    "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2",
                                    pathname === "/history"
                                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-white/50 backdrop-blur-sm"
                                )}
                            >
                                <History className="h-4 w-4" />
                                History
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div
                            className={cn(
                                "flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium backdrop-blur-sm",
                                isOnline
                                    ? "bg-emerald-50/80 text-emerald-700 border border-emerald-200/50"
                                    : "bg-red-50/80 text-red-700 border border-red-200/50"
                            )}
                        >
                            {isOnline ? (
                                <Wifi className="h-4 w-4" />
                            ) : (
                                <WifiOff className="h-4 w-4" />
                            )}
                            <span>{isOnline ? "Online" : "Offline"}</span>
                        </div>
                        {lastUpdated && (
                            <div className="text-xs text-gray-500 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-200/50">
                                {lastUpdated.toLocaleTimeString()}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
