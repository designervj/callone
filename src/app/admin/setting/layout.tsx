"use client";

import { useState } from "react";
import NavItemsection from "@/components/setting/leftSection/NavItemsection";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f5f5" }}>
      
      {/* Sidebar */}
      <aside
        style={{
          width: "220px",
          minWidth: "220px",
          background: "#ffffff",
          borderRight: "1px solid #e5e7eb",
          padding: "24px 0",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <div
          style={{
            padding: "0 20px 16px 20px",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: "#9ca3af",
            textTransform: "uppercase",
          }}
        >
          Settings
        </div>

        <NavItemsection />
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "32px" }}>
        {children}
      </main>
    </div>
  );
}