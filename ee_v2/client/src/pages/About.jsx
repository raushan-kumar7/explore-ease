
import { images } from "@/assets";
import { Experience, Gallery, Newsletter, Subtitle } from "@/components";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header Section */}
      <div className="flex justify-center mb-12">
        <Subtitle Subtitle="About Us" />
      </div>

      {/* Main Content Section */}
      <section className="mb-20 ml-20 mr-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <p className="font-body text-lg leading-relaxed text-gray-800 text-justify">
              Experience the pinnacle of travel planning with Travel World.
              Seamlessly navigate through a comprehensive array of destinations,
              accommodations, and activities, meticulously tailored to your
              preferences. Delve into exhilarating adventures or luxuriate in
              serene retreats, knowing every detail is meticulously curated.
              Explore iconic landmarks, immerse yourself in diverse cultures,
              and create timeless memories. With our robust booking platform
              ensuring secure transactions, your journey is not only effortless
              but also unforgettable. Begin your next expedition with confidence
              and embark on a voyage of unparalleled discovery today.
            </p>
          </div>

          {/* Image Container */}
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <img
              src={images.about}
              alt="Travel experiences with Travel World"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <Experience />

      {/* Gallery Section */}
      <Gallery/>

      {/* Newsletter Section */}
      <div className="mt-20">
        <Newsletter />
      </div>
    </div>
  );
};

export default About;
