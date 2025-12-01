// src/pages/Contact/ContactUs.jsx
import React from 'react';
import { Mail, Linkedin, Instagram, Heart } from 'lucide-react';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-primary-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        {/* Circles pattern */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-50 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-primary-700 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-48 h-48 bg-primary-100 rounded-full blur-3xl"></div>
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(134, 134, 172, 0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contact <span className="text-primary-50">Us</span>
          </h1>
          <div className="w-24 h-1 bg-primary-50 mx-auto rounded-full"></div>
        </div>

        {/* Main Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-primary-700/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 border border-primary-500/30">
            {/* Message */}
            <div className="text-center mb-10">
              <div className="bg-primary-500/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="text-primary-50 w-10 h-10" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Having Issues?
              </h2>
              <p className="text-primary-100 text-lg leading-relaxed">
                If you're facing any issues while using this application, feel free to reach out to me. I'd love to hear your feedback and help resolve any problems!
              </p>
            </div>

            {/* Email Section */}
            <div className="bg-primary-900/50 rounded-xl p-6 mb-8">
              <p className="text-primary-100 text-center mb-3">Email me at:</p>
              <a 
                href="mailto:armaangogoi2004@gmail.com"
                className="flex items-center justify-center gap-3 text-white hover:text-primary-50 transition-colors group"
              >
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-xl font-semibold">armaangogoi2004@gmail.com</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="border-t border-primary-500/30 pt-8">
              <p className="text-primary-100 text-center mb-6">Or connect with me on:</p>
              <div className="flex justify-center gap-6">
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/armaan-gogoi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-2"
                >
                  <div className="bg-primary-500 hover:bg-[#0077B5] w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#0077B5]/30">
                    <Linkedin className="text-white w-8 h-8" />
                  </div>
                  <span className="text-primary-100 text-sm group-hover:text-white transition-colors">LinkedIn</span>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/gogoiarmaan/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-2"
                >
                  <div className="bg-primary-500 hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#FD1D1D]/30">
                    <Instagram className="text-white w-8 h-8" />
                  </div>
                  <span className="text-primary-100 text-sm group-hover:text-white transition-colors">Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-10">
            <p className="text-primary-100 flex items-center justify-center gap-2">
              Made with <Heart className="w-5 h-5 text-red-400 fill-red-400" /> by Loceal Team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
