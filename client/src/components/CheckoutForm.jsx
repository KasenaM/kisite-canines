import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import countryList from "react-select-country-list";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Layout from "./Layout";
import { Helmet } from 'react-helmet-async';

function CheckoutForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();

  const selectedDog = location.state?.selectedDog || null;
  const dogsToDisplay = selectedDog ? [selectedDog] : cart;
  const backTarget = selectedDog ? "/our-listings" : "/cart";

  const [form, setForm] = useState(() => {
    const stored = localStorage.getItem("checkoutForm");
    return stored
      ? JSON.parse(stored)
      : {
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
          address: "",
          country: { label: "Kenya", value: "KE" },
        };
  });

  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const total = dogsToDisplay.reduce((sum, d) => sum + d.price, 0);

  useEffect(() => {
    localStorage.setItem("checkoutForm", JSON.stringify(form));
  }, [form]);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCountryChange = (val) => setForm({ ...form, country: val });
  const handlePhoneChange = (val) => setForm({ ...form, phone: val });

  const validateForm = () => {
    const newErrors = {};
    if (!/^[A-Za-z]+$/.test(form.firstname)) newErrors.firstname = "Enter valid first name";
    if (!/^[A-Za-z]+$/.test(form.lastname)) newErrors.lastname = "Enter valid last name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Enter valid email";
    if (!form.phone || form.phone.length < 7) newErrors.phone = "Enter valid phone";
    if (!form.address.trim()) newErrors.address = "Enter address";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      setShowSummary(true);
    }
  };

  const confirmCancel = () => setShowConfirm(true);

  const cancelForm = () => {
    localStorage.removeItem("checkoutForm");
    navigate(backTarget);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("🚫 Payment not implemented yet.");
    }, 1500);
  };

  return (
    <Layout>
      <Helmet>
        <title>Checkout - Kisite Canines</title>
        <meta name="description" content="Complete your booking at Kisite Canines." />
      </Helmet>

      <div className="bg-[#EAEAE8] min-h-screen py-12 px-6 md:px-16 relative">
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-xl text-center">
              <p className="mb-4">Are you sure you want to cancel this form?</p>
              <div className="flex justify-center gap-4">
                <button onClick={cancelForm} className="bg-gray-300 text-[#303A40] px-4 py-2 rounded hover:bg-gray-400">
                  Yes, Cancel
                </button>
                <button onClick={() => setShowConfirm(false)} className="bg-[#D7CD43] text-[#303A40] px-6 py-2 rounded hover:bg-[#C5BC39]">
                  No, Go Back
                </button>
              </div>
            </div>
          </div>
        )}

        {!showSummary ? (
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8 mt-8">
            {/* 🐶 Dog Info */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-[#303A40]">Selected Dog(s)</h3>
              <div className="space-y-4">
                {dogsToDisplay.map((dog) => (
                  <div key={dog.id} className="flex gap-4 bg-gray-100 p-4 rounded shadow-sm">
                    <img src={dog.imageUrl} alt={dog.breed} className="w-24 h-24 object-cover rounded" />
                    <div className="text-[#4F6866] text-sm">
                      <p><strong className="text-[#303A40]">Breed:</strong> {dog.breed}</p>
                      <p><strong className="text-[#303A40]">Age:</strong> {dog.age}</p>
                      <p><strong className="text-[#303A40]">Gender:</strong> {dog.gender}</p>
                      <p><strong className="text-[#303A40]">Price:</strong> KES {dog.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <h4 className="mt-6 text-xl font-semibold text-[#D7CD43]">Total: KES {total.toLocaleString()}</h4>
            </div>

            {/* 📝 Buyer Form */}
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <h2 className="text-2xl font-bold text-[#303A40] mb-4">Enter Your Details</h2>

              {/* Name Fields */}
              <div className="flex gap-4">
                {["firstname", "lastname"].map((field) => (
                  <div key={field} className="w-1/2">
                    <input
                      type="text"
                      name={field}
                      autoComplete={field === "firstname" ? "given-name" : "family-name"}
                      aria-label={field === "firstname" ? "First Name" : "Last Name"}
                      placeholder={field === "firstname" ? "First Name" : "Last Name"}
                      value={form[field]}
                      onChange={handleInput}
                      className={`w-full p-2 rounded border focus:outline-none focus:border-[#D7CD43] ${
                        errors[field] ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors[field] && <p className="text-sm text-red-500 mt-1">{errors[field]}</p>}
                  </div>
                ))}
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  aria-label="Email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleInput}
                  className={`w-full p-2 rounded border focus:outline-none focus:border-[#D7CD43] ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <PhoneInput
                  country={"ke"}
                  value={form.phone}
                  onChange={handlePhoneChange}
                  inputProps={{
                    name: "phone",
                    required: true,
                    autoComplete: "tel",
                    "aria-label": "Phone Number",
                  }}
                  inputStyle={{
                    width: "100%",
                    borderRadius: "6px",
                    borderColor: errors.phone ? "red" : "#ccc",
                  }}
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>

              {/* Address + Country */}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <input
                    name="address"
                    type="text"
                    autoComplete="street-address"
                    placeholder="Address"
                    aria-label="Address"
                    value={form.address}
                    onChange={handleInput}
                    className={`w-full p-2 rounded border focus:outline-none focus:border-[#D7CD43] ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
                </div>
                <div className="w-1/2">
                  <Select
                    options={countryList().getData()}
                    value={form.country}
                    onChange={handleCountryChange}
                    placeholder="Country"
                    aria-label="Country"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={confirmCancel}
                  className="bg-gray-300 text-[#303A40] px-6 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="bg-[#D7CD43] text-[#303A40] px-6 py-2 rounded hover:bg-[#C5BC39]"
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8 grid md:grid-cols-2 gap-10 mt-8">
            {/* Summary */}
            <div>
              <h3 className="text-2xl font-bold text-[#303A40] mb-4">Booking Summary</h3>
              <div className="space-y-4 mb-6">
                {dogsToDisplay.map((dog) => (
                  <div key={dog.id} className="flex items-center gap-4 bg-gray-100 p-4 rounded shadow-sm">
                    <img src={dog.imageUrl} alt={dog.breed} className="w-20 h-20 object-cover rounded" />
                    <p className="text-[#4F6866]">
                      {dog.breed} - {dog.age} - KES {dog.price.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="bg-gray-100 p-4 rounded space-y-1 text-sm text-[#4F6866]">
                <p><strong className="text-[#303A40]">Name:</strong> {form.firstname} {form.lastname}</p>
                <p><strong className="text-[#303A40]">Email:</strong> {form.email}</p>
                <p><strong className="text-[#303A40]">Phone:</strong> {form.phone}</p>
                <p><strong className="text-[#303A40]">Address:</strong> {form.address}, {form.country.label}</p>
              </div>
            </div>

            {/* Payment */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-[#303A40]">Select Payment Option</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { name: "M-Pesa", icon: "/icons/m-pesa.png" },
                  { name: "Visa", icon: "/icons/visa.png" },
                  { name: "MasterCard", icon: "/icons/mastercard.png" },
                  { name: "PayPal", icon: "/icons/paypal.png" },
                ].map((opt) => (
                  <label
                    key={opt.name}
                    className={`border rounded-lg p-2 flex items-center justify-center shadow-sm hover:shadow-md cursor-pointer ${
                      paymentMethod === opt.name ? "border-[#D7CD43]" : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.name}
                      checked={paymentMethod === opt.name}
                      onChange={() => setPaymentMethod(opt.name)}
                      className="hidden"
                    />
                    <img src={opt.icon} alt={opt.name} className="h-10" />
                  </label>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  className="bg-gray-300 text-[#303A40] px-6 py-2 rounded hover:bg-gray-400"
                  onClick={() => setShowSummary(false)}
                >
                  Back
                </button>
                <button
                  disabled={!paymentMethod || isSubmitting}
                  onClick={handleSubmit}
                  className={`${
                    !paymentMethod ? "bg-gray-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                  } text-white px-6 py-2 rounded flex items-center gap-2`}
                >
                  {isSubmitting && <span className="animate-spin rounded-full w-4 h-4 border-t-2 border-white"></span>}
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default CheckoutForm;
