import { useEffect, useState } from "react";
import styles from "../../assets/styles/listingDetails.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { facilities } from "../../data";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import Loader from "../../components/Loader";
import axios from "axios";
import { useSelector } from "react-redux";
import { Tag } from "antd";

const ListingDetails = () => {
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const { listingId } = useParams();
  const [listing, setListing] = useState(null);

  const getListingDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/listings/${listingId}`
      );

      setListing(response.data);
      setLoading(false);
    } catch (err) {
      console.log("Fetch Listing Details Failed", err.message);
    }
  };

  useEffect(() => {
    getListingDetails();
  }, []);

  console.log(listing);

  /* BOOKING CALENDAR */
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);
  const dayCount = Math.round(end - start) / (1000 * 60 * 60 * 24);

  /* SUBMIT BOOKING */
  const customerId = useSelector((state) => state?.user?._id);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const bookingForm = {
        customerId,
        listingId,
        hostId: listing.creator?._id,
        startDate: dateRange[0].startDate.toDateString(),
        endDate: dateRange[0].endDate.toDateString(),
        totalPrice: listing.price * dayCount,
      };

      const response = await axios.post(
        "http://localhost:5000/api/bookings/create",
        bookingForm,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        navigate(`/${customerId}/trips`);
      }
    } catch (err) {
      console.log("Submit Booking Failed.", err.message);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <div className={styles["listing-details"]}>
        <div className={styles["title"]}>
          <h1>{listing.title}</h1>
          <h1>
            <Tag color={listing.isApproved ? "green" : "red"}>
              {listing.isApproved ? "Active" : "Pending"}
            </Tag>
          </h1>        </div>
        <div className={styles["photos"]}>
          {listing.listingPhotoPaths?.map((item, index) => (
            <img
              key={index}
              src={item}
              alt="listing photo"
              onClick={() => handleImageClick(item)}
            />
          ))}
        </div>

        {selectedImage && (
          <div className={styles["enlarged-image"]} onClick={closeImage}>
            <img src={selectedImage} alt="Enlarged" />
          </div>
        )}

        <h2>
          {listing.type} in {listing.city}, {listing.province},{" "}
          {listing.country}
        </h2>
        <p>
          {listing.guestCount} guests - {listing.bedroomCount} bedroom(s) -{" "}
          {listing.bedCount} bed(s) - {listing.bathroomCount} bathroom(s)
        </p>
        <hr />

        <div className={styles["profile"]}>
          <img src={listing.creator?.profileImagePath} />
          <h3>
            Hosted by {listing.creator?.firstName} {listing.creator?.lastName}
          </h3>
        </div>
        <hr />

        <h3>Description</h3>
        <p>{listing.description}</p>
        <hr />

        <h3>{listing.highlight}</h3>
        <p>{listing.highlightDesc}</p>
        <hr />
        <div className={styles["booking"]}>
          <div>
            <h2>What this place offers?</h2>
            <div className={styles["amenities"]}>
              {listing.amenities[0].split(",").map((item, index) => (
                <div className={styles["facility"]} key={index}>
                  <div className={styles["facility_icon"]}>
                    {
                      facilities.find((facility) => facility.name === item)
                        ?.icon
                    }
                  </div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2>How long do you want to stay?</h2>
            <div className={styles["date-range-calendar"]}>
              <DateRange ranges={dateRange} onChange={handleSelect} />
              {dayCount > 1 ? (
                <h2>
                  ${listing.price} x {dayCount} nights
                </h2>
              ) : (
                <h2>
                  ${listing.price} x {dayCount} night
                </h2>
              )}

              <h2>Total price: ${listing.price * dayCount}</h2>
              <p>Start Date: {dateRange[0].startDate.toDateString()}</p>
              <p>End Date: {dateRange[0].endDate.toDateString()}</p>

              <button
                className={styles["button"]}
                type="submit"
                onClick={handleSubmit}
              >
                BOOKING
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingDetails;
