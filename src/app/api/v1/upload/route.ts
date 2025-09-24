import { type NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    const BASE_DIR = "src/media";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // In a real app, you would upload to a cloud storage service
    // For demo purposes, we'll return a placeholder URL
    const fileName = `${Date.now()}-${file.name}`;
    const imageUrl = `/placeholder.svg?height=400&width=800&query=${encodeURIComponent(
      file.name.split(".")[0],
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

async function writeWithFileHandle() {
  let fileHandle;

  try {
    // Open a file for writing (creates if doesn't exist)
    fileHandle = await fs.open("output.txt", "w");

    // Write content to the file
    await fileHandle.write("First line\n");
    await fileHandle.write("Second line\n");
    await fileHandle.write("Third line\n");

    console.log("Content written successfully");
  } catch (err) {
    console.error("Error writing to file:", err);
  } finally {
    // Always close the file handle
    if (fileHandle) {
      await fileHandle.close();
    }
  }
}
