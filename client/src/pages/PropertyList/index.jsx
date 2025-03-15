import styles from "../../assets/styles/lists.module.scss";
import { useDispatch, useSelector } from "react-redux";
import ListingCard from "../../components/ListingCard";
import { useEffect, useState } from "react";
import { setPropertyList } from "../../redux/state";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { Box, Grid, Skeleton } from "@mui/material";

const PropertyList = () => {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const propertyList = user?.propertyList;

  const dispatch = useDispatch();
  const getPropertyList = async () => {
    try {
      const response = await axios.get(
        `https://airbnb-final-project-server.onrender.com/api/users/${user._id}/properties`
      );

      dispatch(setPropertyList(response.data));
      setLoading(false);
    } catch (err) {
      console.log("Get all properties failed", err.message);
    }
  };

  useEffect(() => {
    getPropertyList();
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
        <title>Airbnb | Property List</title>
        <meta name="description" content="property page" />
      </Helmet>
      <h1 className={styles["title-list"]}>Your Property List</h1>
      <div className={styles["list"]}>
        {propertyList?.map(
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

export default PropertyList;
