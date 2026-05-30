// frontend/cloudinary-loader.js
export default function cloudinaryLoader({ src, width, quality }) {
  const params = [
    "f_auto",
    "c_limit",
    `w_${width}`,
    `q_${quality || "auto"}`,
  ].join(",");

  // src is the full Cloudinary URL, e.g.:
  // https://res.cloudinary.com/ddnxkvs4w/image/upload/v.../file.jpg
  // We inject transformation params after /upload/
  return src.replace("/upload/", `/upload/${params}/`);
}