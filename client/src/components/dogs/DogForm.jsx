import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axiosInstance from "../../axiosInstance";

const emptyDog = {
  name: "",
  breed: "",
  ageValue: "",
  ageUnit: "Years",
  gender: "",
  image: null,
};

const DogForm = ({ mode = "add", initialData = null }) => {
  const navigate = useNavigate();
  const isEdit = mode === "edit";

  const [step, setStep] = useState(0);
  const [totalDogs, setTotalDogs] = useState(isEdit ? 1 : 1);
  // If editing, initialize with initialData; if adding, use emptyDog array
  const [dogs, setDogs] = useState(isEdit && initialData ? [initialData] : [emptyDog]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRefs = useRef([]);

  // Sync data if initialData changes (relevant for Edit mode)
  useEffect(() => {
    if (isEdit && initialData) {
      setDogs([initialData]);
    }
  }, [initialData, isEdit]);

  const validateDog = (dog) => {
    const errs = {};
    if (!dog.name.trim()) errs.name = "Dog name is required";
    if (!dog.breed.trim()) errs.breed = "Breed is required";
    if (!dog.ageValue) errs.age = "Age is required";
    if (!dog.gender) errs.gender = "Gender is required";
    // In edit mode, image might be optional if you keep the old one
    if (!isEdit && !dog.image) errs.image = "Image is required";
    return errs;
  };

  const handleTotalDogsChange = (value) => {
    const count = Math.max(1, Number(value));
    setTotalDogs(count);
    setDogs(Array.from({ length: count }, () => ({ ...emptyDog })));
    setStep(0);
    setErrors({});
    fileInputRefs.current = Array(count).fill(null);
  };

  const handleChange = (field, value) => {
    const updated = [...dogs];
    updated[step] = { ...updated[step], [field]: value };
    setDogs(updated);
  };

  const nextDog = () => {
    const errs = validateDog(dogs[step]);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep(step + 1);
  };

  const previousDog = () => {
    if (step > 0) {
      setStep(step - 1);
      setErrors({});
    } else {
      navigate("/my-dogs");
    }
  };

  const submitDogs = async () => {
    const errs = validateDog(dogs[step]);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (isEdit) {
        const dog = dogs[0];
        const formData = new FormData();
        formData.append("name", dog.name);
        formData.append("breed", dog.breed);
        formData.append("age", `${dog.ageValue} ${dog.ageUnit}`);
        formData.append("gender", dog.gender);
        if (dog.image instanceof File) {
          formData.append("image", dog.image);
        }

        await axiosInstance.put(`/dogs/${dog._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        for (const dog of dogs) {
          const formData = new FormData();
          formData.append("name", dog.name);
          formData.append("breed", dog.breed);
          formData.append("age", `${dog.ageValue} ${dog.ageUnit}`);
          formData.append("gender", dog.gender);
          formData.append("image", dog.image);
          formData.append("source", "client");

          await axiosInstance.post("/dogs", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }

      setSuccessMessage(isEdit ? "Changes saved successfully!" : "Dog(s) added successfully!");
      setTimeout(() => navigate("/my-dogs"), 1500);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Operation failed");
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col">
      <Helmet>
        <title>{isEdit ? "Edit Dog" : "Add Dogs"} - Kisite Canines</title>
      </Helmet>

      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/70 backdrop-blur-md transition-all duration-300">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-[#D7CD43]/30 border-t-[#D7CD43] rounded-full animate-spin"></div>
            <p className="mt-4 text-[#303A40] font-black uppercase tracking-widest text-sm animate-pulse">
              {isEdit ? "Updating Record..." : "Processing Entries..."}
            </p>
          </div>
        </div>
      )}

      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 w-full shadow-sm">
        <div className="flex items-center px-4 sm:px-8 py-4 max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-[#303A40]">
            {isEdit ? "Edit Dog Details" : "Register Dogs"}
          </h1>
        </div>
      </div>

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
          <div className="p-5 sm:p-8 lg:p-12">
            
            {successMessage && <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl text-sm font-bold border border-green-100 flex items-center"><span>✅ {successMessage}</span></div>}
            {errorMessage && <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 flex items-center"><span>⚠️ {errorMessage}</span></div>}

            {/* TOTAL DOGS SELECTION - Hidden in Edit Mode */}
            {!isEdit && (
              <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Registration Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={totalDogs}
                  onChange={(e) => handleTotalDogsChange(e.target.value)}
                  className="w-full sm:w-32 border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-[#D7CD43] outline-none font-bold text-[#303A40] transition-all"
                />
              </div>
            )}

            {/* PROGRESS INDICATOR / TITLE */}
            <div className="mb-8 bg-[#4F6866] text-white p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                  {isEdit ? "✎" : step + 1}
                </div>
                <span className="font-bold uppercase tracking-widest text-xs sm:text-sm">
                  {isEdit ? `Edit Details for ${dogs[0].name || "Dog"}` : "Current Dog Entry"}
                </span>
              </div>
              {!isEdit && (
                <span className="text-[10px] sm:text-xs bg-white text-[#4F6866] px-4 py-1.5 rounded-full uppercase font-black">
                  {step + 1} of {totalDogs}
                </span>
              )}
            </div>

            {/* FORM FIELDS */}
            <div className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Dog Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Buddy"
                    value={dogs[step].name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full border border-gray-300 p-3.5 rounded-xl focus:ring-2 focus:ring-[#D7CD43] outline-none transition-all placeholder:text-gray-300"
                  />
                  {errors.name && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-tighter">{errors.name}</p>}
                </div>

                <div className="w-full">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Breed <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Golden Retriever"
                    value={dogs[step].breed}
                    onChange={(e) => handleChange("breed", e.target.value)}
                    className="w-full border border-gray-300 p-3.5 rounded-xl focus:ring-2 focus:ring-[#D7CD43] outline-none transition-all placeholder:text-gray-300"
                  />
                  {errors.breed && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-tighter">{errors.breed}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Gender <span className="text-red-500">*</span></label>
                  <select
                    value={dogs[step].gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className="w-full border border-gray-300 p-3.5 rounded-xl focus:ring-2 focus:ring-[#D7CD43] outline-none bg-white appearance-none cursor-pointer transition-all"
                  >
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-tighter">{errors.gender}</p>}
                </div>

                <div className="w-full">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Age <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={dogs[step].ageValue}
                      onChange={(e) => handleChange("ageValue", e.target.value)}
                      className="w-1/2 border border-gray-300 p-3.5 rounded-xl focus:ring-2 focus:ring-[#D7CD43] outline-none transition-all"
                    />
                    <select
                      value={dogs[step].ageUnit}
                      onChange={(e) => handleChange("ageUnit", e.target.value)}
                      className="w-1/2 border border-gray-300 p-3.5 rounded-xl outline-none bg-white appearance-none cursor-pointer transition-all"
                    >
                      <option>Years</option>
                      <option>Months</option>
                    </select>
                  </div>
                  {errors.age && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-tighter">{errors.age}</p>}
                </div>
              </div>

              <div className="p-6 sm:p-10 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4 text-center group-hover:text-[#4F6866] transition-colors">
                   {isEdit ? "Update Identification Photo" : "Identification Photo"} <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col items-center">
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => (fileInputRefs.current[step] = el)}
                    onChange={(e) => handleChange("image", e.target.files[0])}
                    className="w-full max-w-xs text-xs sm:text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-black file:uppercase file:bg-[#D7CD43] file:text-[#303A40] hover:file:opacity-80 cursor-pointer"
                    key={step}
                  />
                  <p className="mt-3 text-[10px] text-gray-400 font-medium">PNG, JPG or JPEG (Max 5MB)</p>
                </div>
                {errors.image && <p className="text-red-500 text-[10px] font-bold mt-4 text-center uppercase tracking-tighter">{errors.image}</p>}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-10 mt-10 border-t border-gray-100">
              <button 
                onClick={previousDog} 
                className="w-full sm:flex-1 bg-gray-100 py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-gray-500 hover:bg-gray-200 transition-all active:scale-95"
              >
                Cancel
              </button>
              
              {!isEdit && step < totalDogs - 1 ? (
                <button 
                  onClick={nextDog} 
                  className="w-full sm:flex-1 bg-[#4F6866] py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-white hover:opacity-90 shadow-lg shadow-[#4F6866]/20 transition-all active:scale-95"
                >
                  Next Dog
                </button>
              ) : (
                <button 
                  onClick={submitDogs} 
                  disabled={loading}
                  className="w-full sm:flex-1 bg-[#D7CD43] py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-[#303A40] hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-lg shadow-[#D7CD43]/30 transition-all"
                >
                  {isEdit ? "Confirm Editing" : "Complete Registration"}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DogForm;