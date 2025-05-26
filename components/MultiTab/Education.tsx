import React from "react";

const educationData = [
  {
    icon: "🎓",
    title: "B.Tech in Computer Science",
    subtitle: "Your University",
    location: "City, Country",
    date: "2020 - 2024",
    description:
      "Relevant coursework: Data Structures, Algorithms, Machine Learning, Cloud Computing, etc.",
  },
  {
    icon: "💻",
    title: "Online Certifications",
    subtitle: "Coursera, Udemy, etc.",
    location: "Remote",
    date: "2021 - Present",
    description:
      "Completed courses in Machine Learning, Cloud Architecture, DevOps, and System Design from top online platforms.",
  },
];

const Education = () => (
  <div className="space-y-8">
    <h2 className="text-4xl font-bold text-white mb-8">Education</h2>
    <div className="relative pl-8">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-700/50" />
      {educationData.map((item, idx) => (
        <div key={idx} className="mb-12 flex items-start relative">
          {/* Timeline icon */}
          <div className="absolute -left-1.5 flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-lg shadow-lg">
            {item.icon}
          </div>
          {/* Content */}
          <div className="ml-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-white mb-1">{item.title}</h3>
              <span className="text-gray-400 text-sm font-medium">{item.date}</span>
            </div>
            <div className="text-gray-300 font-medium mb-1">{item.subtitle}</div>
            <div className="text-gray-400 text-sm mb-2">{item.location}</div>
            <div className="text-gray-300">{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Education; 