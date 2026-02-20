// src/pages/client/Dashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import axiosInstance from "../../axiosInstance";
import {
  Loader2,
  CalendarDays,
  Dog,
  CreditCard,
  Activity as ActivityIcon,
  Star,
} from "lucide-react";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({});
  const [userName, setUserName] = useState("User");

  /* ================= FETCH USER DASHBOARD ANALYTICS ================= */
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        const profileRes = await axiosInstance.get("/api/auth/me");
        const userId = profileRes.data._id;
        setUserName(profileRes.data?.name || "User");

        const analyticsRes = await axiosInstance.get(
          `/api/analytics/user/${userId}`
        );

        setAnalytics(analyticsRes.data);
      } catch (error) {
        console.error("Dashboard Fetch Error:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  /* ================= GREETING ================= */
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  /* ================= STATS ================= */
  const {
    totalDogs = 0,
    cancelledServices = 0,
    upcomingAppointments = 0,
    totalSpent = 0,
    mostUsedService = null,
    completionRate = 0,
    cancellationRate = 0,
    avgSpendPerBooking = 0,
    upcomingRevenue = 0,
    dogsMostServices = [],
    loyaltyLevel = "Bronze",
    recentActivities = [],
  } = analytics;

  return (
    <div className="h-full overflow-y-auto bg-gray-100 flex flex-col">
      <Helmet>
        <title>Dashboard - Kisite Canines</title>
      </Helmet>

      {/* ================= HEADER ================= */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-5 max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-[#303A40]">
            {greeting}, {userName} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Here’s an overview of your account activity.
          </p>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="px-6 py-8 max-w-7xl mx-auto w-full flex-1">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="animate-spin text-[#D7CD43]" size={40} />
          </div>
        ) : (
          <>
            {/* ================= MAIN STATS ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={<Dog size={20} />}
                title="My Dogs"
                value={totalDogs}
              />
              <StatCard
                icon={<Star size={20} />}
                title="Most Used Service"
                value={mostUsedService || "-"}
              />
              <StatCard
                icon={<ActivityIcon size={20} />}
                title="Cancelled Services"
                value={cancelledServices}
              />
              <StatCard
                icon={<CalendarDays size={20} />}
                title="Upcoming Appointments"
                value={upcomingAppointments}
              />
            </div>

            {/* ================= FINANCIAL ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={<CreditCard size={20} />}
                title="Total Spent"
                value={`KES ${totalSpent.toLocaleString()}`}
              />
              <StatCard
                icon={<ActivityIcon size={20} />}
                title="Average Spend/Booking"
                value={`KES ${parseFloat(avgSpendPerBooking).toLocaleString()}`}
              />
              <StatCard
                icon={<ActivityIcon size={20} />}
                title="Upcoming Revenue"
                value={`KES ${upcomingRevenue.toLocaleString()}`}
              />
              <StatCard
                icon={<ActivityIcon size={20} />}
                title="Loyalty Level"
                value={loyaltyLevel}
              />
            </div>

            {/* ================= PERFORMANCE ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
              <StatCard
                icon={<ActivityIcon size={20} />}
                title="Service Completion Rate"
                value={`${completionRate}%`}
              />
              <StatCard
                icon={<ActivityIcon size={20} />}
                title="Cancellation Rate"
                value={`${cancellationRate}%`}
              />
            </div>

            {/* ================= DOGS MOST SERVICES ================= */}
            <SectionCard title="Dogs With Most Services">
              {dogsMostServices.length === 0 ? (
                <p className="text-gray-500 text-sm">No data available.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dogsMostServices.map((dog) => (
                    <div
                      key={dog.dogId}
                      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                    >
                      <p className="font-semibold text-[#303A40]">
                        {dog.dogName}
                      </p>
                      <p className="text-sm text-gray-500">{dog.breed}</p>
                      <p className="text-xs text-[#4F6866] font-medium mt-1">
                        Services: {dog.count}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* ================= RECENT ACTIVITY ================= */}
            <SectionCard title="Recent Activity">
              {recentActivities.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No recent activity available.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity._id}
                      className="flex justify-between items-center bg-gray-50 border border-gray-200 p-4 rounded-xl"
                    >
                      <div>
                        <p className="font-semibold text-[#303A40]">
                          {activity.actionType}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.description}
                        </p>
                        <p className="text-xs text-[#4F6866] mt-1">
                          {new Date(activity.createdAt).toLocaleDateString(
                            "en-GB"
                          )}
                        </p>
                      </div>

                      <div className="px-3 py-1 rounded-full text-xs font-semibold bg-[#D7CD43]/20 text-[#303A40]">
                        Activity
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </>
        )}
      </div>
    </div>
  );
};

/* ================= REUSABLE STAT CARD ================= */
const StatCard = ({ icon, title, value }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
    <div className="p-3 bg-[#4F6866]/10 rounded-xl text-[#4F6866]">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-[#303A40]">{value}</p>
    </div>
  </div>
);

/* ================= SECTION WRAPPER ================= */
const SectionCard = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
    <h2 className="font-semibold text-lg mb-4 text-[#303A40]">
      {title}
    </h2>
    {children}
  </div>
);

export default Dashboard;
