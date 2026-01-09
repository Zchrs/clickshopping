/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import { upload } from "@imagekit/react";
import styled from 'styled-components';



export const MultiDropZoneImageKit = ({ id, setImages, name }) => {
  const [active, setActive] = useState(false);
  const [dropzoneFiles, setDropzoneFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);

  const isProduction = import.meta.env.PROD;

  const MAX_FILE_SIZE = 30 * 1024 * 1024;
  const MAX_FILES = 6;

  const authenticator = async () => {
  const res = await fetch(
    import.meta.env.VITE_IMAGEKIT_AUTH_ENDPOINT
  );

  if (!res.ok) {
    throw new Error("Auth failed");
  }

  return res.json(); // { token, expire, signature }
};

  const handleDragEvents = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setActive(false);
    const files = Array.from(e.dataTransfer.files).slice(0, MAX_FILES);
    validateAndSetFiles(files);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, MAX_FILES);
    validateAndSetFiles(files);
  };

  const validateAndSetFiles = (files) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    const invalidFiles = files.filter(
      (file) =>
        !validTypes.includes(file.type) || file.size > MAX_FILE_SIZE
    );

    if (invalidFiles.length > 0) {
      setUploadStatus("error");
      setErrorMessage(
        "Formato o tamaño inválido (JPEG, PNG, GIF, WEBP hasta 30MB)"
      );
      return;
    }

    setDropzoneFiles(files);
    setUploadStatus("idle");
    uploadImages(files);
  };

  const uploadToLocalServer = async (files) => {
  const formData = new FormData();

  files.forEach(file => {
    formData.append("img_url", file);
  });

  const res = await fetch(
    import.meta.env.VITE_APP_API_UPLOAD_IMAGES_PRODUCTS_URL,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) throw new Error("Error local upload");

  const data = await res.json();
  return data.imageUrls;
};

const uploadToImageKit = async (files) => {
  const uploadedUrls = [];
  let completed = 0;

  for (const file of files) {
    const { token, expire, signature } = await authenticator();
    const ext = file.name.split(".").pop();

    const result = await upload({
      file,
      fileName: `${Date.now()}.${ext}`,
      publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
      token,
      expire,
      signature,
      folder: "/uploads",

      isPrivateFile: false, // 🔥 CLAVE ABSOLUTA

      onProgress: (evt) => {
        const percent = Math.round(
          ((completed + evt.loaded / evt.total) / files.length) * 100
        );
        setUploadProgress(percent);
      },
    });

    uploadedUrls.push(result.url);
    completed++;
  }

  return uploadedUrls;
};



const uploadImages = async (files) => {
  setUploadStatus("uploading");
  setUploadProgress(0);

  const urls = isProduction
    ? await uploadToImageKit(files)
    : await uploadToLocalServer(files);

  setImages(urls);
  setUploadStatus("success");
};

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <MultiDropzone>
      <div className={`multi-dropzone-container ${active ? "active" : ""}`}>
        <div
          className="multi-dropzone-area"
          onDragEnter={handleDragEvents}
          onDragLeave={handleDragEvents}
          onDragOver={handleDragEvents}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input
            ref={fileInputRef}
            type="file"
            id={id}
            name={name}
            className="file-input"
            accept="image/*"
            multiple
            hidden
            onChange={handleFileChange}
          />
          {dropzoneFiles.length === 0 ? (
            <p>Arrastra hasta {MAX_FILES} imágenes o haz clic</p>
          ) : (
            <div className="preview-grid">
              {dropzoneFiles.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="preview-image"
                />
              ))}
            </div>
          )}
          {uploadStatus === "uploading" && (
            <div className="progress-bar">
              Subiendo... {uploadProgress}%
            </div>
          )}
          {uploadStatus === "error" && (
            <div className="error">{errorMessage}</div>
          )}
          {uploadStatus === "success" && (
            <div className="success">¡Imágenes subidas correctamente!</div>
          )}
        </div>
      </div>
    </MultiDropzone>
  );
};
 


  
  const MultiDropzone = styled.div`
  display: grid;
    .multidropzone {
    background-color: white;
    border-radius: 8px;
    border: 1px dashed var(--bg-secondary);
    
    &:not(:last-child) {
      margin-bottom: 24px;
    }
    &-group{
    position: relative;
    display: grid;
    width: 70%;
    gap: 10px;
    text-align  : center;
    place-items: center;
    margin: auto;

    p{
      color: green;
    }
  }
    &__drag {
      display: block;
      margin: 0 auto;
      padding: 16px;
      width: 100%;
  
      @media (max-width: 460px) {
        width: 90%;
      }
    }
    &__input {
      display: none;
      visibility: hidden;
    }
    &__title {
      font-size: 16px;
      font-weight: 300;
      line-height: 24px;
      text-align: center;
    }
    &__upload {
      font-size: 16px;
      font-weight: 300;
      line-height: 24px;
      letter-spacing: 0px;
      text-align: center;
      color: black;

      strong{
        font-weight: 700;
      }
    }
  }
  
  .active-dropzone {
    background-color: rgba(51, 106, 179, 0.05);
  }
  
  .file-info {
    gap: 4px;
    display: grid;
    text-align: center;
    margin-top: 6px;
    color: black;
  }
  .image-preview{
    display: grid;
    position: relative;
    align-items: center;
    place-items: center;
    width: 100%;
    img{
      width: 100%;
    }
  }

  .flex-l{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    width: 100%;
    align-items: center;
    place-items: center;
    position: relative;
  }

  .remove-button{
    width: fit-content;
    height: fit-content;
    display: grid;
    z-index: 100a;
    position: absolute;
    place-content: center;
    border: 1px solid red;
    background-color: white;
    padding: 2px 5px;
    font-size: 10px;
    font-weight: 300;
   color: red;
    pad: 0;
    top: 5px;
    right: 5px;
  }

  // estilo de nuevo diseño

  .multi-dropzone-container {
    display: grid;
  width: 100%;
  margin: 20px 0;
}

.multi-dropzone-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.multi-dropzone-area.active {
  border-color: #4CAF50;
  background-color: #f8f8f8;
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.upload-icon {
  color: #666;
  margin-bottom: 10px;
}

.dropzone-text {
  margin: 0;
  color: #333;
  font-size: 16px;
}

.dropzone-hint {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(70px, 1fr));
  gap: 15px;
  width: 100%;
}

.image-preview-container {
  position: relative;
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
}

.image-preview {
  position: relative;
  padding-top: 100%; /* Aspect ratio 1:1 */
  background: #f5f5f5;
}

.preview-image {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  object-fit: cover;
}

.remove-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-info {
  padding: 8px;
  background: #f9f9f9;
  font-size: 12px;
}

.file-name {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 10px;
}

.file-size {
  color: #666;
}

.progress-container {
  width: 100%;
  background: #f0f0f0;
  border-radius: 4px;
  margin-top: 15px;
  overflow: hidden;
}

.progress-bar {
  color: white;
  padding: 5px 0;
  background: #4CAF50;
  transition: width 0.3s ease;
}

.progress-text {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #666;
}

.success-message, .error-message {
  margin-top: 15px;
  padding: 8px 12px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.success {
  background: #e8f5e9;
  padding: 5px 0;
  color: #2e7d32;
    font-size: 16px;
  svg{
    margin: auto;
  }
}

.error {
  background: #ffebee;
  color: #c62828;
  padding: 5px 0;
  font-size: 16px;
}
  `