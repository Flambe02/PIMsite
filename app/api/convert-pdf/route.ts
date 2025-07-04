import { NextRequest, NextResponse } from "next/server";
import { fromBuffer } from "pdf2pic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Check if it's actually a PDF
    const isPdf = buffer.slice(0, 4).toString("hex") === "25504446";
    if (!isPdf) {
      return NextResponse.json({ error: "File is not a PDF" }, { status: 400 });
    }

    const converter = await fromBuffer(buffer, {
      density: 200,
      format: "png",
      saveFilename: "page",
      savePath: "/tmp",
      width: 1700,
      height: 2400,
    });
    
    const result = await converter(1); // first page
    const pngBuffer = Buffer.from((result as any).base64, "base64");

    return new NextResponse(pngBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": "attachment; filename=converted.png",
      },
    });
  } catch (error) {
    console.error("PDF conversion error:", error);
    return NextResponse.json(
      { error: "Failed to convert PDF" },
      { status: 500 }
    );
  }
} 