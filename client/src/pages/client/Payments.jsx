import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { 
  Download, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Search,
  Filter,
  Loader2,
  Check
} from "lucide-react";
import axiosInstance from "../../axiosInstance";
import { Helmet } from 'react-helmet-async';

const Payments = () => {
  // ================= STATE =================
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All"); // Options: All, Paid, Unpaid
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const filterRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= FETCH DATA =================
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axiosInstance.get("/api/bookings");
      setBookings(res.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to load payment records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ================= FILTERING LOGIC =================
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch = 
        b.referenceCode?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        b._id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const statusValue = b.paymentStatus === "Paid" ? "Paid" : "Unpaid";
      const matchesFilter = filterStatus === "All" || statusValue === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [bookings, searchTerm, filterStatus]);

  // ================= HELPERS =================
  const toggleExpand = (id) => {
    setExpandedBooking(expandedBooking === id ? null : id);
  };

  const handlePayNow = (bookingId) => {
    alert(`Initializing payment gateway for Booking: ${bookingId}`);
  };

  // ================= EXPORT TO CSV =================
  const exportToCSV = () => {
    if (filteredBookings.length === 0) return;

    const headers = ["Reference,Date,Method,Status,Amount\n"];
    const rows = filteredBookings.map(b => {
      return `${b.referenceCode?.toUpperCase() || "N/A"},${new Date(b.createdAt).toLocaleDateString("en-GB")},${b.paymentMethod || "None"},${b.paymentStatus || "Unpaid"},${b.totalAmount || 0}`;
    });

    const csvContent = "data:text/csv;charset=utf-8," + headers + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Payments_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPaid = bookings
    .filter(b => b.paymentStatus === "Paid")
    .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  const totalPending = bookings
    .filter(b => b.paymentStatus !== "Paid" && b.status !== "Cancelled")
    .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden relative">

      <Helmet>
  <title>Payments - Kisite Canines</title>
  <meta 
    name="description" 
    content="Manage your payments and invoices at Kisite Canines. Track pending dues, completed transactions, and download receipts securely." 
  />
</Helmet>

      
      {/* HEADER SECTION */}
      <div className="flex-none bg-white border-b border-gray-200 w-full shadow-sm z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4">
          
          {/* Top Row: Title and Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-[#303A40] whitespace-nowrap">Payment Management</h1>
              <p className="text-[10px] sm:text-xs text-[#4F6866] hidden md:block">Track service payments and invoices.</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Filter Dropdown */}
              <div className="relative" ref={filterRef}>
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center justify-center gap-2 border px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterStatus !== "All" ? "bg-[#4F6866] text-white border-[#4F6866]" : "bg-white border-gray-200 text-[#4F6866] hover:bg-gray-50"}`}
                >
                  <Filter size={18} /> 
                  <span className="hidden sm:inline">{filterStatus}</span>
                  <ChevronDown size={14} className={`hidden sm:block transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                    {["All", "Paid", "Unpaid"].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setFilterStatus(status);
                          setIsFilterOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className={filterStatus === status ? "font-bold text-[#303A40]" : "text-gray-600"}>{status}</span>
                        {filterStatus === status && <Check size={14} className="text-[#D7CD43]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Export Button */}
              <button 
                onClick={exportToCSV}
                className="flex items-center justify-center gap-2 bg-[#D7CD43] px-3 sm:px-4 py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-widest text-[#303A40] hover:opacity-90 transition active:scale-95 shadow-sm"
              >
                <Download size={18} /> 
                <span className="hidden sm:inline">Export All</span>
              </button>
            </div>
          </div>

          {/* Bottom Row: Search Bar (Full width on mobile) */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by Reference Code..." 
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#D7CD43] outline-none transition-all bg-gray-50/50"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-hidden flex flex-col px-4 sm:px-8 py-4 sm:py-6 max-w-[1600px] mx-auto w-full">
        
        {/* SUMMARY CARDS */}
        <div className="flex-none grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl text-green-600"><CheckCircle size={24}/></div>
            <div>
              <p className="text-[10px] font-bold text-[#4F6866] uppercase">Total Settled</p>
              <h3 className="text-xl font-black text-[#303A40]">KES {totalPaid.toLocaleString()}</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-orange-50 rounded-xl text-orange-600"><Clock size={24}/></div>
            <div>
              <p className="text-[10px] font-bold text-[#4F6866] uppercase">Pending Dues</p>
              <h3 className="text-xl font-black text-[#303A40]">KES {totalPending.toLocaleString()}</h3>
            </div>
          </div>
          <div className="bg-[#4F6866] rounded-2xl p-5 shadow-lg flex items-center gap-4 text-white">
            <div className="p-3 bg-white/10 rounded-xl text-[#D7CD43]"><CreditCard size={24}/></div>
            <div>
              <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">System Status</p>
              <h3 className="text-xl font-black italic text-white">Active Invoicing</h3>
            </div>
          </div>
        </div>

        {/* LOADING & ERROR STATES */}
        {loading && (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-[#D7CD43]" size={40} />
              <p className="text-gray-500 text-sm font-medium">Loading financial records...</p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="max-w-xl mx-auto mt-10 p-6 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-center">
            {error}
          </div>
        )}

        {/* DATA TABLE */}
        {!loading && !error && (
          <div className="flex-1 flex flex-col overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="overflow-auto relative h-full">
              <table className="min-w-full border-separate border-spacing-0">
                <thead className="sticky top-0 z-20 bg-[#4F6866] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Booking Ref</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Method</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Total Amount</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>

                <tbody className="bg-white">
                  {filteredBookings.map((bookingGroup, groupIdx) => {
                    const groupBgColor = groupIdx % 2 === 0 ? "bg-white" : "bg-blue-50/10";
                    
                    return (
                      <React.Fragment key={bookingGroup._id}>
                        <tr className={`${groupBgColor} hover:bg-yellow-50/30 transition-colors group`}>
                          <td className="px-6 py-5 border-b border-gray-100">
                            <button 
                              onClick={() => toggleExpand(bookingGroup._id)}
                              className="flex items-center gap-2 font-bold text-[#303A40] hover:text-[#4F6866]"
                            >
                              {expandedBooking === bookingGroup._id ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                              #{bookingGroup.referenceCode?.toUpperCase() || "N/A"}
                            </button>
                          </td>
                          <td className="px-6 py-5 border-b border-gray-100 text-sm text-gray-600">
                            {new Date(bookingGroup.createdAt).toLocaleDateString("en-GB")}
                          </td>
                          <td className="px-6 py-5 border-b border-gray-100">
                             <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${bookingGroup.paymentMethod ? "bg-gray-100 border-gray-200 text-[#4F6866]" : "bg-red-50 border-red-100 text-red-400"}`}>
                              {bookingGroup.paymentMethod || "None"}
                             </span>
                          </td>
                          <td className="px-6 py-5 border-b border-gray-100">
                             <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter
                              ${bookingGroup.paymentStatus === "Paid" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}
                             `}>
                              {bookingGroup.paymentStatus || "Unpaid"}
                            </span>
                          </td>
                          <td className="px-6 py-5 border-b border-gray-100 font-black text-[#303A40]">
                            KES {(bookingGroup.totalAmount || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-5 border-b border-gray-100 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {bookingGroup.paymentStatus !== "Paid" ? (
                                <button 
                                  disabled={bookingGroup.status !== "Confirmed"}
                                  onClick={() => handlePayNow(bookingGroup._id)}
                                  className={`text-xs font-bold px-4 py-1.5 rounded-lg transition flex items-center gap-2 shadow-sm
                                    ${bookingGroup.status === "Confirmed" 
                                      ? "bg-[#D7CD43] text-[#303A40] hover:scale-105 active:scale-95" 
                                      : "bg-gray-100 text-gray-400 cursor-not-allowed"}
                                  `}
                                >
                                  Pay Now <ExternalLink size={12} />
                                </button>
                              ) : (
                                <button className="bg-[#303A40] text-white hover:bg-[#4F6866] transition p-2 rounded-lg shadow-sm" title="Download Receipt">
                                  <Download size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Detail Row */}
                        {expandedBooking === bookingGroup._id && (
                          <tr className="bg-gray-50/50">
                            <td colSpan="6" className="px-6 py-4 border-b border-gray-100">
                              <div className="bg-[#303A40] rounded-xl border border-gray-200 p-4 shadow-inner">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-widest">Service Breakdown</p>
                                <div className="space-y-2">
                                  {bookingGroup.bookings?.map((dogItem, dIdx) => 
                                    dogItem.services?.map((svc, sIdx) => (
                                      <div key={`${dIdx}-${sIdx}`} className="flex justify-between items-center text-sm border-b border-gray-50/10 pb-2">
                                        <div className="flex items-center gap-3">
                                          <span className="font-bold text-gray-300 min-w-[80px]">{dogItem.dogName}</span>
                                          <span className="text-gray-500">|</span>
                                          <span className="text-gray-400 font-medium uppercase text-[11px]">{svc.service}</span>
                                          <span className="text-gray-500 text-[11px]">({svc.packageName})</span>
                                        </div>
                                        <span className="font-bold text-[#D7CD43]">KES {Number(svc.price || 0).toLocaleString()}</span>
                                      </div>
                                    ))
                                  )}
                                </div>
                                <div className="mt-4 flex justify-between items-center pt-2 border-t border-gray-600">
                                   <span className="text-xs font-bold text-white">Grand Total</span>
                                   <span className="text-lg font-black text-[#D7CD43]">KES {(bookingGroup.totalAmount || 0).toLocaleString()}</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>

              {/* Empty State */}
              {!loading && filteredBookings.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-gray-400 text-sm font-medium">No payment records match your criteria.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BOTTOM CAPTION */}
        <div className="flex-none py-4 text-center">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.2em]">
            All transactions are handled securely. Invoices are generated automatically upon successful payment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payments;