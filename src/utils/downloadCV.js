export async function downloadCV(resumeLink, defaultName = "Kundan_Kumar_CV") {
  if (!resumeLink) {
    alert("CV will be uploaded soon! Please contact directly or check back later.");
    return;
  }

  // If it's a data URL (base64)
  if (resumeLink.startsWith("data:")) {
    try {
      // Use native fetch to convert data URL to Blob reliably
      const response = await fetch(resumeLink);
      const blob = await response.blob();

      // Determine proper file extension from blob type
      let ext = ".pdf";
      if (blob.type.includes("word") || blob.type.includes("officedocument")) {
        ext = ".docx";
      } else if (blob.type.includes("msword")) {
        ext = ".doc";
      }

      const fileName = defaultName.endsWith(ext)
        ? defaultName
        : `${defaultName.replace(/\.[^/.]+$/, "")}${ext}`;

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    } catch (err) {
      console.error("Blob download error, opening directly:", err);
      window.open(resumeLink, "_blank");
    }
  } else {
    // Hosted URL (Google Drive, Dropbox, external PDF)
    window.open(resumeLink, "_blank", "noopener,noreferrer");
  }
}
