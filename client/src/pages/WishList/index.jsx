import styles from "../../assets/styles/lists.module.scss";
import { useSelector } from "react-redux";
import ListingCard from "../../components/ListingCard";
import { Helmet } from "react-helmet-async";
import { Box, Grid, Skeleton } from "@mui/material";
import { useState, useEffect } from "react";

const WishList = () => {
  const [loading, setLoading] = useState(true);
  const wishList = useSelector((state) => state.user.wishList);

  useEffect(() => {
    if (wishList) {
      setLoading(false);
    }
  }, [wishList]);

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
        <title>Airbnb | Wish List</title>
        <meta name="description" content="wish page" />
      </Helmet>
      <h1 className={styles["title-list"]}>Your Wish List</h1>
      <div className={styles["list"]}>
        {wishList?.map(
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
    </>
  );
};

export default WishList;