// src/pages/Story/OurStory.jsx
import React from 'react';
import { Code, FileText, Palette, Layout, Heart, Users, Shield, Leaf, Sparkles } from 'lucide-react';

const teamMembers = [
  {
    name: 'Armaan Gogoi',
    role: 'Full Stack Developer & CEO',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    description: 'Visionary leader who architected the entire platform from ground up.'
  },
  {
    name: 'Aryaman Shukla',
    role: 'Requirement Engineer',
    icon: FileText,
    color: 'from-purple-500 to-pink-500',
    description: 'Translates user needs into actionable technical specifications.'
  },
  {
    name: 'Rhythm Garg',
    role: 'Frontend Designer',
    icon: Palette,
    color: 'from-orange-500 to-red-500',
    description: 'Crafts beautiful, responsive interfaces that users love.'
  },
  {
    name: 'Garv Mahajan',
    role: 'UI/UX Designer',
    icon: Layout,
    color: 'from-green-500 to-teal-500',
    description: 'Creates intuitive user experiences and seamless interactions.'
  }
];

const values = [
  {
    icon: Users,
    title: 'Community First',
    description: 'We believe in strengthening local bonds and empowering neighborhood commerce.'
  },
  {
    icon: Shield,
    title: 'Trust & Safety',
    description: 'Verified sellers, OTP transactions, and secure face-to-face meetings.'
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    description: 'No shipping means less carbon footprint. Good for you, good for the planet.'
  }
];

const OurStory = () => {
  return (
    <div className="min-h-screen bg-primary-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-20 w-72 h-72 bg-primary-50 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-10 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-1/4 w-80 h-80 bg-primary-700 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-primary-100 rounded-full blur-3xl"></div>
        
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(134, 134, 172, 0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-500/30 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-primary-50" />
            <span className="text-primary-100 text-sm font-medium">Est. 2025</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The Story Behind <span className="text-primary-50">Loceal</span>
          </h1>
          <div className="w-24 h-1 bg-primary-50 mx-auto rounded-full"></div>
        </div>

        {/* Origin Story */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-primary-700/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-primary-500/30">
            <div className="prose prose-lg text-center">
              <p className="text-primary-100 text-lg md:text-xl leading-relaxed mb-6">
                In 2025, four passionate students came together with a shared vision — 
                <span className="text-white font-semibold"> to revolutionize how local communities buy and sell goods</span>. 
                We noticed a gap: online marketplaces were convenient but impersonal, 
                while local shops struggled to reach nearby customers.
              </p>
              <div className="bg-primary-900/50 rounded-xl p-6 my-8 border-l-4 border-primary-50">
                <p className="text-white text-xl md:text-2xl font-medium italic">
                  "What if we could combine the trust of face-to-face transactions 
                  with the convenience of digital discovery?"
                </p>
              </div>
              <p className="text-primary-100 text-lg md:text-xl leading-relaxed">
                We're not just building an app — we're <span className="text-white font-semibold">building bridges between neighbors</span>. 
                No middlemen, no shipping delays, no hidden fees. 
                Just real people meeting real people, supporting their local community.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="text-center mb-20">
          <div className="inline-block bg-gradient-to-r from-primary-500 to-primary-700 p-1 rounded-2xl">
            <div className="bg-primary-900 rounded-xl px-8 py-6">
              <p className="text-primary-50 text-sm uppercase tracking-widest mb-2">Our Mission</p>
              <p className="text-white text-2xl md:text-3xl font-bold">
                "Empowering local commerce, one connection at a time."
              </p>
            </div>
          </div>
        </div>

        {/* Meet The Team */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Meet The <span className="text-primary-50">Team</span>
          </h2>
          <p className="text-primary-100 text-center mb-12 max-w-2xl mx-auto">
            The brilliant minds working tirelessly to bring Loceal to life
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="group bg-primary-700/60 backdrop-blur-sm rounded-2xl p-6 border border-primary-500/30 hover:border-primary-50/50 transition-all duration-300 hover:-translate-y-2"
              >
                {/* Avatar */}
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <member.icon className="w-10 h-10 text-white" />
                </div>
                
                {/* Info */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-primary-50 font-medium text-sm mb-3">{member.role}</p>
                  <p className="text-primary-200 text-sm">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Our <span className="text-primary-50">Values</span>
          </h2>
          <p className="text-primary-100 text-center mb-12 max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-primary-700/40 backdrop-blur-sm rounded-2xl p-8 border border-primary-500/30 text-center hover:bg-primary-700/60 transition-colors"
              >
                <div className="bg-primary-500/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary-50" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-primary-200">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-primary-100 flex items-center justify-center gap-2">
            Made with <Heart className="w-5 h-5 text-red-400 fill-red-400" /> in India
          </p>
        </div>
      </div>
    </div>
  );
};

export default OurStory;
