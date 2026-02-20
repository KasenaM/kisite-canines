import React, { useState, useEffect, useRef } from "react";
import PhoneInput from "react-phone-input-2";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useForm, Controller } from "react-hook-form";
import "react-phone-input-2/lib/style.css";
import servicePackages from "../../data/servicePackages";
import { Helmet } from "react-helmet-async";
import axiosInstance from "../../axiosInstance";

/* ================= HELPERS ================= */
const extractWeeks = (details = "") => {
  const match = details.match(/(\d+)\s*week/i);
  return match ? parseInt(match[1]) : 0;
};

const addWeeksToDate = (date, weeks) => {
  if (!date || !weeks) return "";
  const d = new Date(date);
  d.setDate(d.getDate() + weeks * 7);
  return d.toISOString().split("T")[0];
};

const getMinAllowedDate = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const minDate = new Date();
  if (currentHour >= 18) {
    minDate.setDate(now.getDate() + 2);
  } else {
    minDate.setDate(now.getDate() + 1);
  }
  return minDate.toISOString().split("T")[0];
};

function ServiceForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const formTopRef = useRef(null);

  const preSelectedDog = location.state?.selectedDog || null;

  /* ================= STATE ================= */
  const [dogs, setDogs] = useState([]);
  const [step, setStep] = useState("contact");
  const [selectedDogs, setSelectedDogs] = useState(preSelectedDog ? [preSelectedDog] : []);
  const [dogServicesMap, setDogServicesMap] = useState({});
  const [bookings, setBookings] = useState([]);
  const [currentDogIndex, setCurrentDogIndex] = useState(0);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [globalPickupPreference, setGlobalPickupPreference] = useState("");
  const [detailError, setDetailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ================= AUTO-SCROLL LOGIC ================= */
  const scrollToTop = () => {
    if (formTopRef.current) {
      formTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    scrollToTop();
  }, [step, currentDogIndex, currentServiceIndex]);

  /* ================= FETCH DOGS ================= */
  useEffect(() => {
    const fetchUserDogs = async () => {
      try {
        const response = await axiosInstance.get("/api/dogs");
        setDogs(response.data || []);
      } catch (err) {
        console.error("Error fetching dogs:", err);
        setDetailError("Could not load your dogs.");
      }
    };
    fetchUserDogs();
  }, []);

  /* ================= RHF ================= */
  const { control, register, handleSubmit, watch, formState: { errors: formErrors } } = useForm({
    defaultValues: {
      phone: user?.phone || "",
      address: user?.address || "",
    },
  });

  const contactData = watch();

  /* ================= SUBMIT ================= */
  const handleSubmitBooking = async () => {
    setIsSubmitting(true);
    setDetailError("");
    try {
      const payload = {
        phone: contactData.phone,
        address: contactData.address,
        pickupPreference: globalPickupPreference,
        bookings: bookings,
        totalAmount: calculateTotal(),
      };

      const response = await axiosInstance.post("/api/bookings", payload);
      if (response.status === 201) navigate("/my-services");
    } catch (error) {
      setDetailError(error.response?.data?.message || "Failed to submit booking.");
      setIsSubmitting(false);
      scrollToTop();
    }
  };

  /* ================= LOGIC ================= */
  const toggleDog = (dog) => {
    setSelectedDogs((prev) =>
      prev.some((d) => d._id === dog._id) ? prev.filter((d) => d._id !== dog._id) : [...prev, dog]
    );
  };

  const toggleServiceForDog = (dogId, svc) => {
    setDetailError("");
    setDogServicesMap((prev) => {
      const currentServices = prev[dogId] || [];
      const isAdding = !currentServices.includes(svc);
      
      if (isAdding) {
        // Rule: One Primary service only (Training or Boarding)
        const primaryServices = ["Training", "Boarding"];
        if (primaryServices.includes(svc)) {
          const hasPrimary = currentServices.some(s => primaryServices.includes(s));
          if (hasPrimary) {
            setDetailError("A dog can only have one residential service (Training or Boarding) per booking.");
            scrollToTop();
            return prev;
          }
        }
        return { ...prev, [dogId]: [...currentServices, svc] };
      } else {
        return { ...prev, [dogId]: currentServices.filter((s) => s !== svc) };
      }
    });
  };

  const buildBookings = () => {
    const missingService = selectedDogs.find(dog => !dogServicesMap[dog._id] || dogServicesMap[dog._id].length === 0);
    if (missingService) {
      setDetailError(`Please select at least one service for ${missingService.name}`);
      scrollToTop();
      return;
    }

    const built = selectedDogs.map((dog) => {
      // Sort services: Primary first, Grooming last
      const sortedSvc = [...dogServicesMap[dog._id]].sort((a, b) => {
        if ((a === "Training" || a === "Boarding") && b === "Grooming") return -1;
        if (a === "Grooming" && (b === "Training" || b === "Boarding")) return 1;
        return 0;
      });

      return {
        dogId: dog._id,
        dogName: dog.name,
        services: sortedSvc.map((svc) => ({
          service: svc,
          packageName: "",
          price: 0,
          basePrice: 0,
          serviceDate: "",
          startDate: "",
          endDate: "",
          locationType: "",
          notes: "",
        })),
      };
    });
    setBookings(built);
    setDetailError("");
    setStep("details");
  };

  const currentDog = bookings[currentDogIndex] || {};
  const currentService = currentDog.services?.[currentServiceIndex] || {};

  const updateService = (field, value) => {
    setDetailError("");
    const updated = [...bookings];
    const serviceObj = updated[currentDogIndex].services[currentServiceIndex];
    serviceObj[field] = value;

    const pkgList = servicePackages[serviceObj.service] || [];
    const found = pkgList.find(p => p.name === (field === "packageName" ? value : serviceObj.packageName));

    if (found) {
      const cleanPrice = typeof found.price === "string" 
        ? Number(found.price.replace(/[^\d.]/g, "")) 
        : found.price;
      
      serviceObj.basePrice = cleanPrice;

      if (serviceObj.service === "Boarding" && serviceObj.startDate && serviceObj.endDate) {
        const start = new Date(serviceObj.startDate);
        const end = new Date(serviceObj.endDate);
        const diffTime = end - start;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const nights = diffDays > 0 ? diffDays : 1;
        serviceObj.price = cleanPrice * nights;
      } else {
        serviceObj.price = cleanPrice || 0;
      }
    }
    setBookings(updated);
  };

  const packages = servicePackages[currentService.service] || [];
  const selectedPackage = packages.find((p) => p.name === currentService.packageName);

  const calculateTotal = () => {
    return bookings.reduce((acc, dog) => {
      return acc + dog.services.reduce((sAcc, s) => sAcc + (Number(s.price) || 0), 0);
    }, 0);
  };

  const validateCurrentStep = () => {
    const s = currentService;
    if (!s.packageName) return "Package selection is required.";
    
    if (s.service === "Grooming") {
      if (!s.serviceDate) return "Service date is required.";
      // If standalone, location is required
      const hasPrimary = currentDog.services.some(sv => sv.service === "Training" || sv.service === "Boarding");
      if (!hasPrimary && !s.locationType) return "Location type is required.";
      
      // Date range validation if paired
      if (hasPrimary) {
        const primary = currentDog.services.find(sv => sv.service === "Training" || sv.service === "Boarding");
        if (primary.startDate && primary.endDate) {
          const gDate = new Date(s.serviceDate);
          const pStart = new Date(primary.startDate);
          const pEnd = new Date(primary.endDate);
          if (gDate < pStart || gDate > pEnd) {
            return `Grooming date must be between ${primary.startDate} and ${primary.endDate}`;
          }
        }
      }
    }
    
    if (s.service === "Training" && !s.startDate) return "Start date is required.";
    
    if (s.service === "Boarding") {
      if (!s.startDate) return "Check-in date is required.";
      if (!s.endDate) return "Check-out date is required.";
      const start = new Date(s.startDate);
      const end = new Date(s.endDate);
      const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      
      if (end <= start) return "Check-out must be after check-in.";
      if (diffDays < 1) return "Boarding must be at least 1 day.";
      if (diffDays > 30) return "Boarding cannot exceed 30 days.";
    }
    
    if (!s.notes || s.notes.trim().length < 5) return "Please provide brief notes (min 5 characters).";
    return null;
  };

 const nextDetail = () => {
  const errorMsg = validateCurrentStep();
  if (errorMsg) { 
    setDetailError(errorMsg); 
    scrollToTop();
    return; 
  }

  // Move through services first
  if (currentServiceIndex < currentDog.services.length - 1) {
    setCurrentServiceIndex((i) => i + 1);
    return;
  }

  // Move through dogs next
  if (currentDogIndex < bookings.length - 1) {
    setCurrentDogIndex((i) => i + 1);
    setCurrentServiceIndex(0);
    return;
  }

  // ===== FINAL STEP DECISION (SKIP LOGISTICS IF NEEDED) =====
  const isOnlyStandaloneClientGrooming = bookings.every(dog =>
    dog.services.length === 1 &&
    dog.services[0].service === "Grooming" &&
    dog.services[0].locationType === "Client"
  );

  if (isOnlyStandaloneClientGrooming) {
    setStep("summary");     // Skip Logistics
  } else {
    setStep("preferences"); // Normal Flow
  }
};


  const prevDetail = () => {
    setDetailError("");
    if (currentServiceIndex > 0) {
      setCurrentServiceIndex((i) => i - 1);
    } else if (currentDogIndex > 0) {
      const prevDog = currentDogIndex - 1;
      setCurrentDogIndex(prevDog);
      setCurrentServiceIndex(bookings[prevDog].services.length - 1);
    } else {
      setStep("services");
    }
  };

  // Helper to determine Grooming constraints
  const getGroomingConstraints = () => {
    const primarySvc = currentDog.services?.find(s => s.service === "Training" || s.service === "Boarding");
    if (primarySvc && primarySvc.startDate && primarySvc.endDate) {
      return { min: primarySvc.startDate, max: primarySvc.endDate, isPaired: true };
    }
    return { min: getMinAllowedDate(), max: null, isPaired: false };
  };

  return (
    <div className="h-full overflow-auto bg-gray-50 flex flex-col">
      <Helmet><title>Service Booking - Kisite Canines</title></Helmet>

      <div ref={formTopRef} className="h-0" />

      {isSubmitting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/70 backdrop-blur-md">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-[#D7CD43]/30 border-t-[#D7CD43] rounded-full animate-spin"></div>
            <p className="mt-4 text-[#303A40] font-black uppercase tracking-widest text-sm animate-pulse">Processing Booking...</p>
          </div>
        </div>
      )}

      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 w-full shadow-sm">
        <div className="flex items-center px-4 sm:px-8 py-4 max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-[#303A40]">Service Booking</h1>
        </div>
      </div>

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-8 lg:p-12">
            
            {/* STEP 1: CONTACT */}
            {step === "contact" && (
              <form onSubmit={handleSubmit(() => preSelectedDog ? setStep("services") : setStep("dogs"))} className="space-y-8">
                <div className="border-l-4 border-[#D7CD43] pl-4">
                  <h2 className="text-lg font-black text-[#303A40] uppercase tracking-tight">1. Contact Information</h2>
                  <p className="text-gray-500 text-xs uppercase font-bold">Where can we reach you?</p>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Primary Phone Number</label>
                    <Controller
                      control={control}
                      name="phone"
                      rules={{ required: "Phone number is required", validate: (v) => v?.replace(/\D/g, '').length >= 10 || "Invalid phone format" }}
                      render={({ field }) => (
                        <PhoneInput 
                          country="ke" 
                          {...field} 
                          containerClass="!w-full" 
                          inputClass={`!w-full !h-[52px] !rounded-xl ${formErrors.phone ? "!border-red-500" : "!border-gray-300"} !text-lg !font-bold`} 
                        />
                      )}
                    />
                    {formErrors.phone && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-wide">{formErrors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Physical Address</label>
                    <input 
                      {...register("address", { required: "Physical address is required" })} 
                      placeholder="Street, Estate, House No." 
                      className={`w-full border ${formErrors.address ? "border-red-500" : "border-gray-300"} p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#D7CD43] font-medium`} 
                    />
                    {formErrors.address && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-wide">{formErrors.address.message}</p>}
                  </div>
                </div>
                <button className="w-full bg-[#D7CD43] text-[#303A40] font-black uppercase tracking-widest text-sm py-5 rounded-2xl shadow-lg hover:scale-[1.01] transition-transform">Continue</button>
              </form>
            )}

            {/* STEP 2: DOG SELECTION */}
            {step === "dogs" && (
              <div className="space-y-8">
                <div className="border-l-4 border-[#D7CD43] pl-4">
                  <h2 className="text-lg font-black text-[#303A40] uppercase tracking-tight">2. Select Your Dogs</h2>
                  <p className="text-gray-500 text-xs uppercase font-bold">Which dogs are we serving today?</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dogs.map((dog) => (
                    <div key={dog._id} onClick={() => toggleDog(dog)} className={`p-5 border-2 rounded-2xl cursor-pointer flex justify-between items-center transition-all ${selectedDogs.some(d => d._id === dog._id) ? "border-[#D7CD43] bg-yellow-50 shadow-sm" : "border-gray-100 hover:border-gray-200"}`}>
                      <div>
                        <p className="font-black text-sm uppercase">{dog.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{dog.breed}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 transition-colors ${selectedDogs.some(d => d._id === dog._id) ? "bg-[#D7CD43] border-[#D7CD43]" : "border-gray-200"}`} />
                    </div>
                  ))}
                </div>
                {selectedDogs.length === 0 && <p className="text-red-500 text-[10px] font-bold uppercase bg-red-50 p-3 rounded-lg border border-red-100">⚠️ Please select at least one dog to continue.</p>}
                <div className="flex gap-3">
                  <button onClick={() => setStep("contact")} className="flex-1 bg-gray-100 py-4 rounded-2xl font-black uppercase text-xs text-gray-500">Back</button>
                  <button disabled={selectedDogs.length === 0} onClick={() => setStep("services")} className="flex-1 bg-[#D7CD43] py-4 rounded-2xl font-black uppercase text-xs disabled:opacity-50">Next</button>
                </div>
              </div>
            )}

            {/* STEP 3: INDIVIDUAL SERVICE SELECTION */}
            {step === "services" && (
              <div className="space-y-8">
                <div className="border-l-4 border-[#D7CD43] pl-4">
                  <h2 className="text-lg font-black text-[#303A40] uppercase tracking-tight">3. Choose Services</h2>
                  <p className="text-gray-500 text-xs uppercase font-bold">Select one or more services for each dog</p>
                </div>

                {detailError && <p className="text-red-500 text-[10px] font-bold uppercase bg-red-50 p-4 rounded-xl border border-red-100">⚠️ {detailError}</p>}

                <div className="space-y-6">
                  {selectedDogs.map((dog) => (
                    <div key={dog._id} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <h3 className="font-black text-[#4F6866] uppercase text-sm mb-4 flex items-center gap-2">🐾 {dog.name}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {Object.keys(servicePackages).map((svc) => (
                          <div 
                            key={svc} 
                            onClick={() => toggleServiceForDog(dog._id, svc)}
                            className={`p-4 border-2 rounded-xl cursor-pointer text-center transition-all ${dogServicesMap[dog._id]?.includes(svc) ? "border-[#4F6866] bg-white shadow-md scale-[1.02]" : "border-gray-200 opacity-60 hover:opacity-100"}`}
                          >
                            <span className="text-[10px] font-black uppercase tracking-tighter">{svc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => preSelectedDog ? setStep("contact") : setStep("dogs")} className="flex-1 bg-gray-100 py-4 rounded-2xl font-black uppercase text-xs text-gray-500">Back</button>
                  <button onClick={buildBookings} className="flex-1 bg-[#D7CD43] py-4 rounded-2xl font-black uppercase text-xs">Configure Details</button>
                </div>
              </div>
            )}

            {/* STEP 4: PACKAGE DETAILS */}
            {step === "details" && currentService && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-[#4F6866] text-white p-5 rounded-2xl flex justify-between items-center shadow-lg">
                    <span className="font-black uppercase text-xs tracking-widest">Configuring For: {currentDog.dogName}</span>
                    <span className="text-[10px] bg-white text-[#4F6866] px-4 py-1.5 rounded-full font-black uppercase">Service {currentServiceIndex + 1} of {currentDog.services.length}</span>
                </div>

                {detailError && <div className="bg-red-50 text-red-500 p-4 rounded-xl text-[10px] font-black uppercase border border-red-100 animate-pulse">⚠️ {detailError}</div>}

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">1. Select {currentService.service} Package <span className="text-red-500">*</span></label>
                    <select 
                      value={currentService.packageName} 
                      onChange={(e) => updateService("packageName", e.target.value)} 
                      className={`w-full border ${detailError && !currentService.packageName ? "border-red-500" : "border-gray-300"} p-4 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-[#D7CD43] bg-white`}
                    >
                      <option value="">-- Choose Package --</option>
                      {packages.map((p) => <option key={p.name} value={p.name}>{p.name} (KES {p.price.toLocaleString()})</option>)}
                    </select>
                  </div>

                  {currentService.service === "Training" && (
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">2. Schedule <span className="text-red-500">*</span></label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-gray-400 uppercase ml-1 mb-1">Start-Date</span>
                        <input 
                          type="date" 
                          min={getMinAllowedDate()} 
                          value={currentService.startDate} 
                          onChange={(e) => {
                            const start = e.target.value;
                            updateService("startDate", start);
                            updateService("endDate", addWeeksToDate(start, extractWeeks(selectedPackage?.details)));
                          }} 
                          className={`w-full border ${detailError && !currentService.startDate ? "border-red-500" : "border-gray-300"} p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#D7CD43]`} 
                        />
                        </div>
                        <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-gray-400 uppercase ml-1 mb-1">End-Date</span>
                        <div className="border border-gray-200 p-4 rounded-xl bg-gray-50 text-gray-500 text-sm font-bold flex items-center h-[54px]">
                          Auto End: {currentService.endDate || "Select Start Date"}
                        </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentService.service === "Grooming" && (
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">2. Date & Location <span className="text-red-500">*</span></label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-gray-400 uppercase ml-1 mb-1">Date of Grooming</span>
                        <input 
                          type="date" 
                          min={getGroomingConstraints().min} 
                          max={getGroomingConstraints().max || ""}
                          value={currentService.serviceDate} 
                          onChange={(e) => updateService("serviceDate", e.target.value)} 
                          className={`w-full border ${detailError && !currentService.serviceDate ? "border-red-500" : "border-gray-300"} p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#D7CD43]`} 
                        />
                        {getGroomingConstraints().isPaired && (
                          <span className="text-[8px] text-blue-500 font-bold mt-1 px-1">Must be during primary stay</span>
                        )}
                        </div>
                        <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-gray-400 uppercase ml-1 mb-1">Grooming Location</span>
                        {getGroomingConstraints().isPaired ? (
                          <div className="border border-[#4F6866] p-4 rounded-xl bg-[#4F6866]/5 text-[#4F6866] text-sm font-black flex items-center h-[54px] uppercase tracking-tighter">
                            Locked: At Kennel Premises
                          </div>
                        ) : (
                          <select 
                            value={currentService.locationType} 
                            onChange={(e) => updateService("locationType", e.target.value)} 
                            className={`w-full border ${detailError && !currentService.locationType ? "border-red-500" : "border-gray-300"} p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#D7CD43] bg-white h-[54px]`}
                          >
                            <option value="">Choose Location</option>
                            <option value="Kennel">At Kennel Premises</option>
                            <option value="Client">At Client Premises</option>
                          </select>
                        )}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentService.service === "Boarding" && (
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">2. Boarding Period <span className="text-red-500">*</span></label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                           <span className="text-[9px] font-bold text-gray-400 uppercase ml-1 mb-1">Check-in</span>
                           <input 
                             type="date" 
                             min={getMinAllowedDate()} 
                             value={currentService.startDate} 
                             onChange={(e) => updateService("startDate", e.target.value)} 
                             className={`w-full border ${detailError && !currentService.startDate ? "border-red-500" : "border-gray-300"} p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#D7CD43]`} 
                           />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[9px] font-bold text-gray-400 uppercase ml-1 mb-1">Check-out</span>
                           <input 
                             type="date" 
                             min={currentService.startDate || getMinAllowedDate()} 
                             value={currentService.endDate} 
                             onChange={(e) => updateService("endDate", e.target.value)} 
                             className={`w-full border ${detailError && !currentService.endDate ? "border-red-500" : "border-gray-300"} p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#D7CD43]`} 
                           />
                        </div>
                      </div>
                      {currentService.price > 0 && (
                        <div className="bg-[#4F6866]/5 p-3 rounded-lg border border-[#4F6866]/10">
                           <p className="text-[10px] font-black text-[#4F6866] uppercase">Calculated Boarding Cost: KES {currentService.price.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">3. Special Instructions <span className="text-red-500">*</span></label>
                    <textarea 
                      placeholder="Behavioral notes, allergies, diet preferences (min 5 characters)..." 
                      value={currentService.notes} 
                      onChange={(e) => updateService("notes", e.target.value)} 
                      className={`w-full border ${detailError && (!currentService.notes || currentService.notes.length < 5) ? "border-red-500" : "border-gray-300"} p-4 rounded-xl h-32 outline-none focus:ring-2 focus:ring-[#D7CD43] font-medium`} 
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t">
                  <button onClick={prevDetail} className="flex-1 bg-gray-100 py-4 rounded-2xl font-black text-xs uppercase text-gray-500 hover:bg-gray-200 transition-colors">Back</button>
                  <button onClick={nextDetail} className="flex-1 bg-[#D7CD43] py-4 rounded-2xl font-black text-xs uppercase text-[#303A40] shadow-lg shadow-[#D7CD43]/20">Next Step</button>
                </div>
              </div>
            )}

            {/* STEP 5: GLOBAL PREFERENCES */}
            {step === "preferences" && (
              <div className="space-y-8">
                <div className="border-l-4 border-[#D7CD43] pl-4">
                  <h2 className="text-lg font-black text-[#303A40] uppercase tracking-tight">4. Logistics</h2>
                  <p className="text-gray-500 text-xs uppercase font-bold">How will the dog(s) get to us?</p>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Pickup / Delivery Preference</label>
                  <select 
                    value={globalPickupPreference} 
                    onChange={(e) => setGlobalPickupPreference(e.target.value)} 
                    className={`w-full border-2 ${!globalPickupPreference ? "border-red-200" : "border-[#4F6866]"} p-5 rounded-2xl outline-none bg-white font-bold text-lg`}
                  >
                    <option value="">-- Choose Option --</option>
                    <option value="Management">Management to pick/drop the dog(s)</option>
                    <option value="Client">I will bring/pick the dog(s) myself</option>
                  </select>
                  {!globalPickupPreference && <p className="text-red-500 text-[10px] font-bold mt-3 uppercase tracking-wider">⚠️ Selection required to generate summary.</p>}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep("details")} className="flex-1 bg-gray-100 py-4 rounded-2xl font-black text-xs uppercase text-gray-500">Back</button>
                  <button disabled={!globalPickupPreference} onClick={() => setStep("summary")} className="flex-1 bg-[#D7CD43] py-4 rounded-2xl font-black text-xs uppercase text-[#303A40] disabled:opacity-50">Review Summary</button>
                </div>
              </div>
            )}

            {/* STEP 6: SUMMARY */}
            {step === "summary" && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-3xl mb-4 border border-green-100">📋</div>
                  <h2 className="text-2xl font-black text-[#303A40] uppercase tracking-tight">Booking Summary</h2>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest bg-gray-100 inline-block px-4 py-1 rounded-full">
                    Logistics: {globalPickupPreference === "Management" ? "Pickup Requested" : "Self Delivery"}
                  </p>
                </div>

                <div className="space-y-4">
                  {bookings.map((dog) => (
                    <div key={dog.dogId} className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
                      <div className="bg-[#4F6866] text-white px-6 py-4 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                        🐾 {dog.dogName}
                      </div>
                      <div className="divide-y divide-gray-100">
                        {dog.services.map((svc, idx) => (
                          <div key={idx} className="p-6 flex justify-between items-center bg-white">
                            <div>
                              <p className="font-black text-sm uppercase text-[#303A40]">{svc.service}: {svc.packageName}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                                {svc.startDate || svc.serviceDate} {svc.endDate ? `to ${svc.endDate}` : ""}
                              </p>
                            </div>
                            <p className="font-black text-lg text-[#303A40]">KES {svc.price.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#303A40] text-white p-6 sm:p-8 rounded-3xl flex justify-between items-center shadow-xl">
                  <span className="font-black uppercase text-sm tracking-widest">Total Amount</span>
                  <span className="text-3xl font-black text-[#D7CD43]">KES {calculateTotal().toLocaleString()}</span>
                </div>

                <div className="flex flex-col gap-4">
                   {/* Display backend error if it exists */}
                     {detailError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-[12px] font-black uppercase p-4 rounded-xl text-center">
                          ⚠️ {detailError}
                        </div>
                 )}
                  <button 
                    onClick={handleSubmitBooking} 
                    disabled={isSubmitting} 
                    className="w-full bg-[#D7CD43] py-6 rounded-2xl font-black text-xl text-[#303A40] uppercase shadow-lg shadow-[#D7CD43]/30 hover:scale-[1.01] transition-transform active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : "Confirm & Submit Booking"}
                  </button>
                  <button 
                    onClick={() => setStep("preferences")} 
                    className="w-full py-4 rounded-2xl font-black text-xs uppercase text-gray-400 hover:text-gray-600 transition-colors border border-dashed border-gray-200"
                  >
                    &larr; Go Back to Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceForm;