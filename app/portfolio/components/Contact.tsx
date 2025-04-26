import React from 'react';
import { Mail, Github, Linkedin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="py-16 px-4 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="my-16 transition-all duration-700">
          <h1 className="text-5xl font-bold mb-4 text-center text-green-400">Let's Work Together!</h1>
          <p className="text-xl text-gray-300 text-center mb-16">
            Interested in collaborating, hiring, or just having a chat? Reach out to me on your favorite platform!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Fiverr Card */}
          <div className="bg-stone-900/60 cursor-pointer p-8 rounded-lg flex flex-col items-center justify-center border border-gray-700 hover:border-green-400 transition-all duration-300 shadow-lg hover:shadow-green-400/20">
            <div className="text-green-400 text-2xl font-bold mb-2">Fiverr</div>
            <p className="text-gray-300 text-center">Hire me on Fiverr for your next project!</p>
          </div>

          {/* Email Card */}
          <div className="bg-stone-900/60 cursor-pointer p-8 rounded-lg flex flex-col items-center justify-center border border-gray-700 hover:border-green-400 transition-all duration-300 shadow-lg hover:shadow-green-400/20">
            <Mail className="text-green-400 w-8 h-8 mb-3" />
            <div className="text-white text-xl font-bold mb-2">Email</div>
            <p className="text-gray-300 text-center">pritambose040@gmail.com</p>
          </div>

          {/* LinkedIn Card */}   
          <div className="bg-stone-900/60 cursor-pointer p-8 rounded-lg flex flex-col items-center justify-center border border-gray-700 hover:border-green-400 transition-all duration-300 shadow-lg hover:shadow-green-400/20">
            <Linkedin className="text-green-400 w-8 h-8 mb-3" />
            <div className="text-white text-xl font-bold mb-2">LinkedIn</div>
            <p className="text-gray-300 text-center">@pritambose0</p>
          </div>

          {/* GitHub Card */}
          <div className="bg-stone-900/60 cursor-pointer p-8 rounded-lg flex flex-col items-center justify-center border border-gray-700 hover:border-green-400 transition-all duration-300 shadow-lg hover:shadow-green-400/20">
            <Github className="text-green-400 w-8 h-8 mb-3" />
            <div className="text-white text-xl font-bold mb-2">GitHub</div>
            <p className="text-gray-300 text-center">@pritambose0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;