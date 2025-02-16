import styles from "../../assets/styles/createListing.module.scss";
import { categories, types } from "../../data";
import { IoIosImages } from "react-icons/io";
import { BiTrash } from 'react-icons/bi';
import { useState } from "react";
import { DndContext, useDroppable, useDraggable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const CreateListing = () => {
  const [photos, setPhotos] = useState([]);

  const handleUploadPhotos = (event) => {
    setPhotos((prevPhotos) => [...prevPhotos, ...Array.from(event.target.files)]);
  };

  const handleRemovePhoto = (index) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
  
    if (!active || !over) return;
  
    if (active.id !== over.id) {
      const oldIndex = parseInt(active.id, 10);
      const newIndex = parseInt(over.id, 10);
  
      setPhotos((prevPhotos) => {
        const reorderedPhotos = [...prevPhotos];
        const [movedPhoto] = reorderedPhotos.splice(oldIndex, 1);
        reorderedPhotos.splice(newIndex, 0, movedPhoto);
        return reorderedPhotos;
      });
    }
  };
  

  return (
    <div className={styles["create-listing"]}>
      <h1>Publish Your Place</h1>
      <form>
        {/* Step 1 */}
        <div className={styles["create-listing_step1"]}>
          <h2>Step 1: Tell us about your place</h2>
          <hr />
          <h3>Which of these categories best describes your place?</h3>
          <div className={styles["category-list"]}>
            {categories?.map((item, index) => (
              <div className={styles["category"]} key={index}>
                <div className={styles["category_icon"]}>{item.icon}</div>
                <p>{item.label}</p>
              </div>
            ))}
          </div>
          <h3>What type of place will guests have?</h3>
          <div className={styles["type-list"]}>
            {types?.map((item, index) => (
              <div className={styles["type"]} key={index}>
                <div className={styles["type_text"]}>
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                </div>
                <div className={styles["type_icon"]}>{item.icon}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2 */}
        <div className={styles["create-listing_step2"]}>
          <h2>Step 2: Make your place stand out</h2>
          <hr />
          <h3>Add some photos of your place</h3>

          <DndContext onDragEnd={handleDragEnd}>
            <SortableContext
              items={photos.map((_, index) => `photo-${index}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className={styles["photos"]}>
                {photos.length < 1 ? (
                  <>
                    <input
                      id="image"
                      type="file"
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={handleUploadPhotos}
                      multiple
                    />
                    <label htmlFor="image" className={styles["alone"]}>
                      <div className={styles["icon"]}>
                        <IoIosImages />
                      </div>
                      <p>Upload from your device</p>
                    </label>
                  </>
                ) : (
                  <>
                    {photos.map((photo, index) => (
                      <DraggablePhoto
                        key={index}
                        index={index}
                        photo={photo}
                        handleRemovePhoto={handleRemovePhoto}
                      />
                    ))}
                    <input
                      id="image"
                      type="file"
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={handleUploadPhotos}
                      multiple
                    />
                    <label htmlFor="image" className="together">
                      <div className={styles["icon"]}>
                        <IoIosImages />
                      </div>
                      <p>Upload more photos</p>
                    </label>
                  </>
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <button className="submit_btn" type="submit">
          CREATE YOUR LISTING
        </button>
      </form>
    </div>
  );
};

const DraggablePhoto = ({ index, photo, handleRemovePhoto }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
      id: `photo-${index}`, 
    });
  
    return (
      <div ref={setNodeRef} {...listeners} {...attributes} className={styles["photo"]}>
        <img src={URL.createObjectURL(photo)} alt="Uploaded" />
        <button type="button" onClick={() => handleRemovePhoto(index)}>
          <BiTrash />
        </button>
      </div>
    );
  };

export default CreateListing;
