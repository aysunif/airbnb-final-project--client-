import styles from "../../assets/styles/lists.module.scss";
import { useDispatch, useSelector } from "react-redux";
import ListingCard from "../../components/ListingCard";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { setPropertyList } from "../../redux/state";
import axios from "axios";
import { Helmet } from "react-helmet-async";

const PropertyList = () => {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const propertyList = user?.propertyList;
  //   console.log(user)

  const dispatch = useDispatch();
  const getPropertyList = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${user._id}/properties`
      );

      console.log(response.data);
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
    <Loader />
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
