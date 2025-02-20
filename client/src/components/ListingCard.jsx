import { useState } from "react";
import styles from "../assets/styles/listingCard.module.scss";
import {
  ArrowForwardIos,
  ArrowBackIosNew,
  Favorite,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setWishList } from "../redux/state";
import axios from "axios";

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
  startDate,
  endDate,
  totalPrice,
  booking,
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
  const dispatch = useDispatch();

  /* ADD TO WISHLIST */
  const user = useSelector((state) => state.user);
  const wishList = user?.wishList || [];

  const isLiked = wishList?.find((item) => item?._id === listingId);

  const patchWishList = async () => {
    if (user?._id !== creator._id) {
      const response = await axios.patch(
        `http://localhost:5000/api/users/${user?._id}/${listingId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(setWishList(response.data.wishList));
    } else { return }
  };

  return (
    <>
      <div
        className={styles["listing-card"]}
        onClick={() => {
          navigate(`/properties/${listingId}`);
        }}
      >
        <div className={styles["slider-container"]}>
          <div
            className={styles["slider"]}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {listingPhotoPaths?.map((photo, index) => (
              <div key={index} className={styles["slide"]}>
                <img src={photo} alt={`photo ${index + 1}`} />
                <div
                  className={styles["prev-button"]}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevSlide(e);
                  }}
                >
                  <ArrowBackIosNew sx={{ fontSize: "15px" }} />
                </div>
                <div
                  className={styles["next-button"]}
                  onClick={(e) => {
                    e.stopPropagation();
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

        {!booking ? (
          <>
            <p>{type}</p>
            <p>
              <span>${price}</span> night
            </p>
          </>
        ) : (
          <>
            <p>
              {startDate} - {endDate}
            </p>
            <p>
              <span>${totalPrice}</span> total
            </p>
          </>
        )}

        <button
          className={styles["favorite"]}
          onClick={(e) => {
            e.stopPropagation();
            patchWishList();
          }}
          disabled={!user}
        >
          {isLiked ? (
            <Favorite sx={{ color: "red" }} />
          ) : (
            <Favorite sx={{ color: "white" }} />
          )}
        </button>
      </div>
    </>
  );
};

export default ListingCard;
