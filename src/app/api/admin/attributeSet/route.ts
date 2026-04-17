import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth/options";
import dbConnect from "@/lib/db/connection";
import {AttributeSet} from "@/lib/db/models/AttributeSet";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    await dbConnect();
    
    const attributeSets = await AttributeSet.find().sort({ createdAt: -1 });

    return NextResponse.json({data: attributeSets, success: true});
  } catch (error: any) {
    console.error("Error fetching attribute sets:", error);
    return NextResponse.json(
      {error: error.message || "Failed to fetch attribute sets", success: false},
      {status: 500}
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    await dbConnect();
    const body = await request.json();
    
    const attributeSet = await AttributeSet.create(body);

    return NextResponse.json({data: attributeSet, success: true}, {status: 201});
  } catch (error: any) {
    console.error("Error creating attribute set:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        {error: "An attribute set with this key already exists", success: false},
        {status: 409}
      );
    }
    
    return NextResponse.json(
      {error: error.message || "Failed to create attribute set", success: false},
      {status: 500}
    );
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    console.log("body---->updsate attrsiiiii", body);

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid payload" },
        { status: 400 }
      );
    }

    const updates = [];

    for (const item of body) {
      const {
        brand_name,
        warehouse_name,
        warehouse_code,
        isActive,
      } = item;

      // 1️⃣ Try updating existing attribute
      const updatedDoc = await AttributeSet.findOneAndUpdate(
        {
          name: brand_name,
          "attributes.key": warehouse_code,
        },
        {
          $set: {
            "attributes.$.isActive": isActive,
            "attributes.$.label": warehouse_name, // optional update
          },
        },
        { new: true }
      );

      if (updatedDoc) {
        updates.push(updatedDoc);
        continue;
      }

      // 2️⃣ If not found → push new attribute
      const insertedDoc = await AttributeSet.findOneAndUpdate(
        {
          name: brand_name,
        },
        {
          $push: {
            attributes: {
              key: warehouse_code,
              label: warehouse_name,
              isActive: isActive,
              type: "text", // optional default
              show: true,
            },
          },
        },
        { new: true }
      );

      updates.push(insertedDoc);
    }

    return NextResponse.json({
      success: true,
      message: "Attributes updated successfully",
      data: updates,
    });

  } catch (error: any) {
    console.error("PUT error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}