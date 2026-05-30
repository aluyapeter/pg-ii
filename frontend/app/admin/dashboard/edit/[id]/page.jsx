"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./Edit.module.scss";
import RichTextEditor from "@/components/admin/editor/RichTextEditor";

export default function EditPost() {
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [summary, setSummary] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  
  // Cover Image States
  const [coverImage, setCoverImage] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${baseUrl}/api/admin/posts/${id}`, { credentials: "include" });
        if (!res.ok) throw new Error("Post not found");

        const data = await res.json();
        
        setTitle(data.title || "");
        setCategory(data.category || "");
        setContent(data.content || "");
        setIsPublished(data.is_published || false);
        setSummary(data.summary || "");
        setCoverImage(data.cover_image || "");
        
        if (data.scheduled_at) {
          const date = new Date(data.scheduled_at);
          date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
          setScheduledAt(date.toISOString().slice(0, 16));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  const uploadImage = async (file) => {
    if (!file || !file.type.startsWith('image/')) return alert("Invalid image file.");
    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${baseUrl}/api/posts/upload-image`, {
        method: 'POST', body: formData, credentials: 'include', 
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setCoverImage(data.url); 
    } catch (err) {
      alert('Failed to upload image.');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadImage(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${baseUrl}/api/admin/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          title, category, content, is_published: isPublished, summary,
          cover_image: coverImage || null,
          scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null
        }),
      });

      if (!res.ok) throw new Error("Failed to update post");
      router.push("/admin/dashboard/posts");
    } catch (err) {
      alert(err.message);
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.message}>Loading editor...</div>;
  if (error) return <div className={styles.message}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Edit Post</h1>
        <div className={styles.actions}>
           <button onClick={() => router.back()} className={styles.cancelBtn}>Cancel</button>
           <button onClick={handleUpdate} disabled={saving || isUploadingImage} className={styles.saveBtn}>
             {saving ? "Saving..." : "Save Changes"}
           </button>
        </div>
      </header>

      <form className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Post Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={styles.input} required />
        </div>

        <div className={styles.inputGroup}>
          <label>Category</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className={styles.input} required />
        </div>

        <div className={styles.inputGroup}>
          <label>Summary (SEO Description)</label>
          <textarea value={summary} onChange={(e) => setSummary(e.target.value)} className={styles.textarea} rows={3} maxLength={500} />
        </div>

        <div className={styles.inputGroup}>
          <label>Cover Image</label>
          {!coverImage ? (
            <div 
              className={`${styles.dropzone} ${isDragging ? styles.dragging : ""}`}
              onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => uploadImage(e.target.files[0])} style={{ display: 'none' }} />
              <div className={styles.dropzoneText}>
                {isUploadingImage ? "Uploading..." : "Click or drag an image here"}
              </div>
            </div>
          ) : (
            <div className={styles.imageContainer}>
              <div className={styles.coverPreview}>
                <Image
                  src={coverImage}
                  alt="Cover Preview"
                  fill
                  sizes="400px"
                  style={{ objectFit: "cover", borderRadius: "8px" }}
                />
              </div>
              <button type="button" onClick={() => setCoverImage("")} className={styles.btnSecondary} style={{ marginTop: "0.5rem" }}>
                Remove Image
              </button>
            </div>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label>Schedule Publication (Optional)</label>
          <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className={styles.input} />
        </div>

        <div className={styles.inputGroup}>
          <label>Status</label>
          <select value={isPublished.toString()} onChange={(e) => setIsPublished(e.target.value === "true")} className={styles.select}>
            <option value="false">Draft (Hidden)</option>
            <option value="true">Published (Live)</option>
          </select>
        </div>

        <div className={styles.editorWrapper}>
          <label>Content</label>
          <RichTextEditor content={content} onChange={setContent} />
        </div>
      </form>
    </div>
  );
}