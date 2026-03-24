import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth/options";
import dbConnect from "@/lib/db/connection";
import {InventoryLevel} from "@/lib/db/models/InventoryLevel";
import {Product} from "@/lib/db/models/Product";
import {Variant} from "@/lib/db/models/Variant";

export async function DELETE(
  _request: Request,
  {params}: {params: {id: string}}
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  await dbConnect();

  const variantIds = await Variant.find({productId: params.id}).distinct("_id");
  await InventoryLevel.deleteMany({variantId: {$in: variantIds}});
  await Variant.deleteMany({productId: params.id});
  await Product.findByIdAndDelete(params.id);

  return NextResponse.json({success: true});
}
