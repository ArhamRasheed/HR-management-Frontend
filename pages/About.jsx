import React from "react";
import { CheckCircle, Leaf } from "lucide-react";

const About = () => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-xl p-8 border border-green-200">
      <div className="flex items-center mb-6">
        <Leaf className="w-8 h-8 text-green-700" />
        <h2 className="text-3xl font-extrabold text-green-800 ml-3 tracking-wide">
          About HR Management System
        </h2>
      </div>

      <div className="text-gray-700 space-y-6 leading-relaxed">
        <p className="text-lg">
          Welcome to our comprehensive HR Management System — designed to
          simplify HR operations and help organizations manage their most
          valuable asset: <span className="font-semibold">their people</span>.
        </p>

        <div>
          <h3 className="text-2xl font-bold text-green-700 mb-2">
            Our Mission
          </h3>
          <p>
            To deliver innovative HR solutions that enable organizations to
            focus on growth while we manage workforce complexities, compliance,
            and employee engagement.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-green-700 mb-3">
            Key Features
          </h3>
          <ul className="space-y-2">
            {[
              "Comprehensive employee management",
              "Automated leave & attendance tracking",
              "Insurance & benefits administration",
              "Complaint & grievance resolution",
              "Recruitment & candidate management",
              "Department & designation control",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-gray-800 bg-white/60 px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all border border-green-100"
              >
                <CheckCircle className="w-5 h-5 text-green-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-green-700 mb-2">
            Our Commitment
          </h3>
          <p>
            We ensure a secure, user-friendly platform built with the latest
            technologies. Our system adapts to the unique needs of your
            organization while ensuring top-level data protection and smooth
            performance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
