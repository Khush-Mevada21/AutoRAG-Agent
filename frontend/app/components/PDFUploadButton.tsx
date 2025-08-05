"use client";

import React from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface PdfUploadButton{
  setSessionId: (id: string) => void;
  onFileUploaded: (filename: string) => void;
}

const PdfUploadButton: React.FC<PdfUploadButton> = ({
  setSessionId,
  onFileUploaded,
}) => {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.session_id) {
        setSessionId(data.session_id);             
        onFileUploaded(file.name);                
        toast.success("PDF uploaded and indexed successfully!");
      } else {
        toast.error(`Upload failed: ${data.detail || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload failed.");
    }
  };

  return (
    <label
      htmlFor="pdfUpload"
      className="cursor-pointer text-xl font-bold text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
      title="Upload PDF"
    >
      +
      <input
        type="file"
        id="pdfUpload"
        accept=".pdf"
        className="hidden"
        onChange={handleFileUpload}
      />
      <ToastContainer />
    </label>
    
  );
};

export default PdfUploadButton;
