import styles from "../../assets/styles/lists.module.scss";
import { useSelector } from "react-redux";
import ListingCard from "../../components/ListingCard";
import { Helmet } from "react-helmet-async";

const WishList = () => {
  const wishList = useSelector((state) => state.user.wishList);

  return (
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
