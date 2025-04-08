import formidable from "formidable";
import fs from "fs-extra";
import path from "path";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), "uploads");
  await fs.ensureDir(form.uploadDir);

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload error" });

    const file = files.file[0];
    const id = Math.random().toString(36).substr(2, 8);
    const newPath = path.join(form.uploadDir, id + "-" + file.originalFilename);
    const timestampPath = path.join(form.uploadDir, id + ".json");

    await fs.move(file.filepath, newPath);
    await fs.writeJson(timestampPath, { timestamp: Date.now(), file: path.basename(newPath) });

    res.status(200).json({ id });
  });
}
