// frontend/src/components/module/Slideshow.jsx
// DONE

// SLIDESHOW
// IMPORT
import React, { useState, useEffect } from "react";

// EXPORT SLIDESHOW IMAGES
export const introSlides = [
  {
    image: "/slideshow_images/winter-at-the-strater.jpg",
    title: "Photo Gallery App",
    subtitle: "For all BCI users",
  },
  {
    image: "/slideshow_images/durango_road.jpg",
    title: "Share Images",
    subtitle: "Stay connected",
  },
  {
    image: "/slideshow_images/durango_train.jpg",
    title: "Data Insights",
    subtitle: "Drive decisions",
  },
];

// EXPORT SLIDESHOW
export default function Slideshow({ slides = [], darkMode = true, containerHeight = "80vh" }) {
  // STATE
  const [currentIndex, setCurrentIndex] = useState(0);
  const { image, title, subtitle } = slides[currentIndex];

  // SLIDESHOW TRANSITION EFFECT
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides.length) return null;

// RETURN
  return (

    // SLIDESHOW CONTAINER
    <div
      className="relative w-full h-full overflow-hidden"
      // style={{ height: containerHeight }} // lock container height
    >
      {/* IMAGE FILL */}
      <img
        src={image}
        alt={`slide-${currentIndex}`}
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* LOGO */}
      <div
        className={`absolute top-5 left-5 px-3 py-3 rounded-lg font-bold text-lg shadow-lg px-5  ${
          darkMode ? "bg-gradient-to-r from-slate-200 via-zinc-200 to-slate-300 text-black" : "bg-gradient-to-r from-slate-900 via-slate-600 to-zinc-900 text-white" 
        }`}
      >
        {/* Logo Image */}
        <img
          src="/public/bci-favicon-green.ico"
          alt="Logo"
          className="inline-block w-6 h-6 mr-2 align-middle"
        />
        {/* Text */}
        INSIGHT - BCI Media.
      </div>

      {/* CAPTION */}
      <div className={`w-[65%] absolute bottom-10 left-1/2 -translate-x-1/2 text-center rounded-lg ${
          darkMode ? "bg-gradient-to-r from-slate-200 via-zinc-200 to-slate-300 text-black" : "bg-gradient-to-r from-slate-900 via-slate-600 to-zinc-900 text-white" 
        }`}>
      
      
      
        <p
          className={`px-3 py-4 font-bold text-lg  ${
            darkMode ? "text-black" : "text-white"
          }`}
        >
          {title}
          <br />
          {subtitle}
        </p>
      </div>

      {/* DOTS */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`w-2 h-2 rounded-full ${
              idx === currentIndex
                ? "bg-[#BDD63B]" // ACTIVE
                : "bg-gray-400" 
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}
