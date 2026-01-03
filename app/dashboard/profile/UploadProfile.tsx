"use client";

import { useState } from "react";
import Image from "next/image";
import pinata from "@/lib/ipfs";

interface Props {
  initialCid: string | null;
}

export default function UploadProfile({ initialCid }: Props) {
  const [currentCid, setCurrentCid] = useState<string | null>(initialCid);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const currentImageUrl = currentCid
    ? `https://gateway.pinata.cloud/ipfs/${currentCid}`
    : null;

  const upload = async () => {
    if (!file) return alert("Select an image");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await pinata.upload.file(formData);

    // update DB (API call)
    await fetch("/api/upload", {
      method: "POST",
      //headers: { "Content-Type": "application/json" },
      //body: JSON.stringify({ cid: res.IpfsHash }),
      body: formData,
    });

    // update UI
    setCurrentCid(res.IpfsHash);
    setFile(null);
    setPreviewUrl(null);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Display CURRENT profile image */}
      <div className="relative h-28 w-28 rounded-full overflow-hidden border">
        {currentImageUrl ? (
        //   <Image
        //     src={currentImageUrl}
        //     alt="Profile"
        //     fill
        //     className="object-cover"
        //   />
        <img
            src={currentImageUrl}
            alt="Profile"
            className="h-full w-full object-cover"
            />

        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>

      {/* Preview (only if file selected) */}
      {previewUrl && (
        <div className="relative h-20 w-20 rounded-full overflow-hidden border opacity-80">
          <Image src={previewUrl} alt="Preview" fill className="object-cover" />
        </div>
      )}

      {/* File input */}
      <label className="cursor-pointer text-sm font-medium text-blue-600">
        Change photo
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setFile(f);
            setPreviewUrl(URL.createObjectURL(f));
          }}
        />
      </label>

      {/* Upload button */}
      {file && (
        <button
          onClick={upload}
          disabled={loading}
          className="px-4 py-2 text-sm rounded-md bg-black text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Save"}
        </button>
      )}
    </div>
  );
}
