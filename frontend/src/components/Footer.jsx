import React from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white border-t py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Left */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-semibold text-black">CodeHub</h2>
          <p className="text-sm text-gray-600 mt-1">
            Code. Learn. Innovate. © {new Date().getFullYear()}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Made by Bhavesh Tripathi & Yash Kirola
          </p>
        </div>

        {/* Right - Social Icons */}
        <div className="flex gap-5 text-gray-600">
          <a
            href="https://github.com/bhaveshTripathi3112/CodeNest"
            target="_blank"
            rel="noreferrer"
            className="hover:text-black"
          >
            <FaGithub size={20} />
          </a>

          <a
            href="https://linkedin.com/in/bhavesh-tripathi-a69483309/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-black"
          >
            <FaLinkedin size={20} />
          </a>

          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-black"
          >
            <FaTwitter size={20} />
          </a>

          <a
            href="mailto:bhaveshtripathi3112@gmail.com"
            className="hover:text-black"
          >
            <FaEnvelope size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;