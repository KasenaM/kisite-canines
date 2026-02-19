import React, { useState, useEffect } from "react";
import { User, MapPin, ShieldAlert, CreditCard, Bell, Calendar, Save, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Helmet } from 'react-helmet-async';

const Profile = () => {
  const { user, loading, setUser } = useAuth(); 
  
  // ================= State Management =================
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    emergencyName: "",
    emergencyRelationship: "",
    emergencyPhone: "",
  });

 
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        emergencyName: user.emergencyName || "",
        emergencyRelationship: user.emergencyRelationship || "",
        emergencyPhone: user.emergencyPhone || "",
      });
    }
  }, [user]);

  // Toast Helper
  const showToast = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 4000);
  };

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`, 
        },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          emergencyName: formData.emergencyName,
          emergencyRelationship: formData.emergencyRelationship,
          emergencyPhone: formData.emergencyPhone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      
      if (setUser) {
        setUser(data);
      }
      
      showToast("Profile updated successfully!", "success");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      showToast(error.message || "Failed to save changes", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // ================= Loading State =================
  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#D7CD43]/20 border-t-[#D7CD43] rounded-full animate-spin"></div>
          <User className="absolute text-[#4F6866] animate-pulse" size={24} />
        </div>
        <div className="flex flex-col items-center">
          <p className="text-[#303A40] font-black uppercase tracking-[0.2em] text-xs">Loading Profile</p>
          <p className="text-gray-400 text-[10px] mt-1">Retrieving your data...</p>
        </div>
      </div>
    );
  }

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently joined";

  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col relative">

      <Helmet>
  <title>Profile - Kisite Canines</title>
  <meta 
    name="description" 
    content="Manage your personal profile at Kisite Canines. Update your contact information, preferences, and account settings securely." 
  />
</Helmet>

      
      {/* ================= Custom Toast Notification (Bottom Left) ================= */}
      {notification.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-left-10 duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border ${
            notification.type === "success" 
            ? "bg-[#4F6866] border-[#D7CD43]/30 text-white" 
            : "bg-red-600 border-red-400 text-white"
          }`}>
            {notification.type === "success" ? <CheckCircle2 size={18} className="text-[#D7CD43]" /> : <AlertCircle size={18} />}
            <p className="text-sm font-bold tracking-wide">{notification.message}</p>
            <button onClick={() => setNotification({ ...notification, show: false })} className="ml-2 opacity-70 hover:opacity-100">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ================= Sticky Header ================= */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 w-full shadow-sm">
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 max-w-7xl mx-auto ">
          <h1 className="text-xl sm:text-2xl font-bold text-[#303A40] truncate">My Profile</h1>
          
          <div className="flex gap-2">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-[#D7CD43] px-5 py-2 rounded-lg font-bold text-[#303A40] hover:opacity-90 transition shadow-sm text-sm"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 px-4 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-300 transition text-sm flex items-center gap-2"
                >
                  <X size={16} /> Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-[#4F6866] px-5 py-2 rounded-lg font-bold text-white hover:opacity-90 transition shadow-sm text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ================= Page Content ================= */}
      <div className="px-4 sm:px-8 py-8 max-w-5xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-[#303A40] rounded-2xl border border-gray-200 p-6 shadow-sm transition-all">
              <h3 className="text-lg font-bold text-[#D7CD43] mb-6 flex items-center gap-2">
                <User size={20} className="text-[#D7CD43]" /> Personal Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                <ProfileField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  isEditing={false} 
                  onChange={handleChange}
                  labelColor="text-[#D7CD43]"
                  valueColor="text-white"
                />
                <ProfileField
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  isEditing={isEditing}
                  onChange={handleChange}
                  labelColor="text-[#D7CD43]"
                  valueColor="text-white"
                />
                <ProfileField
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  isEditing={isEditing}
                  onChange={handleChange}
                  labelColor="text-[#D7CD43]"
                  valueColor="text-white"
                />
                <ProfileField
                  label="Member Since"
                  value={memberSince}
                  isEditing={false}
                  labelColor="text-[#D7CD43]"
                  valueColor="text-white"
                  icon={<Calendar size={14} className="inline mr-1 mb-1 text-[#D7CD43]" />}
                />
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#303A40] mb-6 flex items-center gap-2">
                <MapPin size={20} className="text-[#4F6866]" /> Service & Shipping Address
              </h3>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
                  Used for dog deliveries, grooming pickups, and billing.
                </p>
                <ProfileField
                  label="Physical Address"
                  name="address"
                  value={formData.address}
                  isEditing={isEditing}
                  onChange={handleChange}
                  isTextArea
                />
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <section className="bg-red-50 rounded-2xl border border-red-200 p-6 shadow-sm">
              <h3 className="text-md font-bold text-red-800 mb-4 flex items-center gap-2">
                <ShieldAlert size={18} /> Emergency Contact
              </h3>
              <div className="space-y-3">
                <ProfileField
                  label="Contact Person"
                  name="emergencyName"
                  value={formData.emergencyName}
                  isEditing={isEditing}
                  onChange={handleChange}
                  isEmergency
                />
                <ProfileField
                  label="Relationship"
                  name="emergencyRelationship"
                  value={formData.emergencyRelationship}
                  isEditing={isEditing}
                  onChange={handleChange}
                  isEmergency
                />
                <ProfileField
                  label="Emergency Phone"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  isEditing={isEditing}
                  onChange={handleChange}
                  isEmergency
                />
              </div>
            </section>

            <section className="bg-[#4F6866] rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-md font-bold mb-4 opacity-90">Activity Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-80">Account Type</span>
                  <span className="font-bold">Pet Parent</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-80">Last Login</span>
                  <span className="font-bold text-[#D7CD43]">Today</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Bottom Settings Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-5">
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-[#4F6866] flex items-center justify-between shadow-sm hover:border-[#D7CD43]/30 transition-colors">
            <div className="flex items-center gap-4 ">
              <div className="p-3 bg-gray-100 rounded-lg text-[#4F6866]">
                <Bell size={20} />
              </div>
              <div>
                <p className="font-bold text-[#303A40]">Notifications</p>
                <p className="text-xs text-gray-500">Service reminders & updates</p>
              </div>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100">Enabled</span>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-[#D7CD43]/30 flex items-center justify-between shadow-sm hover:border-[#4F6866] transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-lg text-[#4F6866]">
                <CreditCard size={20} />
              </div>
              <div>
                <p className="font-bold text-[#303A40]">Payment Methods</p>
                <p className="text-xs text-gray-500">Manage cards & M-Pesa</p>
              </div>
            </div>
            <button className="text-xs font-bold text-[#D7CD43] hover:text-white transition-colors bg-[#303A40] px-3 py-1.5 rounded-md">Manage</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ================= Sub-component for Profile Fields =================
const ProfileField = ({
  label,
  name,
  value,
  isEditing,
  onChange,
  isEmergency = false,
  isTextArea = false,
  icon = null,
  labelColor = "text-[#4F6866]/70",
  valueColor = "text-[#303A40]",
}) => (
  <div className="animate-in fade-in slide-in-from-bottom-1 duration-500">
    <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${labelColor}`}>
      {label}
    </p>
    
    {isEditing ? (
      isTextArea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={3}
          className="w-full bg-white/10 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D7CD43] outline-none text-[#303A40]"
        />
      ) : (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full bg-transparent border-b-2 border-[#D7CD43] px-1 py-1 text-sm focus:outline-none ${valueColor}`}
        />
      )
    ) : (
      <div className={`font-semibold flex items-center ${valueColor}`}>
        {icon && <span className="mr-1">{icon}</span>}
        {value || (
          <span className="text-gray-400 italic font-normal text-xs">Not provided</span>
        )}
      </div>
    )}
  </div>
);

export default Profile; 