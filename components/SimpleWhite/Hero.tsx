// pages/index.tsx
import { FaGithub, FaLinkedin, FaChevronDown, FaFile } from 'react-icons/fa';
import { MdEmail, MdLocationOn } from 'react-icons/md';
import type { NextPage } from 'next';
import Navbar from './Navbar';
import AnimatedButton from './AnimatedButton';
import EditButton from '@/app/portfolio/components/EditButton';
import { Button } from '../ui/button';

const Hero: NextPage = () => {
  return (
    <div className="min-h-screen bg-white simple-white">
     
      <Navbar />

      <div className="flex justify-center items-end min-h-screen">
        <div className="max-w-[90%] mx-auto px-4 pb-20 sm:px-6 lg:px-8">
          <main className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 ">
              <h1 className="text-7xl font-extrabold text-gray-900 mb-3">John Doe</h1>
              <h2 className="text-2xl font-bold text-gray-600 mb-4">Full Stack Developer</h2>
              <p className="text-lg font-medium text-gray-700 mb-10">
                I build exceptional and accessible digital experiences for the web.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4 mb-16">
                <a 
                  href="https://github.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-16 h-16 hover:scale-[1.2] duration-200 ease-in rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-2xl  transition-shadow"
                >
                  <FaGithub className="w-8 h-8 text-gray-900" />
                </a>
                <a 
                  href="https://linkedin.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-16 h-16 hover:scale-[1.2] duration-200 ease-in rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-2xl  transition-shadow"
                >
                  <FaLinkedin className="w-8 h-8 text-gray-900" />
                </a>
              </div>
            </div>

            {/* Right Column - About */}
            <div className="lg:col-span-2">
              <div
            className="relative bg-gradient-to-br from-white to-primary-100  p-6 rounded-lg shadow-lg border-2 border-primary-100 hover:border-black/20 border-transparent transition-all duration-300">            <h2 className="text-4xl font-bold text-gray-900 mb-6">About Me</h2>
                
                <div className="flex items-center mb-4">
                  <MdEmail className="w-5 h-5 text-gray-500 mr-3" />
                  <a href="mailto:john@example.com" className="text-gray-700 text-xl font-medium hover:text-gray-900">
                    john@example.com
                  </a>
                </div>
                
                <div className="flex items-center mb-8">
                  <MdLocationOn className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="text-gray-700 text-lg font-medium">New York, USA</span>
                </div>
                
                <p className="text-gray-700 text-md">
                  With a passion for both technology and design, I develop scalable, high-performance 
                  applications that captivate users and drive success.
                </p>
              </div>

              {/* Resume Download Button */}
              <div className='ml-32'>
              <AnimatedButton
              text="Download Resume"
              icon={<FaFile size={20} />}
              link={""}
              />
              <EditButton  sectionName="hero"/>
              </div>

            </div>
          </main>

          {/* Scroll Down Indicator */}
          <div className="flex justify-center">
            <button className="rounded-full w-12 h-12 flex items-center justify-center border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors">
              <FaChevronDown />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;