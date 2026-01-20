"use client";

import React from "react";
import { motion } from "framer-motion";
import { Home, Calendar, Settings, Mic } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
    href: string;
    icon: React.ReactNode;
    label: string;
}

const navItems: NavItem[] = [
    { href: "/", icon: <Home className="w-5 h-5" />, label: "Home" },
    { href: "/meetings", icon: <Calendar className="w-5 h-5" />, label: "Meetings" },
    { href: "/settings", icon: <Settings className="w-5 h-5" />, label: "Settings" },
];

export const BottomNavigation: React.FC = () => {
    const pathname = usePathname();

    // Don't show on recording page
    if (pathname === "/recording") {
        return null;
    }

    return (
        <motion.nav
            className="bottom-nav"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {navItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                    <Link key={item.href} href={item.href}>
                        <motion.div
                            className={`bottom-nav-item ${isActive ? "active" : ""}`}
                            whileTap={{ scale: 0.9 }}
                        >
                            {item.icon}
                            <span className="text-[10px] font-medium">{item.label}</span>
                            {isActive && (
                                <motion.div
                                    className="absolute -top-1 w-1 h-1 rounded-full bg-primary"
                                    layoutId="navIndicator"
                                />
                            )}
                        </motion.div>
                    </Link>
                );
            })}
        </motion.nav>
    );
};
