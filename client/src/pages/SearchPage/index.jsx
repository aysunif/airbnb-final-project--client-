import { useParams } from "react-router-dom";
import styles from "../../assets/styles/lists.module.scss";
import { setListings } from "../../redux/state";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import ListingCard from "../../components/ListingCard";
import axios from "axios";

const SearchPage = () => {
  const [loading, setLoading] = useState(true);
  const { search } = useParams();
  const listings = useSelector((state) => state.listings);

  const dispatch = useDispatch();

  const getSearchListings = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/listings/search/${search}`
      );

      dispatch(setListings({ listings: response.data }));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Search List failed!", err.message);
    }
  };

  useEffect(() => {
    getSearchListings();
  }, [search]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <h1 className={styles["title-list"]}>{search}</h1>
      <div className={styles["list"]}>
        {listings?.map(
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
    </>
  );
};

export default SearchPage;
