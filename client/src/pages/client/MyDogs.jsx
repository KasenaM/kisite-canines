// src/pages/MyDogs.jsx
import React, { useState, useEffect } from "react";
import { Plus, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { Helmet } from 'react-helmet-async';

const MyDogs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // State for inline name editing
  const [editingNameId, setEditingNameId] = useState(null);
  const [newName, setNewName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  /* ---------- Fetch Dogs Effect ---------- */
  useEffect(() => {
    const fetchDogs = async () => {
      if (!user) return;
      try {
        const res = await axiosInstance.get("/dogs");
        setDogs(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch your dogs. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, [user]);

  /* ---------- Inline Name Update ---------- */
  const handleNameSubmit = async (dogId) => {
    if (!newName.trim()) return;
    setIsUpdating(true);
    try {
      
      await axiosInstance.put(`/dogs/${dogId}`, { name: newName });
      
     
      setDogs(dogs.map(d => d._id === dogId ? { ...d, name: newName } : d));
      setEditingNameId(null);
      setNewName("");
    } catch (err) {
      alert("Failed to update name. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const hasDogs = dogs.length > 0;

  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col">

    <Helmet>
  <title>My Dogs - Kisite Canines</title>
  <meta 
    name="description" 
    content="Manage your registered dogs at Kisite Canines. View profiles, update information, and track your dogs' service history in one place." 
  />
</Helmet>


      {/* ================= Sticky Header ================= */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 w-full shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-8 py-4 max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-[#303A40] truncate">
            My Dogs
          </h1>

          <button
            onClick={() => navigate("/my-dogs/add-dog")}
            className="flex items-center gap-2 bg-[#D7CD43] px-4 py-2 rounded-lg font-semibold text-[#303A40] hover:opacity-90 transition"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Dog</span>
          </button>
        </div>
      </div>

      {/* ================= Page Content ================= */}
      <div className="px-4 sm:px-8 py-2 max-w-[1600px] mx-auto w-full">
        {loading && (
          <div className="flex flex-1 items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 border-4 border-gray-200 border-t-[#D7CD43] rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm font-medium">Loading your dogs...</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="max-w-xl mx-auto mt-10 p-6 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-center">
            {error}
          </div>
        )}

        {!hasDogs && !loading && !error && (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center max-w-xl mx-auto mt-10">
            <h2 className="text-lg font-semibold text-[#303A40] mb-3">No dogs found</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              To access grooming, boarding, training, or any other services, you’ll need to onboard your dog details first.
            </p>
          </div>
        )}

        {hasDogs && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6">
            {dogs.map((dog) => (
              <div
                key={dog._id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                {/* Image Section */}
                <div className="relative w-full aspect-square bg-[#EAEAE8] overflow-hidden p-3">
                  {dog.image ? (
                    <img
                      src={dog.image}
                      alt={dog.breed}
                      className="w-full h-full rounded-xl object-cover transition-transform duration-500 hover:scale-110"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <span className="text-4xl mb-2">🐾</span>
                      <p className="text-xs uppercase font-medium">No Image</p>
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="p-4 flex flex-col flex-grow space-y-1">
                  <div className="flex items-center gap-1 text-base h-8">
                    <span className="font-bold text-[#4F6866]">Name:</span>
                    
                    {editingNameId === dog._id ? (
                      <div className="flex items-center gap-1 flex-1">
                        <input 
                          autoFocus
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          disabled={isUpdating}
                          className="border-b border-[#D7CD43] outline-none text-sm w-full px-1 py-0.5"
                          placeholder="Enter name..."
                        />
                        <button 
                          onClick={() => handleNameSubmit(dog._id)}
                          disabled={isUpdating}
                          className="text-green-600 hover:scale-110 transition disabled:opacity-50"
                        >
                          <Check size={16} strokeWidth={3} />
                        </button>
                        <button 
                          onClick={() => setEditingNameId(null)}
                          disabled={isUpdating}
                          className="text-red-400 hover:scale-110 transition"
                        >
                          <X size={16} strokeWidth={3} />
                        </button>
                      </div>
                    ) : dog.name ? (
                      <span className="font-normal text-black truncate">{dog.name}</span>
                    ) : (
                      <button 
                        onClick={() => {
                          setEditingNameId(dog._id);
                          setNewName("");
                        }}
                        className="text-[10px] uppercase font-black tracking-widest px-3 py-1 bg-[#D7CD43]/20 text-[#303A40] rounded-full hover:bg-[#D7CD43] transition-colors"
                      >
                        Add Name
                      </button>
                    )}
                  </div>
                  
                  <p className="text-sm truncate">
                    <span className="font-bold text-[#4F6866]">Breed</span>:{" "}
                    <span className="font-normal text-black">{dog.breed}</span>
                  </p>
                  
                  <p className="text-sm">
                    <span className="font-bold text-[#4F6866]">Gender</span>:{" "}
                    <span className="font-normal text-black">{dog.gender}</span>
                  </p>
                  
                  <p className="text-sm">
                    <span className="font-bold text-[#4F6866]">Age</span>:{" "}
                    <span className="font-normal text-black">{dog.age}</span>
                  </p>
{/* Actions */}
<div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-gray-100">
  <button
    onClick={() => navigate("/my-dogs/edit-dog", { state: { dog } })}
    className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#4F6866] text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 group w-full"
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-3.5 w-3.5 text-white group-hover:text-white" 
      fill="none" viewBox="0 0 24 24" stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
    <span>Edit</span>
  </button>

  <button
    onClick={() =>
      navigate("/my-services/book-service", {
        state: { from: "my-dogs", selectedDog: dog },
      })
    }
    className="flex items-center justify-center gap-2 bg-[#D7CD43] px-3 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest text-[#303A40] hover:opacity-90 transition active:scale-95 w-full"
  >
    <Plus className="text-[#303A40]" size={14} />
    <span className="truncate">Book Service</span>
  </button>
</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDogs;