"use client"

import { Users, Tag, Layers, Warehouse } from "lucide-react";
import { useRouter } from "next/navigation";

const navItems = [
    { key: "users", label: "Users", icon: Users , href: "/admin/setting/users"},
    { key: "attributes", label: "Attributes", icon: Tag , href: "/admin/setting/attribute"},
    { key: "brands", label: "Brands", icon: Layers , href: "/admin/setting/brands"},
    { key: "warehouse", label: "Warehouse", icon: Warehouse , href: "/admin/setting/warehouse"},
];

const NavItemsection = () => {
    const router = useRouter();
    return (
        <div>
            {navItems.map(({ key, label, icon: Icon, href }) => (
                <button
                    key={key}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 20px",
                        margin: "0 8px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                        background: "transparent",
                        color: "#6b7280",
                        fontWeight: 400,
                        fontSize: "14px",
                        textAlign: "left",
                        transition: "background 0.15s, color 0.15s",
                    }}
                    onClick={() => router.push(href)}
                >
                    <Icon size={16} strokeWidth={1.8} />
                    {label}
                </button>
            ))}
        </div>
    );
};

export default NavItemsection;