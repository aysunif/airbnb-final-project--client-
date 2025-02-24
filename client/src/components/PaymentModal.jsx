import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import styles from "../assets/styles/paymentModal.module.scss";
import { message } from "antd";

const PaymentModal = ({ totalPrice, onClose, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) return; // Stripe və Elements hazır olmalıdır

    setLoading(true);

    try {
      // Backend-dən payment intent almaq
      const { data } = await axios.post("https://airbnb-final-project-server.onrender.com/api/stripe/create-payment-intent", { totalPrice });

      // Stripe ilə ödəniş
      const { clientSecret } = data;
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        console.error(error.message);
        // message.error(`Payment failed: ${error.message}`);
        setLoading(false);
      } else {
        if (paymentIntent.status === "succeeded") {
          console.log("Payment succeeded!");
          message.success("Payment successful!");
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Error processing payment", error);
      message.error("An error occurred while processing your payment. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className={styles["payment-modal-overlay"]}>
      <div className={styles["payment-modal"]}>
        <button className={styles["payment-modal-close"]} onClick={onClose}>×</button>
        <h2>Complete Your Payment</h2>
        <CardElement className={styles["card-element"]}/>
        <p className={styles["total-price"]}>Total: ${totalPrice}</p>
        <button className={styles["pay-button"]} onClick={handlePayment} disabled={loading}>
         {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
