import React from "react";

const Service = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-4">Our Services</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Discover the various services provided by the Barrackpore Police Commissionerate for public safety and crime prevention.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Emergency Response */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border-l-4 border-blue-600">
              <h3 className="text-xl font-bold mb-3 text-gray-800">Emergency Response</h3>
              <p className="text-gray-600">
                Rapid response to emergency calls including accidents, crimes in progress, and distress situations.
              </p>
            </div>

            {/* Cyber Crime Unit */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border-l-4 border-purple-600">
              <h3 className="text-xl font-bold mb-3 text-gray-800">Cyber Crime Unit</h3>
              <p className="text-gray-600">
                Investigation and support for cybercrimes like online frauds, hacking, and digital harassment.
              </p>
            </div>

            {/* Community Policing */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border-l-4 border-green-600">
              <h3 className="text-xl font-bold mb-3 text-gray-800">Community Policing</h3>
              <p className="text-gray-600">
                Engaging with local communities to build trust, prevent crime, and enhance neighborhood safety.
              </p>
            </div>

            {/* Traffic Management */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border-l-4 border-yellow-500">
              <h3 className="text-xl font-bold mb-3 text-gray-800">Traffic Management</h3>
              <p className="text-gray-600">
                Ensuring smooth traffic flow and enforcing road rules to prevent accidents and congestion.
              </p>
            </div>

            {/* Criminal Investigation */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border-l-4 border-red-600">
              <h3 className="text-xl font-bold mb-3 text-gray-800">Criminal Investigation</h3>
              <p className="text-gray-600">
                In-depth investigation into criminal cases to ensure justice and maintain law and order.
              </p>
            </div>

            {/* Women & Child Support */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border-l-4 border-pink-600">
              <h3 className="text-xl font-bold mb-3 text-gray-800">Women & Child Support</h3>
              <p className="text-gray-600">
                Dedicated units to protect and assist women and children affected by abuse or exploitation.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Service;