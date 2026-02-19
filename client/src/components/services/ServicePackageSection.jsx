
import React from "react";
import servicePackages from "../../data/servicePackages";

function ServicePackageSection({ service }) {
  const packages = servicePackages[service];

  const getIntroText = () => {
    switch (service) {
      case "Training":
        return "Choose a program that fits your dog’s age, behavior, and goals. All programs include a free consultation.";
      case "Grooming":
        return "Tailored grooming packages to match your dog’s breed, coat, and needs — from quick washes to spa days.";
      case "Boarding":
        return "Find the perfect accommodation for your dog, from cozy crates to luxury suites — all with personalized care.";
      default:
        return "";
    }
  };

  return (
<section className="px-6 py-16 bg-gray-50 text-center">
  <div
    className="max-w-5xl mx-auto mb-12"
    data-aos="fade-up"
    data-aos-duration="1000"
  >
    <h2 className="text-3xl font-bold text-gray-800 mb-4">{`Our ${service} Packages`}</h2>
    <p className="text-gray-600 text-lg">{getIntroText()}</p>
  </div>

  <div
    className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
    data-aos="fade-up"
    data-aos-delay="200"
    data-aos-duration="800"
  >
    {packages.map((pkg, idx) => (
      <div
        key={idx}
        className="bg-white rounded-lg shadow-md p-6 text-left transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
        data-aos="zoom-in"
        data-aos-delay={idx * 100}
        data-aos-duration="600"
      >
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <span className="text-2xl">{pkg.icon}</span>
          {pkg.name}
        </h3>

        <p className="text-gray-700 mb-3">{pkg.description}</p>

        {pkg.features && (
          <ul className="list-disc list-inside text-sm text-gray-600 mb-3">
            {pkg.features.map((feat, i) => (
              <li key={i}>{feat}</li>
            ))}
          </ul>
        )}

        <div className="text-sm text-gray-700 space-y-1 mt-4">
          {pkg.details && <p><strong>{pkg.details}</strong></p>}
          {pkg.price && <p><strong>Price:</strong> {pkg.price}</p>}
          {pkg.note && <p className="italic text-gray-500">{pkg.note}</p>}
        </div>
      </div>
    ))}
  </div>
</section>

  );
}

export default ServicePackageSection;
