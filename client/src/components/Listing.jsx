import { categories } from "../data";
import styles from "../assets/styles/listing.module.scss";
import ListingCard from "./ListingCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setListings } from "../redux/state";
import axios from "axios";
import { message } from "antd";
import { ArrowForwardIos, ArrowBackIosNew } from "@mui/icons-material";
import { Grid, Skeleton, Box } from "@mui/material"; 

const Listing = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const listings = useSelector((state) => state.listings);

  const getFeedListings = async () => {
    try {
      const url =
        selectedCategory !== "All"
          ? `https://airbnb-final-project-server.onrender.com/api/listings?category=${selectedCategory}`
          : "https://airbnb-final-project-server.onrender.com/api/listings/active";

      const response = await axios.get(url);
      dispatch(setListings({ listings: response.data }));
      setLoading(false);
      message.success("Listings loaded successfully!");
    } catch (err) {
      console.log("Fetch Listings Failed", err);
      setLoading(false);
      message.error("Failed to load listings. Please try again.");
    }
  };

  useEffect(() => {
    getFeedListings();
  }, [selectedCategory]);

  const [itemsPerSlide, setItemsPerSlide] = useState(12);

  useEffect(() => {
    const updateItemsPerSlide = () => {
      const width = window.innerWidth;
      if (width > 1200) setItemsPerSlide(12);
      else if (width > 992) setItemsPerSlide(10);
      else if (width > 768) setItemsPerSlide(8);
      else if (width > 576) setItemsPerSlide(6);
      else setItemsPerSlide(4);
    };

    updateItemsPerSlide();
    window.addEventListener("resize", updateItemsPerSlide);
    return () => window.removeEventListener("resize", updateItemsPerSlide);
  }, []);

  const totalSlides = Math.ceil(categories.length / itemsPerSlide);
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <>
      <div className={styles["slider-container"]}>
        <button className={styles["prev-button"]} onClick={goToPrevSlide}>
          <ArrowBackIosNew sx={{ fontSize: "15px" }} />
        </button>

        <div className={styles["slider-wrapper"]}>
          <div
            className={styles["slider"]}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div key={slideIndex} className={styles["slide"]}>
                {categories
                  .slice(
                    slideIndex * itemsPerSlide,
                    (slideIndex + 1) * itemsPerSlide
                  )
                  .map((category, index) => (
                    <div
                      key={index}
                      className={`${styles.category} ${
                        category.label === selectedCategory
                          ? styles["selected"]
                          : ""
                      }`}
                      onClick={() => setSelectedCategory(category.label)}
                    >
                      <div className={styles["category_icon"]}>
                        {category.icon}
                      </div>
                      <p>{category.label}</p>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        <button className={styles["next-button"]} onClick={goToNextSlide}>
          <ArrowForwardIos sx={{ fontSize: "15px" }} />
        </button>
      </div>

      {loading ? (
        <Grid container spacing={2} justifyContent="center" sx={{ padding: '0 70px' }}>
          {[...Array(8)].map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <Box sx={{
                  p: 1,
                  borderRadius: 2, 
                }}>
                <Skeleton variant="rectangular" width="100%" height={250} />
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="40%" />
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <div className={styles["listings"]}>
          {listings.map(
            ({
              _id,
              creator,
              listingPhotoPaths,
              city,
              province,
              country,
              category,
              type,
              price,
              booking = false,
            }) => (
              <ListingCard
                key={_id}
                listingId={_id}
                creator={creator}
                listingPhotoPaths={listingPhotoPaths}
                city={city}
                province={province}
                country={country}
                category={category}
                type={type}
                price={price}
                booking={booking}
              />
            )
          )}
        </div>
      )}
    </>
  );
};

export default Listing;
