import { useParams } from "react-router-dom";
import styles from "../../assets/styles/lists.module.scss";
import { setListings } from "../../redux/state";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import ListingCard from "../../components/ListingCard";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { message } from "antd";
import { Box, Grid, Skeleton } from "@mui/material";

const SearchPage = () => {
  const [loading, setLoading] = useState(true);
  const { search } = useParams();
  const listings = useSelector((state) => state.listings);

  const dispatch = useDispatch();

  const getSearchListings = async () => {
    try {
      const response = await axios.get(
        `https://airbnb-final-project-server.onrender.com/api/listings/search/${search}`
      );

      dispatch(setListings({ listings: response.data }));
      setLoading(false);
      message.success(`Found ${response.data.length} listings for "${search}"`);
    } catch (err) {
      console.log("Fetch Search List failed!", err.message);
      message.error("Failed to fetch search results. Please try again later."); 
    }
  };

  useEffect(() => {
    getSearchListings();
  }, [search]);

  return loading ?  (
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
        <title>Airbnb | Search</title>
        <meta name="description" content="search page" />
      </Helmet>
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
