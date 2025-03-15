import { useState } from "react";
import styles from "../assets/styles/listingCard.module.scss";
import {
  ArrowForwardIos,
  ArrowBackIosNew,
  Favorite,
  Delete,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setWishList } from "../redux/state";
import axios from "axios";
import { message, Rate } from "antd";
import { IconButton } from "@mui/material";

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
  showDeleteButton = false,
  onDelete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const listings = useSelector((state) => state.listings);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const wishList = user?.wishList || [];

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + listingPhotoPaths.length) % listingPhotoPaths.length
    );
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % listingPhotoPaths.length);
  };

  const listing = listings.find((listing) => listing._id === listingId);
  const averageRating = listing?.averageRating || 0;

  const isLiked = wishList?.find((item) => item?._id === listingId);

  const patchWishList = async () => {
    if (user?._id !== creator._id) {
      try {
        const response = await axios.put(
          `https://airbnb-final-project-server.onrender.com/api/users/${user?._id}/${listingId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        dispatch(setWishList(response.data.wishList));
        message.success("Item added or deleted to your wishlist!");
      } catch (err) {
        message.error("Failed to add item to wishlist. Please try again.");
      }
    } else {
      return;
    }
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


        <div className={styles["listing-info"]}>
          <div className={styles["info"]}>
            <h3>
              {city}, {province}, {country}
            </h3>
            <p>{category}</p>

            {!booking ? (
              <>
                <p>{type}</p>
                <p className={styles["price"]}>
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
          </div>
          <div>
            <div style={{ textAlign: "center" }}>
              <Rate disabled defaultValue={1} count={1} />
              <span>{averageRating.toFixed(1)}</span>
            </div>

          </div>
        </div>



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

        {showDeleteButton && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDelete(listingId);
            }}
            sx={{
              position: "absolute",
              top: "10px",
              left: "10px",
              color: "red",
              "&:hover": {
                backgroundColor: "rgba(255, 0, 0, 0.1)",
              },
            }}
          >
            <Delete />
          </IconButton>
        )}
      </div>
    </>
  );
};

export default ListingCard;