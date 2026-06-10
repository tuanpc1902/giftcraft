import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { tag, secret } = body as { tag?: unknown; secret?: unknown };

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!tag || typeof tag !== "string") {
    return NextResponse.json({ error: "Missing tag" }, { status: 400 });
  }

  revalidateTag(tag, { expire: 0 });

  return NextResponse.json({ revalidated: true, tag });
}
