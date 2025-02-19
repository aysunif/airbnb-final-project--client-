import { useState } from "react";
import styles from "../assets/styles/listingCard.module.scss";
import { ArrowForwardIos, ArrowBackIosNew } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ListingCard = ({
  listingId,
  creator,
  listingPhotoPaths,
  city,
  province,
  country,
  category,
  type,
  price,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + listingPhotoPaths.length) % listingPhotoPaths.length
    );
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % listingPhotoPaths.length);
  };
  const navigate = useNavigate();
  return (
    <>
      <div className={styles["listing-card"]}   onClick={() => {
        navigate(`/properties/${listingId}`);
      }}>
        <div className={styles["slider-container"]}>
          <div
            className={styles["slider"]}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {listingPhotoPaths?.map((photo, index) => (
              <div key={index} className={styles["slide"]}>
                <img
                  src={`http://localhost:5000/${photo?.replace("public", "")}`}
                  alt={`photo ${index + 1}`}
                />
                <div
                  className={styles["prev-button"]}
                  onClick={(e) => {
                    goToPrevSlide(e);
                  }}
                >
                  <ArrowBackIosNew sx={{ fontSize: "15px" }} />
                </div>
                <div
                  className={styles["next-button"]}
                  onClick={(e) => {
                    goToNextSlide(e);
                  }}
                >
                  <ArrowForwardIos sx={{ fontSize: "15px" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <h3>
          {city}, {province}, {country}
        </h3>
        <p>{category}</p>
        <p>{type}</p>
        <p>
            <span>${price}</span> night
          </p>
      </div>
    </>
  );
};

export default ListingCard;
