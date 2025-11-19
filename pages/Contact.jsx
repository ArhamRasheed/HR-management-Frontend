import { Mail, Phone, MapPin, Clock, Users } from 'lucide-react';
import React from 'react';

const Contact = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8">
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-green-900 mb-4">Get In Touch</h1>
        <p className="text-lg text-green-700">We're here to help and answer any question you might have</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information Cards */}
        <div className="space-y-6">
          {/* Email Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-green-500 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-4 rounded-full">
                <Mail className="w-7 h-7 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Email Us</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <a href="mailto:hr@company.com" className="text-gray-700 hover:text-green-600 transition-colors">
                      k230737@nu.edu.pk
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <a href="mailto:support@company.com" className="text-gray-700 hover:text-green-600 transition-colors">
                      k230838@nu.edu.pk
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phone Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-emerald-500 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-start space-x-4">
              <div className="bg-emerald-100 p-4 rounded-full">
                <Phone className="w-7 h-7 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Call Us</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <a href="tel:+15551234567" className="text-gray-700 hover:text-emerald-600 transition-colors">
                      0398-7654321
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <a href="tel:+15559876543" className="text-gray-700 hover:text-emerald-600 transition-colors">
                      0312-3456789
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-teal-500 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-start space-x-4">
              <div className="bg-teal-100 p-4 rounded-full">
                <MapPin className="w-7 h-7 text-teal-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Visit Us</h3>
                <p className="text-gray-700 leading-relaxed">
                  Fast NUCES<br />
                    National Highway<br />
                  Karachi
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Office Hours & HR Section */}
        <div className="space-y-6">
          {/* Office Hours */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg p-8 text-white">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold">Office Hours</h3>
            </div>
            
            <div className="bg-green bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Everyday</span>
                <span className="text-lg font-bold">24 Hours</span>
              </div>
              <div className="border-t border-white border-opacity-20 pt-4">
                <p className="text-xl font-bold text-center text-green-100">
                  🎉 Party Time! 🎉
                </p>
              </div>
            </div>
          </div>

          {/* HR Department */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-green-500">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">HR Department</h3>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed">
                For any HR-related queries, please reach out during office hours. Our dedicated team is here to assist you with all your human resources needs.
              </p>
              
              <div className="mt-6 flex items-center space-x-2 text-green-700">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold">Available 24/7</span>
              </div>
            </div>
          </div>

          {/* Quick Note */}
          <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-2xl p-6 border border-green-200">
            <p className="text-sm text-gray-600 text-center">
              💚 We typically respond within 24 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Contact;