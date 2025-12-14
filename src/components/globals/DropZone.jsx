/* eslint-disable no-debugger */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import{ useState } from 'react';
import axios from "axios";
import '../../assets/sass/dropzone.scss'
export const DropZone = ({ title, text, name, type, id, setImage, onChange}) => {
    const [active, setActive] = useState(false);
    const [dropzoneFile, setDropzoneFile] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
  
    const toggleActive = () => {
      setActive(!active);
    };
  
    const handleDrop = (e) => {
      e.preventDefault();
      setSelectedFile(e.dataTransfer.files[0]);
      setDropzoneFile(e.dataTransfer.files[0]);
      setImage(e.dataTransfer.files[0], id);
    };

    // const handleOnchangeSelect = (e, ) => {
    //     e.preventDefault();
    //     const file = e.target.files[0];
    //     if (file) {
    //         setDropzoneFile(file);
    //         setSelectedFile(file);
    //         setImage(file);
    //     }
        
    // };

    // const handleFileUpload = async (e) => {
    //     e.preventDefault();
    //     if (selectedFile) { // Verificar si hay un archivo seleccionado

    //         try {
    //             const formData = new FormData();
    //             formData.append('image', selectedFile);

    //             const response = await axios.post(
    //                 import.meta.env.VITE_APP_API_UPDLAD_IMAGE_URL,
    //                 formData
    //             );

    //             if (response.status === 200) {
    //                 const data = response.data;
    //                 setImage(data.imageUrl);
    //                 console.log('Imagen Enviada correctamente', data.imageUrl)
                    
    //             } else {
    //                 console.error('Error uploading image:', response.statusText);
    //             }
    //         } catch (error) {
    //             console.error('Error uploading image:', error);
    //         }
    //     } else {
    //         console.error('No file selected.');
    //         return;
    //     }
    // };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        setSelectedFile(file);
        setDropzoneFile(file);
        if (file) { // Verificar si hay un archivo seleccionado

            try {
                const formData = new FormData();
                formData.append('image', file);

                const response = await axios.post(
                    import.meta.env.VITE_APP_API_UPDLAD_IMAGE_URL,
                    formData
                );

                if (response.status === 200) {
                    const data = response.data;
                    setImage(data.imageUrl);
                    console.log('Imagen Enviada correctamente')
                    setSuccessMessage("¡Imagen enviada correctamente!");
                    
                } else {
                    console.error('Error uploading image:', response.statusText);
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        } else {
            console.error('No file selected.');
            return;
        }
    };
  

   //     e.preventDefault();
    //     const imageProduct = e.target.files[0];
        
    //     if (imageProduct) {
            
    //         try {
    //             debugger
    //             const response = await axios.post(
    //                 import.meta.env.VITE_APP_API_UPDLAD_IMAGE_URL,
    //                 ImageProduct
    //                 );
                    
    //             if (response.ok) {
    //                 const data = await response.json();
    //                 setImage(data.imageUrl);
    //             } else {
    //                 console.error('Error uploading image:', response.statusText);
    //             }
    //         } catch (error) {
    //             console.error('Error uploading image:', error);
    //         }
    //     }
    // };
    
    return (
      <div className={`card-profile ${active ? 'active-dropzone' : ''}`}>
        <label
          htmlFor={id}
          onDragEnter={toggleActive}
          onDragLeave={toggleActive}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="dropzone card-profile__border"
        >
          <div className="card-profile__drag">
            <input
              type={type}
              className={`dropzoneFile card-profile__input ${id}`}
              id={id}
              name={name}
              onChange={handleFileUpload}
            />
            <div className="card-profile__title">
              <p className="card-profile__upload">Drag and drop file, or <strong>Browse computer</strong></p>
              <p className="card-profile__upload">Upload files up to 30mb</p>
            </div>
            <div className='group'>
                <span className="file-info">{dropzoneFile && dropzoneFile.name}</span>
                {dropzoneFile && (
                  <img src={URL.createObjectURL(dropzoneFile)} alt="Selected" className="selected-image" />
                )}
            {successMessage && <p>{successMessage}</p>}
            </div>
            {/* <button onClick={handleFileUpload} disabled={!selectedFile}>Cargar Imagen</button> */}
          </div>
        </label>
      </div>
    );
  };