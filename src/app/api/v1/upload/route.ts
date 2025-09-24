import { type NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    await uploadToCloudinary(file);
    // await writeWithFileHandle(file, fileName);

    return NextResponse.json({
      url: imageUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

async function writeWithFileHandle(file: File, fileName: string) {
  let fileHandle;
  const mediaDir = path.resolve("./media");

  try {
    await fs.access(mediaDir);
  } catch (error) {
    console.log("Media DIR doesn't exist");
    await fs.mkdir(mediaDir);
    console.log("Created a media DIR");
  }

  try {
    const filePath = path.join(mediaDir, fileName);
    const content = await file.bytes();
    console.log(filePath);

    fileHandle = await fs.open(filePath, "w");

    await fileHandle.write(content);

    console.log("Content written successfully");
  } catch (err) {
    console.error("Error writing to file:", err);
  } finally {
    if (fileHandle) {
      await fileHandle.close();
    }
    console.log("Closed");
  }
}

export async function uploadToCloudinary(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer); //  <-- convert to Buffer

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "image" }, onDone)
      .end(buffer);

    function onDone(error: Error, result: string) {
      if (error) {
        return reject({ success: false, error });
      }
      return resolve({ success: true, result });
    }
  });
}
