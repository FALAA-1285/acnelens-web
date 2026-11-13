import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "File foto tidak ditemukan." }, { status: 400 });
    }

    const backendUrl = (process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL)?.replace(/\/$/, "");
    if (!backendUrl) {
      return NextResponse.json(
        { error: "Backend API belum dikonfigurasi. Silakan atur BACKEND_API_URL atau NEXT_PUBLIC_API_URL di .env.local." },
        { status: 503 }
      );
    }

    const upstreamForm = new FormData();
    upstreamForm.append("file", file);

    const upstreamRes = await fetch(`${backendUrl}/predict`, {
      method: "POST",
      body: upstreamForm,
      signal: req.signal,
    });

    if (!upstreamRes.ok) {
      return NextResponse.json(
        { error: `Server backend membalas dengan status ${upstreamRes.status}` },
        { status: upstreamRes.status }
      );
    }

    const data = await upstreamRes.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan internal pada server.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
