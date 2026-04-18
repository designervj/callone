"use client";

import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { SectionCard } from "@/components/admin/SectionCard";
import { DataTable } from "@/components/admin/DataTable";

const BrandTable = () => {
  const { allBrand } = useSelector((state: RootState) => state.brand);

  const handleEdit = (item: any) => {
    console.log("Edit:", item);
  };

  const handleDelete = (id?: string) => {
    console.log("Delete:", id);
  };

  return (
    <SectionCard
      title="Brands"
      description="Manage product brands and their details."
    >
      <DataTable
        headers={[
          "Name",
          "Code",
          "Collection",
          "Website",
          "Active",
          "Logo",
          "Created At",
          "Actions",
        ]}
      >
        {allBrand?.length > 0 ? (
          allBrand.map((item: any) => (
            <tr key={String(item._id ?? item.code ?? item.name)}>
              <td className="px-4 py-4 text-sm font-semibold text-foreground">
                {item.name || "-"}
              </td>

              <td className="px-4 py-4 text-sm text-foreground/70">
                {item.code || "-"}
              </td>

              <td className="px-4 py-4 text-sm text-foreground/70">
                {item.collection || "-"}
              </td>

              <td className="px-4 py-4 text-sm text-foreground/70">
                {item.websiteUrl ? (
                  <a
                    href={item.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    Visit
                  </a>
                ) : (
                  "-"
                )}
              </td>

              <td className="px-4 py-4 text-sm text-foreground/70">
                {item.isActive ? "Yes" : "No"}
              </td>

              <td className="px-4 py-4 text-sm text-foreground/70">
                {item.media?.logoPath ? (
                  <img
                    src={item.media.logoPath}
                    alt={item.name}
                    className="h-8 w-8 object-contain"
                  />
                ) : (
                  "-"
                )}
              </td>

              <td className="px-4 py-4 text-sm text-foreground/70">
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : "-"}
              </td>

              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="text-sm font-semibold text-primary"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    className="text-sm font-semibold text-danger"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={8} className="px-6 py-14 text-center text-sm text-foreground/60">
              No data available
            </td>
          </tr>
        )}
      </DataTable>
    </SectionCard>
  );
};

export default BrandTable;