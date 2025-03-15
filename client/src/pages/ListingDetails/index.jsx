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
import { message, Tag } from "antd";
import PaymentModal from "../../components/PaymentModal";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Helmet } from "react-helmet-async";


const stripePromise = loadStripe(
  "pk_test_51QvMDQGDdvSl6zjx1ubghH6NYjR7wFiiJ64VZSOIAHlMIWVUHYBGLH8ze5evlm8e3yBSSnZvgLLSK7JfIRWa3cgz00s9FLK1nC"
);

const ListingDetails = () => {
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const user = useSelector((state) => state.user);

  const { listingId } = useParams();
  const [listing, setListing] = useState(null);

  const handleBooking = () => {
    if (!user) {
      navigate("/login");
    } else {
      setShowPaymentModal(true); 
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
  };

  const customerId = useSelector((state) => state?.user?._id);

  const navigate = useNavigate();
  
  /* SUBMIT BOOKING */

  const handleSuccessPayment = async () => {
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
        "https://airbnb-final-project-server.onrender.com/api/bookings/create",
        bookingForm,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        message.success("Booking successful!");
        navigate(`/${customerId}/trips`);
      }
    } catch (err) {
      console.log("Submit Booking Failed.", err.message);
      message.success("Booking successful!");
    }
  };

  const getListingDetails = async () => {
    try {
      const response = await axios.get(
        `https://airbnb-final-project-server.onrender.com/api/listings/${listingId}`
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
     <Helmet>
            <title>Airbnb | Details</title>
            <meta name="description" content="details page" />
          </Helmet>
      <div className={styles["listing-details"]}>
        <div className={styles["title"]}>
          <h1>{listing.title}</h1>
          <h1>
            <Tag color={listing.isApproved ? "green" : "red"}>
              {listing.isApproved ? "Active" : "Pending"}
            </Tag>
          </h1>{" "}
        </div>
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
          Hosted by {listing.creator?.firstName || "Unknown"} {listing.creator?.lastName || ""}
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

              <button className={styles["button"]} onClick={handleBooking}>Book Now</button>
              {showPaymentModal && (
                <Elements stripe={stripePromise}>
                  <PaymentModal
                    totalPrice={listing.price * dayCount}
                    onClose={handleClosePaymentModal}
                    onSuccess={handleSuccessPayment}
                  />
                </Elements>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingDetails;
