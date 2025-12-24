// src/lib/uploads.ts
import path from "path";
import fs from "fs/promises";

type UploadOptions = {
  folder?: string;
};

export async function uploadFile(
  file: File,
  options: UploadOptions = {}
) {
  const folder = options.folder ?? "projects";

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  const uploadDir = path.join(
    process.cwd(),
    "public/uploads",
    folder
  );

  await fs.mkdir(uploadDir, { recursive: true });

  const uploadPath = path.join(uploadDir, fileName);
  await fs.writeFile(uploadPath, buffer);

  return {
    fileName,
    url: `/uploads/${folder}/${fileName}`,
  };
}

