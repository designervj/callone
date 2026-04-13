import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import dbConnect from "@/lib/db/connection";
import mongoose from "mongoose";
import {
  getTravisSheetKey,
  pickTravisSheetFields,
} from "@/store/slices/sheet/travismethew/TravisMethewSheetType";

const COLLECTION_NAME = "sheet_travismethew";

type ImportIssue = {
  rowIndex: number;
  sku: string;
  reason: string;
};

function toText(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function isBlankRow(row: Record<string, unknown>) {
  return !Object.values(row).some((value) => toText(value) !== "");
}

function formatDate(value: unknown) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  const text = toText(value);
  return text || undefined;
}

function serializeRow(row: Record<string, unknown>) {
  const output: Record<string, unknown> = {
    ...pickTravisSheetFields(row),
  };

  if (row._id !== undefined && row._id !== null) {
    output._id = String(row._id);
  }

  const createdAt = formatDate(row.createdAt);
  if (createdAt) {
    output.createdAt = createdAt;
  }

  const updatedAt = formatDate(row.updatedAt);
  if (updatedAt) {
    output.updatedAt = updatedAt;
  }

  return output;
}

function normalizeRow(row: Record<string, unknown>) {
  const sku = getTravisSheetKey(row);
  if (!sku) {
    return { error: "Missing SKU or Option" };
  }

  const keyField: "SKU" | "Option" = toText(row.SKU) ? "SKU" : "Option";
  const document = pickTravisSheetFields(row);

  return {
    sku,
    keyField,
    document: {
      ...document,
      [keyField]: sku,
    },
  };
}

function toKeyList(body: unknown) {
  if (Array.isArray(body)) {
    return body
      .map((item) => (typeof item === "string" ? item : getTravisSheetKey(item as Record<string, unknown>)))
      .filter(Boolean);
  }

  if (body && typeof body === "object") {
    return [getTravisSheetKey(body as Record<string, unknown>)].filter(Boolean);
  }

  return [];
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const collection = mongoose.connection.db!.collection(COLLECTION_NAME);
  const { searchParams } = new URL(request.url);

  const query: Record<string, unknown> = {};
  const skuParam = searchParams.get("SKU");
  const optionParam = searchParams.get("Option");

  if (skuParam) {
    query.SKU = skuParam;
  }

  if (optionParam) {
    query.Option = optionParam;
  }

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(5000, Math.max(1, parseInt(searchParams.get("limit") ?? "5000", 10)));
  const skip = (page - 1) * limit;

  const [rows, total] = await Promise.all([
    collection
      .find(query)
      .sort({ updatedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    collection.countDocuments(query),
  ]);

  return NextResponse.json({
    data: rows.map((row) => serializeRow(row as Record<string, unknown>)),
    total,
    page,
    limit,
    success: true,
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const collection = mongoose.connection.db!.collection(COLLECTION_NAME);
  const body = (await request.json()) as unknown;
  const rows: Record<string, unknown>[] = Array.isArray(body)
    ? body.filter((row): row is Record<string, unknown> => Boolean(row) && typeof row === "object")
    : body && typeof body === "object"
      ? [body as Record<string, unknown>]
      : [];

  const filteredRows = rows.filter((row) => !isBlankRow(row));
  const issues: ImportIssue[] = [];
  const validRows: Array<{
    rowIndex: number;
    keyField: "SKU" | "Option";
    sku: string;
    document: Record<string, unknown>;
  }> = [];

  filteredRows.forEach((row, index) => {
    const normalized = normalizeRow(row);
    if ("error" in normalized) {
      issues.push({
        rowIndex: index,
        sku: getTravisSheetKey(row),
        reason: normalized.error ?? "Missing SKU or Option",
      });
      return;
    }

    validRows.push({
      rowIndex: index,
      keyField: normalized.keyField,
      sku: normalized.sku,
      document: normalized.document,
    });
  });

  let insertedCount = 0;
  let updatedCount = 0;
  const savedRows: Array<Record<string, unknown>> = [];

  for (const { rowIndex, keyField, sku, document } of validRows) {
    try {
      const now = new Date();
      const result = await collection.updateOne(
        { [keyField]: sku },
        {
          $set: {
            ...document,
            [keyField]: sku,
            updatedAt: now,
          },
          $setOnInsert: { createdAt: now },
        },
        { upsert: true }
      );

      const savedDocument = serializeRow({
        ...document,
        [keyField]: sku,
        createdAt: now,
        updatedAt: now,
      });

      if (result.upsertedCount > 0) {
        insertedCount += 1;
        savedRows.push({ _id: String(result.upsertedId), ...savedDocument });
      } else {
        updatedCount += 1;
        savedRows.push(savedDocument);
      }
    } catch (error: any) {
      issues.push({
        rowIndex,
        sku,
        reason: error?.message || "Upsert failed",
      });
    }
  }

  const savedCount = insertedCount + updatedCount;
  return NextResponse.json(
    {
      data: savedRows,
      count: savedRows.length,
      success: savedCount > 0,
      summary: {
        totalRows: filteredRows.length,
        insertedCount,
        updatedCount,
        failedCount: issues.length,
        savedCount,
        rowErrors: issues,
      },
    },
    { status: savedCount > 0 ? 201 : 200 }
  );
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const collection = mongoose.connection.db!.collection(COLLECTION_NAME);
  const body = (await request.json()) as unknown;
  const rows: Record<string, unknown>[] = Array.isArray(body)
    ? body.filter((row): row is Record<string, unknown> => Boolean(row) && typeof row === "object")
    : body && typeof body === "object"
      ? [body as Record<string, unknown>]
      : [];

  const filteredRows = rows.filter((row) => !isBlankRow(row));
  const issues: ImportIssue[] = [];
  let updatedCount = 0;

  for (let index = 0; index < filteredRows.length; index += 1) {
    const row = filteredRows[index];
    const normalized = normalizeRow(row);
    if ("error" in normalized) {
      issues.push({
        rowIndex: index,
        sku: getTravisSheetKey(row),
        reason: normalized.error ?? "Missing SKU or Option",
      });
      continue;
    }

    try {
      const now = new Date();
      const result = await collection.updateOne(
        { [normalized.keyField]: normalized.sku },
        {
          $set: {
            ...normalized.document,
            [normalized.keyField]: normalized.sku,
            updatedAt: now,
          },
        }
      );

      if (result.matchedCount === 0) {
        issues.push({
          rowIndex: index,
          sku: normalized.sku,
          reason: "No Travis sheet row found with this key",
        });
      } else {
        updatedCount += 1;
      }
    } catch (error: any) {
      issues.push({
        rowIndex: index,
        sku: normalized.sku,
        reason: error?.message || "Update failed",
      });
    }
  }

  return NextResponse.json({
    success: updatedCount > 0,
    summary: {
      totalRows: filteredRows.length,
      updatedCount,
      failedCount: issues.length,
      rowErrors: issues,
    },
  });
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const collection = mongoose.connection.db!.collection(COLLECTION_NAME);
  const body = (await request.json()) as unknown;
  const keys = toKeyList(body);

  if (!keys.length) {
    return NextResponse.json(
      { error: "No valid SKU or Option provided for deletion", success: false },
      { status: 400 }
    );
  }

  const result = await collection.deleteMany({
    $or: [{ SKU: { $in: keys } }, { Option: { $in: keys } }],
  });

  return NextResponse.json({
    data: { deletedCount: result.deletedCount },
    success: result.deletedCount > 0,
  });
}
