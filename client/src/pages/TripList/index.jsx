import { useDispatch, useSelector } from "react-redux";
import styles from "../../assets/styles/lists.module.scss";
import Loader from "../../components/Loader";
import { setTripList } from "../../redux/state";
import { useEffect, useState } from "react";
import ListingCard from "../../components/ListingCard";


const TripList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user._id);
  const tripList = useSelector((state) => state.user.tripList);

  const dispatch = useDispatch();

  const getTripList = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}/trips`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      dispatch(setTripList(data));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Trip List failed!", err.message);
    }
  };
 
  useEffect(() => {
    getTripList();
  }, []);

  return loading ? <Loader /> : 
  <>
  <h1 className={styles["title-list"]}>Your Trip List</h1>
  <div className={styles["list"]}>
        {tripList?.map(({ listingId, hostId, startDate, endDate, totalPrice, booking=true }) => (
          <ListingCard
            listingId={listingId._id}
            creator={hostId._id}
            listingPhotoPaths={listingId.listingPhotoPaths}
            city={listingId.city}
            province={listingId.province}
            country={listingId.country}
            category={listingId.category}
            startDate={startDate}
            endDate={endDate}
            totalPrice={totalPrice}
            booking={booking}
          />
        ))}
      </div>
  </>;
};

export default TripList;
