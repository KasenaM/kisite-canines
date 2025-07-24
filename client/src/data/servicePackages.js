// src/data/servicePackages.js

const servicePackages = {
  Training: [
  {
    name: "Puppy Basics",
    icon: "🐶",
    description: "Housebreaking, crate training, name response, early socialization.",
    details: "2 Weeks – KES 6,000",
    price: "KES 6,000",
    note: "Ideal for dogs under 5 months",
  },
  {
    name: "Obedience Training",
    icon: "🎓",
    description: "Commands like sit, stay, recall, leash walking, and calm behavior.",
    details: "4 Weeks – KES 12,000",
    price: "KES 12,000",
    note: "Recommended for all dogs",
  },
  {
    name: "Behavioral Correction",
    icon: "🚫",
    description: "Solutions for barking, aggression, anxiety, and destructive habits.",
    details: "4–6 Weeks – from KES 15,000",
    price: "KES 15,000",
    note: "Custom plans per case",
  },
  {
    name: "Advanced Training",
    icon: "🏅",
    description: "Off-leash recall, distance commands, and complex tasks or tricks.",
    details: "6+ Weeks – KES 20,000+",
    price: "KES 20,000",
    note: "For advanced learners",
  },
  {
    name: "Service Dog Prep",
    icon: "🐕‍🦺",
    description: "Foundational tasks and focus training for working or therapy dogs.",
    details: "Custom Plan – Inquire",
    price: "KES 0", // or leave empty if truly unquantifiable
    note: "Assessment required",
  },
],

  Grooming: [
    {
      name: "Basic Wash",
      icon: "🧼",
      description: "Gentle bath, blow-dry, ear wipe, and paw wash — perfect for quick cleanups.",
      details: "Duration: 30 mins",
      price: "KES 1,500",
    },
    {
      name: "Full Groom",
      icon: "✂️",
      description: "Bath, brushing, coat trimming or haircut, nail clipping, and ear cleaning.",
      details: "Duration: 1.5 hours",
      price: "KES 3,500",
    },
    {
      name: "Spa Package",
      icon: "🛁",
      description: "Full groom + coat conditioning, paw balm massage, fresh breath spray.",
      details: "Duration: 2 hours",
      price: "KES 5,000",
    },
    {
      name: "De-shedding Treatment",
      icon: "🐾",
      description: "Specialized tools to reduce loose hair & promote healthy coat.",
      details: "Duration: 1–1.5 hours",
      price: "KES 4,000",
    },
    {
      name: "Flea & Tick Treatment",
      icon: "🦟",
      description: "Medicated bath + manual removal to keep dog itch-free & safe.",
      details: "Duration: 1 hour",
      price: "KES 3,000",
    },
    {
      name: "Breed-Specific Styling",
      icon: "🐩",
      description: "Tailored cuts for specific breeds — show-level finish every time.",
      details: "Duration: 2+ hours",
      price: "From KES 6,000",
    },
  ],
  Boarding: [
    {
      name: "Standard Suite",
      icon: "🏡",
      description: "Cozy crate with soft bedding, designed for comfort and safety.",
      features: ["2 play sessions/day", "Clean crate & soft mat"],
      price: "KES 1,500/night",
    },
    {
      name: "Deluxe Suite",
      icon: "🛏️",
      description: "Larger space with plush bedding and personal attention.",
      features: ["Daily walks", "Extra playtime", "Private resting area"],
      price: "KES 3,000/night",
    },
    {
      name: "Private Room",
      icon: "🚪",
      description: "Solo lodging with a home-like setup — perfect for anxious or senior dogs.",
      features: ["One-on-one care", "Routine customization", "Quiet environment"],
      price: "KES 4,500/night",
    },
    {
      name: "Outdoor Cabin",
      icon: "🌲",
      description: "Shaded kennel with nature access for outdoor-loving dogs.",
      features: ["Outdoor naps", "Secure fencing", "Morning hikes"],
      price: "KES 3,800/night",
    },
    {
      name: "Luxury Suite",
      icon: "✨",
      description: "Premium suite with webcam access, orthopedic bedding, aromatherapy.",
      features: ["Webcam", "Soothing music", "Night light"],
      price: "KES 6,000/night",
    },
    {
      name: "Puppy Play Den",
      icon: "🐾",
      description: "Safe padded play area designed specifically for puppies.",
      features: ["Puppy-proofed space", "Gentle play", "Hourly check-ins"],
      price: "KES 3,200/night",
    },
  ],
};

export default servicePackages;
