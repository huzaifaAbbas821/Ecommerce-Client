import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Container from "./Components/Container";
import Navbar from "./Components/Navbar";
import EnterProd from "./Components/EnterProd";
import Product from "./Components/Product";
import Footer from "./Components/Footer";
import Cart from "./Components/Cart";
import SavedProd from "./Components/SavedProd";
import WatchHistory from "./Components/WatchHistory";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Profile from "./Components/Profile.jsx";
import BuyProducts from "./Components/BuyProducts.jsx"
import { useState } from "react";
import Rating from "./Components/Rating.jsx";

const stripePromise = loadStripe( "pk_test_51NYU27DHq3QzD7GbaWIc7E7RSzoa3QCStBesHyU2IykhMKgBHjR9UK7XTMJcshAKC7bDEtVTuxR6V8ENTC6ERaek00XAIUJvIv" );

function App() {
  const [query, setQuery] = useState("");

  return (
    <Elements stripe={stripePromise}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/rating" element={<Rating />} />

        <Route
          path="/products"
          element={
            <>
              <Navbar setQuery={setQuery}  />
              <EnterProd />
              <Footer />
            </>
          }
        />
        
        <Route
          path="/buy-products"
          element={
            <>
              <Navbar setQuery={setQuery}  />
              <BuyProducts/>
              <Footer />
            </>
          }
        />

        <Route
          path="/"
          element={
            <>
              <Navbar setQuery={setQuery} />
              <Container query={query} />
              <Footer />
            </>
          }
        />

        <Route
          path="/profile"
          element={
            <>
              <Navbar />
              <Profile />
              <Footer />
            </>
          }
        />
        <Route
          path="/product/:id"
          element={
            <>
              <Navbar />
              <Product />
              <Footer />
            </>
          }
        />
        <Route
          path="/save-products"
          element={
            <>
              <Navbar />
              <SavedProd />
              <Footer />
            </>
          }
        />
        <Route
          path="/watch-products"
          element={
            <>
              <Navbar />
              <WatchHistory />
              <Footer />
            </>
          }
        />
      </Routes>
    </Elements>
  );
}

export default App;
