import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import Select from "react-select";
import countryList from "react-select-country-list";
import { useNavigate } from "react-router-dom";
import "react-phone-input-2/lib/style.css";
import servicePackages from "../data/servicePackages";
import { Helmet } from 'react-helmet-async';

function ServiceForm({ onClose }) {
  const navigate = useNavigate();
  const countries = countryList().getData();

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("serviceForm");
    return saved ? JSON.parse(saved) : {
      firstName: "",
      secondName: "",
      email: "",
      phone: "",
      country: { label: "Kenya", value: "KE" },
      address: "",
      locationType: "",
      service: "",
      packageName: "",
      numberOfDogs: 1,
      paymentMethod: "",
    };
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const packages = servicePackages[formData.service] || [];
  const selectedPackage = packages.find((p) => p.name === formData.packageName);

  const getNumericPrice = (price) => {
    if (typeof price === "number") return price;
    const match = price?.match(/KES\s?([\d,]+)/i);
    return match ? parseInt(match[1].replace(/,/g, "")) : 0;
  };

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("serviceForm", JSON.stringify(formData));
  }, [formData]);

  const validate = () => {
    const errs = {};
    if (!/^[A-Za-z]+$/.test(formData.firstName)) errs.firstName = "First name must only contain letters";
    if (!/^[A-Za-z]+$/.test(formData.secondName)) errs.secondName = "Second name must only contain letters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Invalid email";
    if (!formData.phone) errs.phone = "Phone is required";
    if (!formData.address.trim()) errs.address = "Address is required";
    if (!formData.service) errs.service = "Select a service";
    if (!formData.packageName) errs.packageName = "Select a package";
    if (formData.service === "Grooming" && !formData.locationType) errs.locationType = "Select location";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      setTimeout(() => {
        setSubmitted(true);
        setLoading(false);
      }, 1500);
    }
  };

  const handleCancel = () => {
    if (onClose) {
      setConfirmCancel(true);
    } else {
      navigate(-1);
    }
  };

  const handleConfirmCancel = () => {
    localStorage.removeItem("serviceForm");
    if (onClose) onClose();
    else navigate(-1);
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const iconOptions = [
    { name: "M-Pesa", icon: "/icons/m-pesa.png" },
    { name: "Visa", icon: "/icons/visa.png" },
    { name: "MasterCard", icon: "/icons/mastercard.png" },
    { name: "PayPal", icon: "/icons/paypal.png" },
  ];

  return (



    <div className="bg-white p-4 sm:p-6 md:p-10 rounded-lg shadow-lg max-w-4xl mx-auto w-full mt-16">
<Helmet>
      <title>Service Booking - Kisite Canines</title>
      <meta name="description" content="Book our dog services at Kisite Canines." />
    </Helmet>

      <h2 className="text-2xl font-bold text-center text-[#303A40] mb-6">Book Any Of Our Services</h2>

      {confirmCancel && (
        <div className="bg-black/60 fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to cancel?</h3>
            <div className="flex justify-end gap-4">
              <button onClick={() => setConfirmCancel(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
                No
              </button>
              <button onClick={handleConfirmCancel} className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600">
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {!submitted ? (
        <form onSubmit={handleSubmit} autoComplete="on" className="grid grid-cols-1 sm:grid-cols-2 gap-6" >
          {[
            { label: "First Name", field: "firstName" },
            { label: "Second Name", field: "secondName" },
            { label: "Email", field: "email", type: "email" },
            { label: "Address", field: "address", span: true },
          ].map(({ label, field, type = "text", span }) => (
            <div key={field} className={span ? "sm:col-span-2" : ""}>
              <label className="block mb-1 text-sm font-medium" htmlFor={field}>{label}</label>
              <input
                id={field}
                name={field}
                type={type}
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                className={`w-full px-3 py-2 rounded border ${errors[field] ? "border-red-500" : "border-[#4F6866]"} focus:outline-none focus:border-[#D7CD43]`}
              />
              {errors[field] && <p className="text-sm text-red-600">{errors[field]}</p>}
            </div>
          ))}

          <div>
            <label className="block mb-1 text-sm font-medium">Phone</label>
            <PhoneInput
              country={"ke"}
              value={formData.phone}
              onChange={(value) => handleChange("phone", value)}
              inputStyle={{
                width: "100%",
                borderRadius: "6px",
                borderColor: errors.phone ? "red" : "#4F6866",
              }}
              inputProps={{
                name: "phone",
                required: true,
                autoFocus: false,
              }}
            />
            {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block mb-1 text-sm font-medium">Country</label>
            <Select
              inputId="country"
              options={countries}
              value={formData.country}
              onChange={(value) => handleChange("country", value)}
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#4F6866",
                  "&:hover": { borderColor: "#D7CD43" },
                  boxShadow: "none",
                }),
              }}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Service</label>
            <select
              value={formData.service}
              onChange={(e) => handleChange("service", e.target.value)}
              className={`w-full px-3 py-2 rounded border ${errors.service ? "border-red-500" : "border-[#4F6866]"} focus:outline-none focus:border-[#D7CD43]`}
            >
              <option value="">-- Select Service --</option>
              {Object.keys(servicePackages).map((svc) => (
                <option key={svc} value={svc}>{svc}</option>
              ))}
            </select>
            {errors.service && <p className="text-sm text-red-600">{errors.service}</p>}
          </div>

          {formData.service && (
            <div>
              <label className="block mb-1 text-sm font-medium">Package</label>
              <select
                value={formData.packageName}
                onChange={(e) => handleChange("packageName", e.target.value)}
                className={`w-full px-3 py-2 rounded border ${errors.packageName ? "border-red-500" : "border-[#4F6866]"} focus:outline-none focus:border-[#D7CD43]`}
              >
                <option value="">-- Select Package --</option>
                {packages.map((pkg) => (
                  <option key={pkg.name} value={pkg.name}>{pkg.name}</option>
                ))}
              </select>
              {errors.packageName && <p className="text-sm text-red-600">{errors.packageName}</p>}
            </div>
          )}

          {formData.service === "Grooming" && (
            <div className="sm:col-span-2">
              <label className="block mb-1 text-sm font-medium">Where should the service be done?</label>
              <select
                value={formData.locationType}
                onChange={(e) => handleChange("locationType", e.target.value)}
                className={`w-full px-3 py-2 rounded border ${errors.locationType ? "border-red-500" : "border-[#4F6866]"} focus:outline-none focus:border-[#D7CD43]`}
              >
                <option value="">-- Select Location --</option>
                <option value="Kennel Premises">At Kennel Premises</option>
                <option value="Customer Location">At Customer's Home</option>
              </select>
              {errors.locationType && <p className="text-sm text-red-600">{errors.locationType}</p>}
            </div>
          )}

          <div className="sm:col-span-2">
            <label className="block mb-1 text-sm font-medium">Number of Dogs</label>
            <input
              type="number"
              min="1"
              value={formData.numberOfDogs}
              onChange={(e) => handleChange("numberOfDogs", Number(e.target.value))}
              className="w-full px-3 py-2 rounded border border-[#4F6866] focus:border-[#D7CD43]"
            />
          </div>

          <div className="sm:col-span-2 flex justify-between mt-6 gap-4">
            <button type="button" onClick={handleCancel} className="bg-gray-300 px-6 py-3 rounded hover:bg-gray-400 transition w-full sm:w-auto">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="bg-[#D7CD43] text-white px-6 py-3 rounded hover:bg-[#C5BC39] transition w-full sm:w-auto">
              {loading ? "Processing..." : "Book Service"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-6 text-sm sm:text-base">
          <h3 className="text-xl font-semibold mb-2 text-[#303A40]">Booking Summary</h3>
          <p><strong>Name:</strong> {formData.firstName} {formData.secondName}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Phone:</strong> {formData.phone}</p>
          <p><strong>Country:</strong> {formData.country?.label}</p>
          <p><strong>Address:</strong> {formData.address}</p>
          <p><strong>Service:</strong> {formData.service}</p>
          <p><strong>Package:</strong> {formData.packageName}</p>
          {formData.locationType && <p><strong>Location:</strong> {formData.locationType}</p>}
          <p><strong>Dogs:</strong> {formData.numberOfDogs}</p>
          <p><strong>Total Price:</strong> KES {getNumericPrice(selectedPackage?.price) * formData.numberOfDogs}</p>

          <h4 className="font-semibold mt-6 mb-2">Select Payment Option</h4>
          <div className="flex gap-4 flex-wrap">
            {iconOptions.map(({ name, icon }) => (
              <label
                key={name}
                className={`p-2 border rounded flex items-center gap-2 cursor-pointer ${formData.paymentMethod === name ? "border-[#D7CD43]" : "border-gray-300"}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={name}
                  checked={formData.paymentMethod === name}
                  onChange={() => handleChange("paymentMethod", name)}
                  className="hidden"
                />
                <img src={icon} alt={name} className="w-8 h-8" />
              </label>
            ))}
          </div>

          <div className="flex justify-between gap-4 mt-6">
            <button onClick={() => setSubmitted(false)} className="bg-gray-300 px-6 py-3 rounded hover:bg-gray-400 transition">
              Go Back
            </button>
            <button disabled className="px-6 py-3 rounded bg-[#D7CD43] hover:bg-[#C5BC39] text-white cursor-not-allowed">
              Pay Now (Disabled)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceForm;
