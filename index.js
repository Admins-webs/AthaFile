import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLink(`${window.location.origin}/download/${data.id}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>AthaFile</h1>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
      {link && <p>Shareable Link: <a href={link} target="_blank">{link}</a></p>}
    </div>
  );
}
