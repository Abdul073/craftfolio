import React from "react";

const Experience = () => (
  <div className="space-y-8">
    <h2 className="text-4xl font-bold text-white mb-8">Work Experience</h2>
    <div className="space-y-6">
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
        <h3 className="text-2xl font-semibold text-white mb-3">Senior Software Engineer</h3>
        <p className="text-orange-400 mb-4 font-medium">Tech Company • 2023 - Present</p>
        <p className="text-gray-300 leading-relaxed">
          Led development of scalable web applications, mentored junior developers, and improved system performance by 40%. Architected microservices solutions and implemented CI/CD pipelines.
        </p>
      </div>
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
        <h3 className="text-2xl font-semibold text-white mb-3">Full-Stack Developer</h3>
        <p className="text-orange-400 mb-4 font-medium">Startup Inc • 2022 - 2023</p>
        <p className="text-gray-300 leading-relaxed">
          Built end-to-end applications using React, Node.js, and cloud technologies. Delivered projects to thousands of users and maintained 99.9% uptime.
        </p>
      </div>
    </div>
  </div>
);

export default Experience;