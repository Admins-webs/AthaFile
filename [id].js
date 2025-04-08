import fs from "fs-extra";
import path from "path";

export async function getServerSideProps({ params, res }) {
  const dir = path.join(process.cwd(), "uploads");
  const files = await fs.readdir(dir);
  const metaFile = files.find(f => f.startsWith(params.id) && f.endsWith(".json"));

  if (!metaFile) return { notFound: true };

  const meta = await fs.readJson(path.join(dir, metaFile));
  const age = Date.now() - meta.timestamp;

  if (age > 86400000) {
    await fs.remove(path.join(dir, meta.file));
    await fs.remove(path.join(dir, metaFile));
    return { notFound: true };
  }

  const filePath = path.join(dir, meta.file);
  res.setHeader("Content-Disposition", `attachment; filename="${meta.file.split('-').slice(1).join('-')}"`);
  res.setHeader("Content-Type", "application/octet-stream");
  const file = await fs.readFile(filePath);
  res.end(file);

  return { props: {} };
}

export default function DownloadPage() {
  return <p>Downloading...</p>;
}
