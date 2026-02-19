import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DogForm from "../../components/dogs/DogForm";

const EditDog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Data passed from the Edit button: navigate('/my-dogs/edit-dog', { state: { dog } })
  const dogToEdit = location.state?.dog;

  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
    if (!dogToEdit) navigate("/my-dogs"); // Redirect if no data found
  }, [user, dogToEdit, navigate]);

  if (!dogToEdit) return null;

  // Split age (e.g., "5 Years") back into value and unit for the form
  const [val, unit] = dogToEdit.age.split(" ");

  const formattedDog = {
    ...dogToEdit,
    ageValue: val,
    ageUnit: unit || "Years"
  };

  return <DogForm mode="edit" initialData={formattedDog} />;
};

export default EditDog;