import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-[#303A40] text-[#EAEAE6]">
      {/* Top Footer Section */}
      <section className="px-6 py-10 flex flex-wrap justify-center md:justify-between gap-8 text-sm text-center md:text-left">
        {/* Logo and Tagline */}
        <div className="w-full md:w-64 flex flex-col items-center md:items-start">
          <h1 className="text-lg font-semibold text-[#CFBE3A] mb-2">Kisite Canines</h1>
          <Link to="/">
            <img src="/images/doglogo.png" alt="Kisite Canines Logo" className="w-20 mb-2" />
          </Link>
          <p className="max-w-xs">
            Trusted care, loyal companions – where dogs thrive.
          </p>
        </div>

        {/* Quick Links */}
        <div className="w-full md:w-40 flex flex-col items-center md:items-start">
          <h1 className="text-lg font-semibold text-[#CFBE3A] mb-2">Quick Links</h1>
          <ul className="flex flex-col gap-1">
            <li><Link to="/" className="hover:text-[#CFBE3A]">Home</Link></li>
            <li><Link to="/about-us" className="hover:text-[#CFBE3A]">About Us</Link></li>
            <li><Link to="/our-listings" className="hover:text-[#CFBE3A]">Our Listings</Link></li>
            <li><Link to="/training" className="hover:text-[#CFBE3A]">Training</Link></li>
            <li><Link to="/grooming" className="hover:text-[#CFBE3A]">Grooming</Link></li>
            <li><Link to="/boarding" className="hover:text-[#CFBE3A]">Boarding</Link></li>
            <li><Link to="/contact-us" className="hover:text-[#CFBE3A]">Contact Us</Link></li>
          </ul>
        </div>

        {/* Address */}
        <div className="w-full md:w-60 flex flex-col items-center md:items-start">
          <h1 className="text-lg font-semibold text-[#CFBE3A] mb-2">Our Address</h1>
          <p className="flex items-start gap-2 max-w-xs justify-center md:justify-start">
            <FaMapMarkerAlt className="mt-1" />
            <span>
              Community Road, Syokimau<br />
              Machakos County, Kenya
            </span>
          </p>
        </div>

        {/* Contacts */}
        <div className="w-full md:w-60 flex flex-col items-center md:items-start">
          <h1 className="text-lg font-semibold text-[#CFBE3A] mb-2">Our Contacts</h1>
          <p className="flex items-center gap-2">
            <FaEnvelope />
            <a href="mailto:info@kisitecanines.com" className="hover:text-[#CFBE3A]">
              info@kisitecanines.com
            </a>
          </p>
          <p className="flex items-center gap-2 mt-2">
            <FaPhoneAlt />
            +254 700 000 000
          </p>
        </div>

        {/* Socials */}
        <div className="w-full md:w-40 flex flex-col items-center md:items-start">
          <h1 className="text-lg font-semibold text-[#CFBE3A] mb-2">Our Socials</h1>
          <div className="flex gap-4 text-xl justify-center">
            <a href="https://www.instagram.com/kisitecanines" target="_blank" rel="noopener noreferrer" className="hover:text-[#CFBE3A]">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://www.facebook.com/kisitecanines" target="_blank" rel="noopener noreferrer" className="hover:text-[#CFBE3A]">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="https://www.twitter.com/kisitecanines" target="_blank" rel="noopener noreferrer" className="hover:text-[#CFBE3A]">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
          </div>
        </div>
      </section>

      {/* Bottom Footer Section */}
      <section className="bg-[#303A40] text-center py-4 text-xs border-t border-[#4F6866]">
        <p>© {new Date().getFullYear()} Kisite Canines. All rights reserved. Designed by Melvin.</p>
      </section>
    </footer>
  );
}

export default Footer;
