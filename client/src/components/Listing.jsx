import { categories } from "../data";
import styles from "../assets/styles/listing.module.scss";
import ListingCard from "./ListingCard";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setListings } from "../redux/state";
import axios from "axios";

const Listing = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const listings = useSelector((state) => state.listings);
  const getFeedListings = async () => {
    try {
      const url =
        selectedCategory !== "All"
          ? `http://localhost:5000/api/listings?category=${selectedCategory}`
          : "http://localhost:5000/api/listings";

      const response = await axios.get(url);

      dispatch(setListings({ listings: response.data }));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Listings Failed", err.message);
    }
  };

  useEffect(() => {
    getFeedListings();
  }, [selectedCategory]);

  //   console.log(listings);

  return (
    <>
      <div className={styles["category-list"]}>
        {categories?.map((category, index) => (
          <div
            className={`${styles.category} ${category.label === selectedCategory ? styles["selected"] : ""}`}
            key={index}
            onClick={() => {
              setSelectedCategory(category.label);
            }}
          >
            <div className={styles["category_icon"]}>{category.icon}</div>
            <p>{category.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <Loader />
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
              booking=false
            }) => (
              <ListingCard
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
