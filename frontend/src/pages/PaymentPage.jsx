import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import "../styles/payment.css";

function PaymentForm({ cart, totalAmount, buyerName }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      if (!userId) {
        alert("Please log in before making a payment.");
        navigate("/login");
        return;
      }

      setLoading(true);

      // If cash is selected
      if (paymentMethod === "cash") {
        const orderRes = await axios.post("http://localhost:5000/api/orders", {
          items: cart,
          totalAmount,
          buyerName: username || buyerName,
        });

        await axios.post("http://localhost:5000/api/payments/record", {
          order: orderRes.data._id,
          buyerId: userId,
          amount: totalAmount,
          method: "cod",
          transactionId: "COD" + Date.now(),
          status: "pending",
        });
        setMessage("💵 Payment on arrival selected. Your order has been placed!");
        setTimeout(() => navigate("/"), 2500);
        return;
      }

      // Stripe card payment
      setLoading(true);
      const intentRes = await axios.post("http://localhost:5000/api/payments/create-intent", {
        amount: totalAmount,
      });

      const clientSecret = intentRes.data.clientSecret;
      if (!clientSecret) throw new Error("Failed to create payment intent");

      const cardElement = elements.getElement(CardNumberElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: username || buyerName || "Customer" },
        },
      });

      if (paymentResult.error) {
        console.error("Stripe payment error:", paymentResult.error.message);
        setMessage("❌ Payment failed. Please check your card details and try again.");
        setLoading(false);
        return;
      }

      if (paymentResult.paymentIntent.status === "succeeded") {
        const orderRes = await axios.post("http://localhost:5000/api/orders", {
          items: cart,
          totalAmount,
          buyerName: username || buyerName,
        });

        await axios.post("http://localhost:5000/api/payments/record", {
          order: orderRes.data._id,
          buyerId: userId,
          amount: totalAmount,
          method: "card",
          transactionId: paymentResult.paymentIntent.id,
          status: "success",
        });

        setMessage("✅ Payment successful! Your order has been placed.");
        setTimeout(() => navigate("/"), 2500);
      }
    } catch (err) {
      console.error("Payment error:", err);
      const buyerErrorMessage = err.response?.data?.message || "We could not process your payment at the moment. Please check your card details or try again later.";
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-methods">
      <h2>💳 Payment Method</h2>

      <div className="payment-option">
        <label>
          <input
            type="radio"
            value="card"
            checked={paymentMethod === "card"}
            onChange={() => setPaymentMethod("card")}
          />
          Credit / Debit Card
        </label>
      </div>

      {paymentMethod === "card" && (
  <div className="card-inputs">
    <div className="card-field">
    <label>Card Number</label>
    <CardNumberElement
      options={{
        style: {
          base: {
            fontSize: "16px",
            color: "#333",
            fontFamily: "Poppins, sans-serif",
            "::placeholder": { color: "#999" },
          },
          invalid: { color: "#e74c3c" },
        },
      }}
      className="stripe-input"
    />
    </div>

    <div className="card-row">
      <div className="card-field">
      <label>Valid Thru</label>
      <CardExpiryElement
      options={{
        style: {
          base: {
            fontSize: "16px",
            color: "#333",
            fontFamily: "Poppins, sans-serif",
            "::placeholder": { color: "#999" },
          },
          invalid: { color: "#e74c3c" },
        },
      }}
      className="stripe-input"
    />
    </div>

    <div className="card-field">
    <label>CVC</label>
    <CardCvcElement
      options={{
        style: {
          base: {
            fontSize: "16px",
            color: "#333",
            fontFamily: "Poppins, sans-serif",
            "::placeholder": { color: "#999" },
          },
          invalid: { color: "#e74c3c" },
        },
      }}
      className="stripe-input"
    />
    </div>
  </div>
  </div>
  )}


      <div className="payment-option">
        <label>
          <input
            type="radio"
            value="cash"
            checked={paymentMethod === "cash"}
            onChange={() => setPaymentMethod("cash")}
          />
          Pay on Arrival (Cash on Delivery)
        </label>
      </div>

      <button className="confirm-btn" onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : "Confirm Payment"}
      </button>

      {message && <p className="payment-message">{message}</p>}
    </div>
  );
}

function PaymentPage() {
  const [stripePromise, setStripePromise] = useState(null);
  const location = useLocation();
  const { cart, totalAmount, buyerName } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKey = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/payments/public-key");
        const stripe = await loadStripe(res.data.publishableKey);
        setStripePromise(stripe);
      } catch (err) {
        console.error("Error fetching Stripe key:", err);
      }
    };
    fetchKey();
  }, []);

  if (!cart || cart.length === 0) {
    return (
      <div className="dashboard">
        <h2>No items to pay for</h2>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="payment-page-container">
        {/* LEFT SIDE — Order Summary */}
        <div className="payment-summary">
          <h2>🛒 Order Summary</h2>
          {cart.map((item) => (
            <div key={item.id} className="payment-item">
              <img
                src={item.image || "/placeholder.jpg"}
                alt={item.name}
                className="payment-item-image"
              />
              <div className="payment-item-details">
                <p className="item-name">{item.name}</p>
                <p>Qty: {item.qty} kg</p>
                <p>Price: Rs. {item.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
          <hr />
          <h3>Total: Rs. {totalAmount.toLocaleString()}</h3>
        </div>

        {/* RIGHT SIDE — Payment Form */}
        <PaymentForm cart={cart} totalAmount={totalAmount} buyerName={buyerName} />
      </div>
    </Elements>
  );
}

export default PaymentPage;