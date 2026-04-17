"use client";

import { RootState } from "@/store";
import { useSelector } from "react-redux";

const AttributeTable = () => {
  const { allAttribute } = useSelector((state: RootState) => state.attribute);

  const handleEdit = (item: any) => {
    console.log("Edit:", item);
  };

  const handleDelete = (id?: string) => {
    console.log("Delete:", id);
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        {/* Header */}
        <thead style={{ background: "#f9fafb" }}>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Key</th>
            <th style={thStyle}>Applies To</th>
            <th style={thStyle}>Contexts</th>
            <th style={thStyle}>Attributes Count</th>
            <th style={thStyle}>Source</th>
            <th style={thStyle}>System</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {allAttribute?.length > 0 ? (
            allAttribute.map((item: any) => (
              <tr key={item._id} style={{ borderTop: "1px solid #f1f5f9" }}>
                <td style={tdStyle}>{item.name || "-"}</td>
                <td style={tdStyle}>{item.key || "-"}</td>
                <td style={tdStyle}>{item.appliesTo || "-"}</td>

                {/* Contexts */}
                <td style={tdStyle}>
                  {item.contexts?.length
                    ? item.contexts.join(", ")
                    : "-"}
                </td>

                {/* Attributes Count */}
                <td style={tdStyle}>
                  {item.attributes?.length || 0}
                </td>

                {/* Source */}
                <td style={tdStyle}>{item.source || "-"}</td>

                {/* System */}
                <td style={tdStyle}>
                  {item.isSystem ? "Yes" : "No"}
                </td>

                {/* Actions */}
                <td style={tdStyle}>
                  <button
                    onClick={() => handleEdit(item)}
                    style={editBtn}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    style={deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} style={{ textAlign: "center", padding: "20px" }}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttributeTable;

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "12px 16px",
  fontSize: "13px",
  fontWeight: 600,
  color: "#374151",
};

const tdStyle: React.CSSProperties = {
  padding: "12px 16px",
  fontSize: "14px",
  color: "#6b7280",
};

const editBtn: React.CSSProperties = {
  marginRight: "8px",
  padding: "6px 10px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const deleteBtn: React.CSSProperties = {
  padding: "6px 10px",
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};