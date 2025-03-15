import { useDispatch, useSelector } from "react-redux";
import styles from "../../assets/styles/lists.module.scss";
import Loader from "../../components/Loader";
import { setTripList } from "../../redux/state";
import { useEffect, useState } from "react";
import ListingCard from "../../components/ListingCard";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { message } from "antd";

const TripList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user._id);
  const tripList = useSelector((state) => state.user.tripList);

  const dispatch = useDispatch();

  const getTripList = async () => {
    try {
      const response = await axios.get(
        `https://airbnb-final-project-server.onrender.com/api/users/${userId}/trips`
      );
      dispatch(setTripList(response.data));
      setLoading(false);
      message.success("Trip list loaded successfully!"); 
    } catch (err) {
      console.log("Get Trip List failed!", err.message);
      message.error("Failed to load your trip list. Please try again later.");
    }
  };

  useEffect(() => {
    getTripList();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Helmet>
        <title>Airbnb | Trip List</title>
        <meta name="description" content="triplist page" />
      </Helmet>
      <h1 className={styles["title-list"]}>Your Trip List</h1>
      <div className={styles["list"]}>
        {tripList?.map(
          ({
            listingId,
            hostId,
            startDate,
            endDate,
            totalPrice,
            booking = true,
          }) => (
            <ListingCard
              listingId={listingId._id}
              creator={hostId?._id}
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
          )
        )}
      </div>
    </>
  );
};

export default TripList;
