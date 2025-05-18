import {
  Experience,
  Gallery,
  Hero,
  Newsletter,
  SearchBar,
  Services,
  Testimonial,
} from "@/components";
import React from "react";

const Home = () => {
  return (
    <div className="-z-50">
      <Hero />
      <SearchBar />
      <Services />
      {/** Featured Tour */}
      <Experience />
      {/* <Gallery/> */}
      <Testimonial />
      <Newsletter />
    </div>
  );
};

export default Home;