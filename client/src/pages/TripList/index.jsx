import { useDispatch, useSelector } from "react-redux";
import styles from "../../assets/styles/lists.module.scss";
import { setTripList } from "../../redux/state";
import { useEffect, useState } from "react";
import ListingCard from "../../components/ListingCard";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { message } from "antd";
import { Box, Grid, Skeleton } from "@mui/material";

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
    <>
      <Helmet>
        <title>Airbnb | Trip List</title>
        <meta name="description" content="triplist page" />
      </Helmet>
      <h1 className={styles["title-list"]}>Your Trip List</h1>
      {tripList.length === 0 ? (
      <div className={styles["empty-message"]}>
        <img src="/images/empty.gif" alt="" />
        <p>There is nothing here :(</p>
      </div>
    ) : (
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
            key={listingId._id}
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
    )}
    </>
  );
};

export default TripList;
