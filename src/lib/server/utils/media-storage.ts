import { cloudinary } from "@/lib/server/utils/cloudinary-config";
import { promises as fs } from "fs";
import path from "path";

interface UploadResponse {
  success: boolean;
  url?: string;
  error?: Error;
}

// Writes media file to public/media directory
export async function writeToLocalDisk(
  file: File,
  fileName: string,
): Promise<UploadResponse> {
  let fileHandle;
  const mediaDir = path.resolve("./public/media");

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
    console.log(mediaDir);

    fileHandle = await fs.open(filePath, "w");

    await fileHandle.write(content);

    console.log("Content written successfully");
    return {
      success: true,
      url: `/media/${fileName}`,
    };
  } catch (err) {
    console.error("Error writing to file:", err);
    return {
      success: false,
    };
  } finally {
    if (fileHandle) {
      await fileHandle.close();
    }
    console.log("Closed");
  }
}

// Handle media file upload to cloudinary
interface CloudinaryUploadResult {
  created_at: string;
  secure_url: string;
}

export async function uploadToCloudinary(file: File): Promise<UploadResponse> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "image" }, onDone)
      .end(buffer);

    function onDone(error: any, result: CloudinaryUploadResult) {
      if (error) {
        return reject({ success: false, error });
      }
      if (!result || !result.secure_url) {
        return resolve({
          success: false,
          error: new Error("No secure URL returned from Cloudinary"),
        });
      }
      return resolve({
        success: true,
        url: result.secure_url,
      });
    }
  });
}
