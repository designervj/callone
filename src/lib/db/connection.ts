import mongoose from "mongoose";

type CachedMongoose = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Extend globalThis safely
declare global {
  // eslint-disable-next-line no-var
  var __mongoose__: CachedMongoose | undefined;
}

const globalCache = globalThis as typeof globalThis & {
  __mongoose__?: CachedMongoose;
};

const cached: CachedMongoose = globalCache.__mongoose__ || {
  conn: null,
  promise: null,
};

if (!globalCache.__mongoose__) {
  globalCache.__mongoose__ = cached;
}

// ---------- Helpers ----------

function parseTimeout(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function stripWrappingQuotes(value: string) {
  const trimmed = value.trim();
  if (trimmed.length < 2) return trimmed;

  const first = trimmed[0];
  const last = trimmed[trimmed.length - 1];

  if (
    (first === `"` && last === `"`) ||
    (first === `'` && last === `'`)
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

function cloneMongoUrl(source: URL, authSource?: string | null) {
  const cloned = new URL(source.toString());

  if (authSource && authSource.trim()) {
    cloned.searchParams.set("authSource", authSource.trim());
  } else {
    cloned.searchParams.delete("authSource");
  }

  return cloned.toString();
}

function buildMongoCandidates(rawUri: string) {
  const trimmedUri = stripWrappingQuotes(rawUri);
  const sourceUrl = new URL(trimmedUri);
  const explicitAuthSource = process.env.MONGODB_AUTH_SOURCE?.trim();
  const pathDb = sourceUrl.pathname.replace(/^\/+/, "").trim() || undefined;

  const seen = new Set<string>();
  const candidates: Array<{uri: string; authSource?: string}> = [];
  const push = (uri: string, authSource?: string) => {
    if (!seen.has(uri)) {
      seen.add(uri);
      candidates.push({uri, authSource});
    }
  };

  push(sourceUrl.toString(), sourceUrl.searchParams.get("authSource") ?? undefined);

  if (explicitAuthSource) {
    push(cloneMongoUrl(sourceUrl, explicitAuthSource), explicitAuthSource);
  } else {
    if (sourceUrl.searchParams.has("authSource")) {
      push(cloneMongoUrl(sourceUrl, null));
    }

    push(cloneMongoUrl(sourceUrl, "admin"), "admin");

    if (pathDb && pathDb !== "test") {
      push(cloneMongoUrl(sourceUrl, pathDb), pathDb);
    }
  }

  return {
    candidates,
    host: sourceUrl.host,
    pathDb,
  };
}

// ---------- Main DB Connect ----------

export default async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  const rawMongoUri = process.env.MONGODB_URI ?? process.env.NEXTAUTH_MONGODB_URI;

  if (!rawMongoUri) {
    console.error("DB_CONNECT_ERROR: MongoDB URI is not defined.");
    throw new Error("Missing MONGODB_URI. Please check your .env file.");
  }

  const {candidates, host, pathDb} = buildMongoCandidates(rawMongoUri);
  const resolvedDbName = process.env.MONGODB_DB_NAME?.trim() || pathDb;

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      dbName: resolvedDbName,
      autoIndex: true,
      connectTimeoutMS: 15000,
      serverSelectionTimeoutMS: 15000,
    };

    if (process.env.NODE_ENV === "development") {
      mongoose.set("debug", false); // Reduce noise but keep connection logs
    }

    cached.promise = (async () => {
      let lastError: any = null;

      for (const candidate of candidates) {
        try {
          console.log(`DB_CONNECT_INFO: Connecting to ${host} (db: ${resolvedDbName || 'default'})...`);
          const mongooseInstance = await mongoose.connect(candidate.uri, opts);
          return mongooseInstance;
        } catch (error: any) {
          lastError = error;
          console.warn(`DB_CONNECT_WARN: Failed candidate ${candidate.authSource || 'default'}: ${error.message}`);
          await mongoose.disconnect().catch(() => undefined);
        }
      }
      throw lastError;
    })();
  }

  try {
    cached.conn = await cached.promise;
    console.log(`DB_CONNECT_SUCCESS: Connected to ${host}`);
  } catch (error: any) {
    console.error("DB_CONNECT_FATAL:", error.message);
    cached.promise = null; // Reset for retry
    throw error;
  }

  return cached.conn;
}
