export const templates: any = {
  NeoSpark: {
    sections: [
      {
        type: "userInfo",
        data: {
          githubUrl: "https://github.com/janedoe",
          linkedinUrl: "https://linkedin.com/in/janedoe",
          resumeUrl: "https://resume.com/janedoe",
          emailId: "janedoe@gmail.com",
          location: "New York, USA",
          phoneNumber: "+1 123-456-7890",
        },
      },
      {
        type: "hero",
        data: {
          name: "Alex Morgan",
          titlePrefix: "Aspiring Software",
          titleSuffixOptions: ["Engineer", "Developer"],
          subtitle:
            "Craving to build innovative solutions that make an impact.\nEnthusiastic problem solver, always curious about new technologies.\nCommitted to continuous learning and growth.",
          badge: {
            texts: [
              "Available for freelance",
              "Open to work",
              "Let's Collaborate!",
            ],
            color: "green",
            isVisible: true,
          },
          actions: [
            {
              type: "button",
              label: "View Projects",
              url: "#projects",
              style: "primary",
            },
            {
              type: "button",
              label: "Contact Me",
              url: "#contact",
              style: "outline",
            },
          ],
        },
      },
      {
        type: "projects",
        data: [
          {
            "liveLink": "https://movieflex.vercel.app",
            "githubLink": "https://github.com/janedoe/movieflex",
            "projectName": "MovieFlex",
            "projectTitle": "Movie Streaming Website",
            "projectDescription": "Built a responsive movie browsing website with Next.js, Tailwind CSS, and TMDB API integration for fetching real-time movie data.",
            "projectImage": "https://user-images.githubusercontent.com/106135144/196727097-50c0ae49-b92f-4aa9-bdcb-30d978a44125.png",
            "techStack": [
              "Next.js",
              "Tailwind CSS",
              "React",
              "TMDB API",
              "Node.js"
            ]
          },
          {
            "liveLink": "https://chatifyhub.vercel.app",
            "githubLink": "https://github.com/janedoe/chatifyhub",
            "projectName": "ChatifyHub",
            "projectTitle": "Real-time Chat Website",
            "projectDescription": "Developed a real-time chat application using React, Tailwind CSS, and Socket.io for live messaging across multiple rooms.",
            "projectImage": "https://adware-technologies.s3.amazonaws.com/uploads/photo/image/10/Screenshot_2020-09-04_at_2.13.27_AM.png",
            "techStack": [
              "React",
              "Tailwind CSS",
              "Node.js",
              "Express.js",
              "Socket.io"
            ]
          }
        ]
      }
      ,
      {
        type: "experience",
        data: [
          {
            role: "Senior Frontend Developer",
            companyName: "TechCorp Solutions",
            location: "San Francisco, CA",
            startDate: "03/2021",
            endDate: "Present",
            description:
              "Led development of multiple React-based web applications with a focus on performance optimization and accessibility. Implemented CI/CD pipelines and mentored junior developers. Reduced application load time by 40% through code splitting and lazy loading strategies.",
            techStack: [
              "React",
              "TypeScript",
              "Redux",
              "Next.js",
              "Tailwind CSS",
              "Jest",
            ],
          },
          {
            role: "Web Developer",
            companyName: "Digital Innovations Inc.",
            location: "Remote",
            startDate: "06/2018",
            endDate: "02/2021",
            description:
              "Developed and maintained client websites using modern JavaScript frameworks. Collaborated with UI/UX designers to implement responsive designs. Built RESTful APIs and integrated third-party services for e-commerce functionality.",
            techStack: [
              "JavaScript",
              "Vue.js",
              "Node.js",
              "Express",
              "MongoDB",
              "SCSS",
            ],
          },
        ]
      },
      {
        type: "technologies",
        data: [
          { "name": "HTML5", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
          { "name": "CSS3", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
          { "name": "JavaScript", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
          { "name": "TypeScript", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
          { "name": "React", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
          { "name": "Next.js", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
          { "name": "Redux", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" },
          { "name": "TailwindCSS", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/2560px-Tailwind_CSS_Logo.svg.png" },
          { "name": "Node.js", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
          { "name": "Express.js", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
          { "name": "MongoDB", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
        ]
      }
    ],
  },
};
