import { useEffect, useState } from "react";
import styles from "../../assets/styles/lists.module.scss";
import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import ListingCard from "../../components/ListingCard";
import { setReservationList } from "../../redux/state";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { message } from "antd"; 

const ReservationList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user._id);
  const reservationList = useSelector((state) => state.user.reservationList);

  const dispatch = useDispatch();

  const getReservationList = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${userId}/reservations`
      );
      const data = response.data;
      dispatch(setReservationList(data));
      setLoading(false);
      message.success("Your reservations have been successfully loaded!");
    } catch (err) {
      console.log("Fetch Reservation List failed!", err.message);
      message.error("Failed to fetch your reservations. Please try again.");
    }
  };

  useEffect(() => {
    getReservationList();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Helmet>
        <title>Airbnb | Reservation List</title>
        <meta name="description" content="reservation page" />
      </Helmet>
      <h1 className={styles["title-list"]}>Your Reservation List</h1>
      <div className={styles["list"]}>
        {reservationList?.map(
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
          )
        )}
      </div>
    </>
  );
};

export default ReservationList;
