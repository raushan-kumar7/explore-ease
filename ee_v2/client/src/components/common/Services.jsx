import { Cloud, Map, Compass } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Cloud className="w-12 h-12 text-orange-500" />,
      title: "Calculate Weather",
      description: "Likely provides functionality to calculate and display weather forecasts, aiding users in effective travel planning and preparation."
    },
    {
      icon: <Map className="w-12 h-12 text-orange-500" />,
      title: "Best Tour Guide",
      description: "Expert tour guides with deep local knowledge to ensure you get the most authentic and enriching travel experience possible."
    },
    {
      icon: <Compass className="w-12 h-12 text-orange-500" />,
      title: "Customization",
      description: "Personalized travel itineraries tailored to your preferences, ensuring every journey matches your unique travel style."
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto lg:ml-20 lg:mr-20">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          {/* Left Section - Headers */}
          <div className="lg:w-1/3 text-center">
            <h5 className="text-orange-500 font-medium text-lg mb-3 font-subtitle">
              What we Serve
            </h5>
            <h1 className="text-4xl font-bold font-heading text-gray-800 leading-tight">
              We offer our
              <br />
              best services
            </h1>
            <div className="w-20 h-1 bg-orange-500 mt-6 mx-auto" />
          </div>

          {/* Right Section - Service Cards */}
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6 lg:mr-32 cursor-pointer px-4 lg:px-0">
            {services.map((service, index) => (
              <div 
                key={index}
                className="group p-8 border-b border-r border-yellow-400 rounded-lg hover:bg-white hover:shadow-xl transition-all duration-300 "
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 transform group-hover:-translate-y-2 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {service.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;