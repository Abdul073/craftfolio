import React from "react";

const Technologies = () => (
  <div className="space-y-8">
    <h2 className="text-4xl font-bold text-white mb-8">Technologies</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {[
        "React",
        "Node.js",
        "TypeScript",
        "Python",
        "AWS",
        "Docker",
        "PostgreSQL",
        "GraphQL",
        "MongoDB",
        "Redis",
        "Kubernetes",
        "Next.js",
      ].map((tech) => (
        <div
          key={tech}
          className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700/50 hover:border-orange-400/50 transition-all duration-300"
        >
          <span className="text-white font-medium">{tech}</span>
        </div>
      ))}
    </div>
  </div>
);

export default Technologies;
