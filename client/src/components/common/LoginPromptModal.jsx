import React from "react";
import { useNavigate } from "react-router-dom";

function LoginPromptModal({ visible, onClose, message }) {
  const navigate = useNavigate();

  if (!visible) return null;

  const handleRedirect = () => {
    onClose();
    navigate("/login");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
        <h2 className="text-xl font-semibold text-[#303A40] mb-4">Login Required</h2>
        <p className="text-[#4F6866] mb-6">{message}</p>

        {/* Button container*/}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-[#303A40] font-semibold px-6 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleRedirect}
            className="bg-[#D7CD43] text-[#303A40] px-6 py-2 rounded hover:bg-[#C5BC39] transition"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPromptModal;
