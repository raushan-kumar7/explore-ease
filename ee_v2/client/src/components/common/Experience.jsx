import { Subtitle } from "..";
import { Users, Calendar, Award, MapPin } from "lucide-react";
import { images } from "@/assets";

const ExperienceCard = ({ icon: Icon, count, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-300 group">
    <div className="flex items-start gap-6">
      <div className="p-4 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors duration-300 transform group-hover:scale-110">
        <Icon className="w-8 h-8 text-orange-600 group-hover:text-orange-700" />
      </div>
      <div>
        <h3 className="text-4xl font-bold text-gray-800 mb-2 font-heading tracking-tight">{count}</h3>
        <p className="font-semibold text-gray-800 mb-3 text-lg">{title}</p>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

const Experience = () => {
  const stats = [
    {
      icon: Users,
      count: "10K+",
      title: "Happy Travelers",
      description: "Successfully guided travelers through memorable journeys",
    },
    {
      icon: Calendar,
      count: "15+",
      title: "Years Active",
      description: "Serving travelers with dedication and expertise since 2009",
    },
    {
      icon: Award,
      count: "50+",
      title: "Travel Awards",
      description: "Recognized for excellence in travel and hospitality",
    },
    {
      icon: MapPin,
      count: "100+",
      title: "Destinations",
      description: "Curated experiences across stunning locations",
    },
  ];

  return (
    <section className="px-8 py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <Subtitle Subtitle={"Our Experience"} />
          </div>
          <div className="w-24 h-1.5 bg-orange-500 rounded-full mb-6" />
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
            Delivering exceptional travel experiences with years of expertise
            and dedication to customer satisfaction.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 cursor-pointer">
              {stats.map((stat, index) => (
                <ExperienceCard
                  key={index}
                  icon={stat.icon}
                  count={stat.count}
                  title={stat.title}
                  description={stat.description}
                />
              ))}
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="relative">
              <img
                src={images.experiance}
                alt="experience"
                className="object-contain w-full h-[600px] mix-blend-multiply"
              />
              <div className="absolute -bottom-8 -left-8 bg-orange-500 text-white p-6 rounded-xl shadow-xl transform hover:scale-105 transition-transform duration-300">
                <p className="text-4xl font-bold mb-1">15+</p>
                <p className="text-sm font-medium">Years of Experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;