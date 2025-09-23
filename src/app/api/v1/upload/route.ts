import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // In a real app, you would upload to a cloud storage service
    // For demo purposes, we'll return a placeholder URL
    const fileName = `${Date.now()}-${file.name}`;
    const imageUrl = `/placeholder.svg?height=400&width=800&query=${encodeURIComponent(
      file.name.split(".")[0]
    )}`;

    return NextResponse.json({
      url: imageUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
