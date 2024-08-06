import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { reduceItem, increaseQuantity } from "../redux/reducer.js";
import { FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
  ElementsConsumer,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51NYU27DHq3QzD7GbaWIc7E7RSzoa3QCStBesHyU2IykhMKgBHjR9UK7XTMJcshAKC7bDEtVTuxR6V8ENTC6ERaek00XAIUJvIv"
);

const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

function Cart() {
  const dispatch = useDispatch();
  const [carts, setCarts] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const tax = Math.round(subtotal * 0.18);
  const shipCharges = subtotal > 0 ? 10 : 0;
  const total = subtotal + tax + shipCharges;
  const discount = total > 1000 ? 100 : 0;
  const newTotal = total - discount;

  // stripe

  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [nameOnCard, setNameOnCard] = useState("");
  const [coupon, setCoupon] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false); // New state to handle success

  useEffect(() => {
    const storedCarts = JSON.parse(localStorage.getItem("carts")) || [];
    // Ensure each item has a quantity of at least 1
    const updatedCarts = storedCarts.map((cart) => ({
      ...cart,
      quantity: cart.quantity || 1,
    }));
    setCarts(updatedCarts);
  }, []);

  useEffect(() => {
    let newSubtotal = 0;
    carts.forEach((cart) => {
      const itemSubtotal = cart.price * cart.quantity; // Use cart's quantity directly
      newSubtotal += itemSubtotal;
    });
    setSubtotal(newSubtotal);
  }, [carts]);

  const handleDecrease = (id) => {
    const updatedCarts = carts.map((cart) => {
      if (cart.id === id) {
        const newQuantity = Math.max(cart.quantity - 1, 1); // Ensure quantity doesn't go below 1
        return { ...cart, quantity: newQuantity };
      }
      return cart;
    });
    setCarts(updatedCarts);
    localStorage.setItem("carts", JSON.stringify(updatedCarts));
    dispatch(
      increaseQuantity({
        id,
        quantity: updatedCarts.find((cart) => cart.id === id).quantity,
      })
    );
  };

  const handleIncrease = (id) => {
    const updatedCarts = carts.map((cart) => {
      if (cart.id === id) {
        const newQuantity = (cart.quantity || 1) + 1; // Default to 1 if cart.quantity is undefined
        return { ...cart, quantity: newQuantity };
      }
      return cart;
    });
    setCarts(updatedCarts);
    localStorage.setItem("carts", JSON.stringify(updatedCarts));
    dispatch(
      increaseQuantity({
        id,
        quantity: updatedCarts.find((cart) => cart.id === id).quantity,
      })
    );
  };

  const handleRemove = (id) => {
    const updatedCarts = carts.filter((cart) => cart.id !== id);
    setCarts(updatedCarts);
    localStorage.setItem("carts", JSON.stringify(updatedCarts));
    dispatch(reduceItem(id));
  };

  const setBuy = async () => {
    const token = localStorage.getItem("accessToken");
    const buyIds = carts.map((cart) => cart.id);
    
    try {
      const response = await fetch("https://ecommerce-backend-l7uf.vercel.app/api/users/buy-history-add", 
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(buyIds),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
      throw "Problem in sending buying IDs";
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentProcessing(true);

    const cardElement = elements.getElement(CardNumberElement);

    if (!cardElement) {
      setError("Please complete the form");
      setPaymentProcessing(false);
      return;
    }

    try {
      // Fetch the client secret from your backend
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw "Error you are not authorized or your token is expired";
      }
      const response = await fetch(
        "https://ecommerce-backend-l7uf.vercel.app/payment/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: newTotal,
          }), // Specify the payment amount in the smallest currency unit
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch client secret");
      }

      const { clientSecret } = await response.json();

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: nameOnCard,
            },
          },
        }
      );

      if (error) {
        setError(error.message);
        setPaymentProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded"){
        setBuy();
        console.log("payment Successfull");
      navigate('/');
      localStorage.setItem("carts", JSON.stringify([]));

      }

    } catch (err) {
      setError("Payment failed. Please try again.");
    }

    setPaymentProcessing(false);
  };

  

  return (
    
      <div className="font-sans max-w-6xl max-lg:max-w-2xl mx-auto bg-white p-4">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-gray-100 p-6 rounded-md md:min-h-[70vh]">
              <h2 className="text-2xl font-extrabold text-gray-800">
                Your Cart
              </h2>
              {/* Carts */}
              <div className="space-y-4 mt-8">
                {carts.length === 0 || isEmptyObject(carts) ? (
                  <div className="text-3xl text-normal text-center mt-10">
                    The cart is empty
                  </div>
                ) : (
                  carts.map((cart) => (
                    <>
                      <div key={cart.id} className="flex items-center gap-4">
                        <div className="w-24 h-24 shrink-0 bg-white  rounded-md">
                          <img
                            src={cart.activeimg}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="w-full">
                          <h3 className="text-base font-semibold text-gray-800">
                            {cart.title}
                          </h3>
                          <h6 className="text-sm text-gray-800 font-bold cursor-pointer mt-0.5">
                            {cart.price}
                          </h6>

                          <div className="flex gap-4 mt-4">
                            <div>
                              <button
                                type="button"
                                className="flex items-center px-2.5 py-1.5 border border-gray-300 text-gray-800 text-xs outline-none bg-transparent rounded-md"
                              >
                                <svg
                                  onClick={() => handleDecrease(cart.id)}
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-2.5 fill-current"
                                  viewBox="0 0 124 124"
                                >
                                  <path
                                    d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
                                    data-original="#000000"
                                  ></path>
                                </svg>

                                <span className="mx-2.5">{cart.quantity}</span>
                                <svg
                                  onClick={() => handleIncrease(cart.id)}
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-2.5 fill-current"
                                  viewBox="0 0 42 42"
                                >
                                  <path
                                    d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                                    data-original="#000000"
                                  ></path>
                                </svg>
                              </button>
                            </div>

                            <div className="ml-auto">
                              <svg
                                onClick={() => handleRemove(cart.id)}
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 fill-red-500 inline cursor-pointer"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                                  data-original="#000000"
                                ></path>
                                <path
                                  d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                                  data-original="#000000"
                                ></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr className="border-gray-300" />{" "}
                    </>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <img
                src="https://readymadeui.com/images/master.webp"
                alt="card1"
                className="w-12 object-contain"
              />
              <img
                src="https://readymadeui.com/images/visa.webp"
                alt="card2"
                className="w-12 object-contain"
              />
              <img
                src="https://readymadeui.com/images/american-express.webp"
                alt="card3"
                className="w-12 object-contain"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-extrabold text-gray-800">
              Payment Details
            </h2>
            <div className="grid gap-4 mt-8">
              <div>
                <label
                  htmlFor="nameOnCard"
                  className="block text-base font-semibold text-gray-800 mb-2"
                >
                  Card Holder Name
                </label>
                <input
                  id="nameOnCard"
                  type="text"
                  placeholder="Name on Card"
                  required
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value)}
                  className="px-4 py-3 bg-transparent text-gray-800 w-full text-sm border border-gray-300 rounded-md focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-800 mb-2">
                  Card Number
                </label>
                <div className="flex bg-transparent border border-gray-300 rounded-md focus-within:border-purple-500 overflow-hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 ml-3"
                    viewBox="0 0 32 20"
                  >
                    <circle
                      cx="10"
                      cy="10"
                      r="10"
                      fill="#f93232"
                      data-original="#f93232"
                    />
                    <path
                      fill="#fed049"
                      d="M22 0c-2.246 0-4.312.75-5.98 2H16v.014c-.396.298-.76.634-1.107.986h2.214c.308.313.592.648.855 1H14.03a9.932 9.932 0 0 0-.667 1h5.264c.188.324.365.654.518 1h-6.291a9.833 9.833 0 0 0-.377 1h7.044c.104.326.186.661.258 1h-7.563c-.067.328-.123.66-.157 1h7.881c.039.328.06.661.06 1h-8c0 .339.027.67.06 1h7.882c-.038.339-.093.672-.162 1h-7.563c.069.341.158.673.261 1h7.044a9.833 9.833 0 0 1-.377 1h-6.291c.151.344.321.678.509 1h5.264a9.783 9.783 0 0 1-.669 1H14.03c.266.352.553.687.862 1h2.215a10.05 10.05 0 0 1-1.107.986A9.937 9.937 0 0 0 22 20c5.523 0 10-4.478 10-10S27.523 0 22 0z"
                      className="hovered-path"
                      data-original="#fed049"
                    />
                  </svg>
                  <CardNumberElement
                    type="number"
                    placeholder="xxxx xxxx xxxx"
                    className="px-4 py-3 bg-transparent text-gray-800 w-full text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    Expiry Date
                  </label>
                  <CardExpiryElement
                    type="number"
                    placeholder="08/27"
                    className="px-4 py-3 bg-transparent text-gray-800 w-full text-sm border border-gray-300 rounded-md focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    CVV
                  </label>
                  <CardCvcElement
                    type="number"
                    placeholder="XXX"
                    className="px-4 py-3 bg-transparent text-gray-800 w-full text-sm border border-gray-300 rounded-md focus:border-purple-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <ul className="text-gray-800 mt-8 space-y-4">
              <li className="flex flex-wrap gap-4 text-sm">
                Subtotal <span className="ml-auto font-bold">${subtotal}</span>
              </li>
              <li className="flex flex-wrap gap-4 text-sm">
                Shipment Charges{" "}
                <span className="ml-auto font-bold">${shipCharges}</span>
              </li>
              <li className="flex flex-wrap gap-4 text-sm">
                Discount <span className="ml-auto font-bold">${discount}</span>
              </li>
              <li className="flex flex-wrap gap-4 text-sm">
                Tax <span className="ml-auto font-bold">${tax}</span>
              </li>
              <hr className="border-gray-300" />
              <li className="flex flex-wrap gap-4 text-sm font-bold">
                Total <span className="ml-auto">${newTotal}</span>
              </li>
            </ul>

            <button
              type="submit"
              className="mt-8 text-sm px-4 py-3 w-full font-semibold tracking-wide bg-purple-600 hover:bg-purple-700 text-white rounded-md"
            >
              Make Payment{" "}
            </button>
          </form>
        </div>
      </div>
  );
}

export default Cart;

{
  /* <div className="h-screen w-full flex flex-row justify-between items-stretch gap-12 bg-gray-600 text-gray-100">
  <main className="w-[70%] overflow-y-auto">
    <h1 className="text-7xl font-medium items-end text-center m-auto">Cart</h1>
    {carts.length === 0 || isEmptyObject(carts) ? (
      <div className="text-3xl text-normal text-center mt-10">
        The cart is empty
      </div>
    ) : (
      carts.map((cart) => (
        <div
          key={cart.id}
          className="p-4 flex flex-row justify-start items-center gap-8"
        >
          <img
            src={cart.activeimg}
            alt="item"
            className="w-40 h-40 object-contain rounded-md"
          />
          <article className="flex flex-col justify-center items-start gap-1">
            <span className="text-2xl font-semibold">{cart.title}</span>
            <span className="text-xl font-medium">${cart.price}</span>
          </article>
          <div className="ml-auto flex justify-center items-center gap-3">
            <button
              className="border-none px-2 font-bold text-2xl rounded-md hover:bg-white hover:text-black"
              onClick={() => handleDecrease(cart.id)}
            >
              -
            </button>
            <p className="text-2xl font-bold">{cart.quantity || 1}</p>
            <button
              className="border-none px-2 font-bold text-2xl text-white rounded-md hover:bg-white hover:text-black"
              onClick={() => handleIncrease(cart.id)}
            >
              +
            </button>
          </div>
          <button
            className="border-none bg-transparent flex cursor-pointer text-[1.2rem] hover:text-red-700"
            onClick={() => handleRemove(cart.id)}
          >
            <FaTrash />
          </button>
        </div>
      ))
    )}
  </main>
  <aside className="w-[30%] p-12 border-transparent border-l-2 border-l-white flex flex-col justify-center items-start gap-6">
    <p className="text-[1.1rem]">SubTotal: ${subtotal}</p>
    <p className="text-[1.1rem]">Shipping Charges: ${shipCharges}</p>
    <p className="text-[1.1rem]">Tax: ${tax}</p>
    <p className="text-[1.1rem] text-red-400">
      Discount: <em> - ${discount}</em>
    </p>
    <p className="text-[1.1rem]">
      <b>Total: ${total - discount}</b>
    </p>
    <Link to="/">
      <button className="bg-green-700 p-4 rounded-md hover:opacity-80">
        CheckOut
      </button>
    </Link>
  </aside>
</div>; */
}
