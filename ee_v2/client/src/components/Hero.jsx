import React from "react";
import { images, videos } from "@/assets";
import { Subtitle } from ".";

const Hero = () => {
  return (
    <section className="p-4 md:p-8 flex flex-col md:flex-row justify-between md:mx-20 items-center">
      {/* Left Side */}
      <div className="mt-5 max-w-2xl md:w-1/2">
        {/* Subtitle */}
        <div className="flex items-center gap-2">
          <Subtitle Subtitle={"Know before you Go"} />
          <span>
            <img src={images.worldIcon} alt="world icon" className="w-8 h-8" />
          </span>
        </div>
        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-heading font-bold mt-8 leading-tight">
          Traveling opens the door to creating{" "}
          <span className="text-orange-400">memories</span>
        </h1>
        <p className="text-gray-400 mt-5 text-left text-lg font-body">
          Traveling unlocks the gateway to cherished moments, weaving a tapestry
          of memories. Each journey paints a unique canvas of experiences,
          fostering connections, and enriching lives with unforgettable
          adventures and stories to treasure.
        </p>
      </div>

      {/* Mobile Video */}
      <div className="md:hidden w-full mt-8">
        <div className="w-full h-64 bg-gray-300 border border-yellow-400 rounded-lg overflow-hidden">
          <video
            src={videos.heroVideo}
            className="object-cover w-full h-full rounded-lg"
            autoPlay
            muted
            loop
            playsInline
            controls
          />
        </div>
      </div>

      {/* Desktop Gallery - Hidden on mobile, visible on md and up */}
      <div className="hidden md:flex gap-5 ml-8 mt-5 md:w-1/2">
        <div className="w-64 h-96 bg-gray-300 border border-yellow-400 rounded-lg overflow-hidden">
          <div className="w-full h-full">
            <img
              src={images.heroImg1}
              alt="img1"
              className="object-cover w-full h-full rounded-lg transition-transform duration-300 hover:scale-110 cursor-pointer"
            />
          </div>
        </div>
        <div className="w-64 h-96 bg-gray-300 border border-yellow-400 rounded-lg overflow-hidden mt-10">
          <video
            src={videos.heroVideo}
            className="object-cover w-full h-full rounded-lg cursor-pointer"
            autoPlay
            muted
            loop
            playsInline
            controls
          />
        </div>
        <div className="w-64 h-96 bg-gray-300 border border-yellow-400 rounded-lg overflow-hidden mt-20">
          <div className="w-full h-full">
            <img
              src={images.heroImg2}
              alt="img3"
              className="object-cover w-full h-full rounded-lg transition-transform duration-300 hover:scale-110 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;