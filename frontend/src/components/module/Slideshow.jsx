import React, { useState, useEffect } from "react";

export default function Slideshow({ slides = [], darkMode = true, containerHeight = "80vh" }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides.length) return null;

  const { image, title, subtitle } = slides[currentIndex];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: containerHeight }} // lock container height
    >
      {/* Image fills the container */}
      <img
        src={image}
        alt={`slide-${currentIndex}`}
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Logo */}
      <div
        className={`absolute top-5 left-5 px-3 py-1 rounded-lg font-bold text-lg ${
          darkMode ? "bg-black text-[#BDD63B]" : "bg-white text-[#1E1C29]"
        }`}
      >
        Insight - By BCI Media
      </div>

      {/* Caption */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
        <p
          className={`px-3 py-1 rounded-lg font-bold text-lg ${
            darkMode ? "bg-black text-[#BDD63B]" : "bg-white text-[#1E1C29]"
          }`}
        >
          {title}
          <br />
          {subtitle}
        </p>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`w-2 h-2 rounded-full ${
              idx === currentIndex
                ? darkMode
                  ? "bg-[#BDD63B]"
                  : "bg-[#1E1C29]"
                : "bg-white/40"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}
