import styles from "../../assets/styles/lists.module.scss";
import { useSelector } from "react-redux";
import ListingCard from "../../components/ListingCard";

const WishList = () => {
  const wishList = useSelector((state) => state.user.wishList);

  return (
    <>
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