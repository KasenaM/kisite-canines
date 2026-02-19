import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Calendar, 
  Clock, 
  Dog, 
  Hash, 
  ChevronDown, 
  X, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";
import axiosInstance from "../../axiosInstance";
import { Helmet } from 'react-helmet-async';

const MyServices = () => {
  const navigate = useNavigate();

  // ================= STATE =================
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);
  const [hasDogs, setHasDogs] = useState(false);
  
 
  const [modal, setModal] = useState({ show: false, type: "", data: null, title: "", message: "" });
  
  const [toast, setToast] = useState({ show: false, message: "" });

  // ================= FETCH DATA =================
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [dogsRes, servicesRes] = await Promise.all([
        axiosInstance.get("/dogs"),
        axiosInstance.get("/bookings"),
      ]);
      setHasDogs(dogsRes.data.length > 0);
      setBookings(servicesRes.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to load your services. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ================= HELPERS =================
  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 5000);
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "done": case "completed": case "paid": return "bg-green-100 text-green-700 border-green-200";
      case "scheduled": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "rescheduled": return "bg-purple-100 text-purple-700 border-purple-200";
      case "cancelled": case "terminated": return "bg-red-100 text-red-700 border-red-200";
      case "confirmed": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // ================= ACTION HANDLERS =================
  const confirmAction = async () => {
    const { type, data } = modal;
    setModal({ ...modal, show: false });
    setLoading(true);

    try {
      if (type === "cancelService") {
        await axiosInstance.patch(`/bookings/service/${data.bookingId}/${data.dogItemId}/${data.serviceIndex}/cancel`);
        showToast("Service cancelled. Booking status has been updated.");
      } else if (type === "cancelBooking") {
        await axiosInstance.patch(`/bookings/${data.bookingId}/cancel`);
        showToast("Entire booking cancelled. Total reset to KES 0.");
      }
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleServiceAction = (bookingId, dogItemId, serviceIndex, action, currentBookingStatus) => {
    if (action === "cancel") {
      const isConfirmed = currentBookingStatus === "Confirmed";
      setModal({
        show: true,
        type: "cancelService",
        data: { bookingId, dogItemId, serviceIndex },
        title: "Cancel Service",
        message: isConfirmed 
          ? "This booking is currently CONFIRMED. Cancelling this service will move the booking back to PENDING for review. Proceed?"
          : "Are you sure you want to cancel this service?"
      });
    }

    if (action === "reschedule") {
      alert("Reschedule logic requires a date picker modal.");
    }
  };

  const handleBookingAction = (bookingId, action) => {
    if (action === "cancel") {
      setModal({
        show: true,
        type: "cancelBooking",
        data: { bookingId },
        title: "Cancel Full Booking",
        message: "This will cancel every service in this booking. This action is final."
      });
    }

    if (action === "reschedule") {
      alert("Reschedule logic for full booking is under development.");
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden relative">

       <Helmet>
  <title>My Services - Kisite Canines</title>
  <meta 
    name="description" 
    content="View and manage your booked services at Kisite Canines. Track training, boarding, and grooming appointments, reschedule services, and monitor progress." 
  />
</Helmet>

      
      {/* SUCCESS TOAST */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-[110] animate-in slide-in-from-right-full duration-300">
          <div className="bg-[#303A40] text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-4 border-l-4 border-[#D7CD43]">
            <CheckCircle className="text-[#D7CD43]" size={20} />
            <p className="text-sm font-medium pr-4">{toast.message}</p>
            <button onClick={() => setToast({ show: false, message: "" })} className="hover:bg-gray-700 p-1 rounded-full transition">
              <X size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {modal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#303A40] mb-2">{modal.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{modal.message}</p>
            </div>
            <div className="flex border-t border-gray-100 bg-gray-50/50">
              <button onClick={() => setModal({ ...modal, show: false })} className="flex-1 px-6 py-4 font-bold text-gray-500 hover:text-gray-700 transition">
                Dismiss
              </button>
              <button onClick={confirmAction} className="flex-1 px-6 py-4 font-bold text-red-600 hover:bg-red-50 transition border-l border-gray-100">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex-none bg-white border-b border-gray-200 w-full shadow-sm z-30">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-[#303A40]">My Services</h1>
          <button
            onClick={() => navigate("/my-services/book-service", { state: { from: "my-services" } })}
            className="flex items-center gap-2 bg-[#D7CD43] px-4 py-2 rounded-lg font-semibold text-[#303A40] hover:scale-105 transition shadow-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Book Service</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-hidden flex flex-col px-2 sm:px-8 py-4 sm:py-6 max-w-[1600px] mx-auto w-full">
        
        {loading && !modal.show && (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 border-4 border-gray-200 border-t-[#D7CD43] rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm font-medium">Updating services...</p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="max-w-xl mx-auto mt-10 p-6 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Empty State: No Dogs */}
        {!loading && !hasDogs && !error && (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center max-w-xl mx-auto mt-10 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🐾</div>
            <p className="text-lg font-semibold text-[#303A40] mb-3">You have no Dogs onboard.</p>
            <button
              onClick={() => navigate("/my-dogs/add-dog")}
              className="bg-[#D7CD43] px-6 py-3 rounded-lg font-semibold text-[#303A40] hover:scale-105 transition-transform"
            >
              Add Dog Details
            </button>
          </div>
        )}

        {/* Empty State: Has Dogs but no Bookings */}
        {!loading && hasDogs && bookings.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center max-w-xl mx-auto mt-10 shadow-sm">
            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📋</div>
            <p className="text-lg font-semibold text-[#303A40] mb-3">No active service bookings.</p>
            <p className="text-sm text-gray-500 mb-6">Proceed to book a service now.</p>
          </div>
        )}

        {/* Data Table */}
        {!loading && hasDogs && bookings.length > 0 && (
          <div className="flex-1 flex flex-col overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="overflow-auto relative">
              <table className="min-w-full border-separate border-spacing-0">
                <thead className="sticky top-0 z-20 bg-[#4F6866] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider min-w-[220px]">Service & Dog</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider min-w-[160px]">Service Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider min-w-[180px]">Schedule</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Cost</th>
                  </tr>
                </thead>

                <tbody className="bg-white">
                  {bookings.map((bookingGroup, groupIdx) => {
                    const groupBgColor = groupIdx % 2 === 0 ? "bg-white" : "bg-blue-50/10";

                    return (
                      <React.Fragment key={bookingGroup._id}>
                        {bookingGroup.bookings.map((dogItem, dIdx) =>
                          dogItem.services.map((svc, sIdx) => {
                            const isServiceDone = ["done", "completed", "cancelled", "terminated"].includes(svc.serviceStatus?.toLowerCase());
                            const isBookingCancelled = bookingGroup.status === "Cancelled";
                            const isBookingPending = bookingGroup.status === "Pending";
                            const isBookingConfirmed = bookingGroup.status === "Confirmed";
                            
                            const isDisabled = isServiceDone || isBookingCancelled;

                            return (
                              <tr key={`${bookingGroup._id}-${dIdx}-${sIdx}`} className={`${groupBgColor} hover:bg-yellow-50/30 transition-colors`}>
                                <td className="px-6 py-5 border-b border-gray-100">
                                  <div className="flex items-start gap-3">
                                    <div className="mt-1 p-2 bg-white border border-gray-100 rounded-lg text-[#4F6866] hidden md:block">
                                      <Dog size={16} />
                                    </div>
                                    <div className="space-y-1">
                                      <div className="text-sm">
                                        <span className="font-bold text-gray-400 text-[10px] uppercase mr-2">Name:</span>
                                        <span className="font-semibold text-[#303A40]">{dogItem.dogName}</span>
                                      </div>
                                      <div className="text-sm">
                                        <span className="font-bold text-gray-400 text-[10px] uppercase mr-2">Service:</span>
                                        <span className="font-medium text-[#303A40] uppercase">{svc.service}</span>
                                      </div>
                                      <div className="text-sm">
                                        <span className="font-bold text-gray-400 text-[10px] uppercase mr-2">Package:</span>
                                        <span className="text-gray-500">{svc.packageName}</span>
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                <td className="px-6 py-5 border-b border-gray-100">
                                  <div className="relative inline-block w-full max-w-[160px]">
                                    <select
                                      disabled={isDisabled}
                                      value=""
                                      onChange={(e) => handleServiceAction(bookingGroup._id, dogItem._id || dogItem.dogId, sIdx, e.target.value, bookingGroup.status)}
                                      className={`appearance-none cursor-pointer pl-3 pr-8 py-1.5 rounded-lg text-[11px] font-bold border outline-none w-full transition-all ${getStatusClass(svc.serviceStatus)} ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
                                    >
                                      <option value="" disabled hidden>{svc.serviceStatus}</option>
                                      
                                      {!isBookingConfirmed && isBookingPending && (
                                        <option value="reschedule" className="text-black bg-white">Reschedule Service</option>
                                      )}
                                      
                                      {(isBookingPending || isBookingConfirmed) && !isServiceDone && (
                                        <option value="cancel" className="text-black bg-white">Cancel Service</option>
                                      )}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                                  </div>
                                </td>

                                <td className="px-6 py-5 border-b text-xs font-bold text-[#4F6866]">{svc.progress}</td>

                                <td className="px-6 py-5 border-b">
                                  <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                                    <Clock size={14} className="text-[#D7CD43] shrink-0" />
                                    <span>{svc.serviceDate || `${svc.startDate} - ${svc.endDate}`}</span>
                                  </div>
                                </td>

                                <td className="px-6 py-5 border-b text-sm font-bold text-[#303A40]">
                                  KES {Number(svc.price || 0).toLocaleString()}
                                </td>
                              </tr>
                            );
                          })
                        )}

                        {/* BOOKING CONTROL FOOTER */}
                        <tr className="bg-[#303A40]">
                          <td colSpan="5" className="p-0">
                            <div className="flex flex-col lg:flex-row items-center justify-between p-5 sm:p-6 gap-6">
                              
                              {/* Left: Metadata & Status */}
                              <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                                <div className="flex flex-col gap-1 border-b sm:border-b-0 sm:border-r border-gray-600 pb-4 sm:pb-0 pr-0 sm:pr-8 w-full sm:w-auto text-center sm:text-left text-white">
                                  <span className="text-[10px] uppercase tracking-wider font-bold mb-1 opacity-70">Booking Details</span>
                                  <div className="flex items-center justify-center sm:justify-start gap-1.5 font-bold text-xs">
                                    <Calendar className="text-[#D7CD43]" size={14} />
                                    <span className="text-[#D7CD43]">{new Date(bookingGroup.createdAt).toLocaleDateString("en-GB")}</span>
                                    <Hash className="text-gray-400 ml-2" size={12} />
                                    <span className="text-gray-400">{bookingGroup.referenceCode.toUpperCase()}</span>
                                  </div>
                                </div>

                                <div className="relative w-full sm:w-[220px]">
                                  <select
                                    disabled={["Completed", "Cancelled"].includes(bookingGroup.status)}
                                    value=""
                                    onChange={(e) => handleBookingAction(bookingGroup._id, e.target.value)}
                                    className="appearance-none cursor-pointer pl-4 pr-10 py-2.5 rounded-lg text-[11px] font-bold outline-none transition-all w-full bg-[#4F6866] text-white border border-transparent hover:border-[#D7CD43] disabled:opacity-50"
                                  >
                                    <option value="" disabled hidden>Booking Status: {bookingGroup.status}</option>
                                    <option value="reschedule" className="text-black bg-white">Reschedule Entire Booking</option>
                                    <option value="cancel" className="text-black bg-white">Cancel Entire Booking</option>
                                  </select>
                                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white" />
                                </div>
                              </div>

                              {/* Right: Payment & Total */}
                              <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                                <div className="relative w-full sm:w-[220px] lg:border-r border-gray-600 lg:pr-8">
                                  <select
                                    disabled={bookingGroup.paymentStatus === "Paid" || bookingGroup.status === "Pending" || bookingGroup.status === "Cancelled"}
                                    value=""
                                    onChange={() => console.log("Initializing payment flow...")}
                                    className={`appearance-none cursor-pointer pl-4 pr-10 py-2.5 rounded-lg text-[11px] font-bold border-none outline-none w-full transition-all ${
                                      bookingGroup.paymentStatus === "Paid" ? "bg-green-600 text-white" : "bg-[#D7CD43] text-[#303A40]"
                                    } disabled:opacity-50`}
                                  >
                                    <option value="" disabled>Payment: {bookingGroup.paymentStatus || "Unpaid"}</option>
                                    {bookingGroup.paymentStatus !== "Paid" && bookingGroup.status === "Confirmed" && (
                                      <option value="pay_now" className="text-black bg-white">Pay Now</option>
                                    )}
                                  </select>
                                  <ChevronDown size={14} className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${bookingGroup.paymentStatus === "Paid" ? "text-white" : "text-[#303A40]"}`} />
                                </div>

                                <div className="flex flex-col items-center sm:items-end w-full sm:w-auto">
                                  <span className="text-[10px] uppercase tracking-widest text-[#D7CD43] font-bold">Grand Total</span>
                                  <span className="font-black text-white text-2xl leading-tight">
                                    KES {Number(bookingGroup.totalAmount || 0).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyServices;