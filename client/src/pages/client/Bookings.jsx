// src/pages/BookService.jsx
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import ServiceForm from "../../components/services/ServiceForm";

const Bookings = () => {
  const [params] = useSearchParams();
  const dogId = params.get("dogId");

  const [dogs, setDogs] = useState([]);
  const [selectedDogs, setSelectedDogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get("/api/dogs").then((res) => {
      setDogs(res.data || []);
      if (dogId) {
        const dog = res.data.find(d => d._id === dogId);
        setSelectedDogs(dog ? [dog] : []);
      }
      setLoading(false);
    });
  }, [dogId]);

  if (loading) return <p>Loading...</p>;

  return (
    <ServiceForm
      dogs={dogs}
      selectedDogs={selectedDogs}
      setSelectedDogs={setSelectedDogs}
      mode={dogId ? "single" : "multi"}
    />
  );
};

export default Bookings;
