import { useEffect, useState } from "react";
import styles from "../../assets/styles/lists.module.scss";
import { useDispatch, useSelector } from "react-redux";
import ListingCard from "../../components/ListingCard";
import { setReservationList } from "../../redux/state";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { message } from "antd";
import { Box, Grid, Skeleton } from "@mui/material";

const ReservationList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user._id);
  const reservationList = useSelector((state) => state.user.reservationList);

  const dispatch = useDispatch();

  const getReservationList = async () => {
    try {
      const response = await axios.get(
        `https://airbnb-final-project-server.onrender.com/api/users/${userId}/reservations`
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
    <Grid
      container
      spacing={2}
      justifyContent="center"
      sx={{ padding: "0 70px" }}
    >
      {[...Array(8)].map((_, index) => (
        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
            }}
          >
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
