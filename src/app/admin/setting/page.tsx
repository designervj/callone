"use client";

export default function SettingsPage() {
  return (
    <>
      <h1
        style={{
          fontSize: "22px",
          fontWeight: 700,
          color: "#111827",
          marginBottom: "24px",
          textTransform: "capitalize",
        }}
      >
        Settings
      </h1>

      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          padding: "32px",
          minHeight: "400px",
          color: "#9ca3af",
          fontSize: "14px",
        }}
      >
        <p>Select a section from the left to manage settings.</p>
      </div>
    </>
  );
}