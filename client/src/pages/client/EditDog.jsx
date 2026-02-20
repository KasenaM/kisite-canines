import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DogForm from "../../components/dogs/DogForm";

const EditDog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  
  const dogToEdit = location.state?.dog;

  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
    if (!dogToEdit) navigate("/my-dogs");
  }, [user, dogToEdit, navigate]);

  if (!dogToEdit) return null;

  
  const [val, unit] = dogToEdit.age.split(" ");

  const formattedDog = {
    ...dogToEdit,
    ageValue: val,
    ageUnit: unit || "Years"
  };

  return <DogForm mode="edit" initialData={formattedDog} />;
};

export default EditDog;