import styles from "../../assets/styles/lists.module.scss";
import { useDispatch, useSelector } from "react-redux";
import ListingCard from "../../components/ListingCard";
import { useEffect, useState } from "react";
import { setPropertyList } from "../../redux/state";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { Box, Grid, Skeleton } from "@mui/material";
import { Modal, message } from "antd";

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


  const handleDeleteProperty = async (listingId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this property?",
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const resp = await axios.delete(
            `https://airbnb-final-project-server.onrender.com/api/listings/${listingId}`
          );
          message.success("Property deleted successfully!");
          console.log(resp);
          getPropertyList();
        } catch (err) {
          console.log("Delete property failed", err.message);
          message.error("Failed to delete property. Please try again.");
        }
      },
      onCancel: () => {
        message.success("Deletion cancelled!");
        console.log("Deletion cancelled");
      },
    });
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
            {propertyList.length === 0 ? (
            <div className={styles["empty-message"]}>
              <img src="/images/empty.gif" alt="" />
              <p>There is nothing here :(</p>
            </div>
          ) : (
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
              showDeleteButton={true}
              onDelete={handleDeleteProperty}
            />
          )
        )}
      </div>
          )}
    </>
  );
};

export default PropertyList;