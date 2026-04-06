import {redirect} from "next/navigation";

function toQueryString(
  searchParams: Record<string, string | string[] | undefined>
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string" && value) {
      params.set(key, value);
      continue;
    }

    if (Array.isArray(value)) {
      for (const entry of value) {
        if (entry) {
          params.append(key, entry);
        }
      }
    }
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

export const dynamic = "force-dynamic";

export default function CartPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  redirect(`/admin/cart/new${toQueryString(searchParams)}`);
}
