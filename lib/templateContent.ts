export const templates: any = {
  NeoSpark: {
    sections: [
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
        data: {
          githubUrl: "https://github.com/janedoe",
          linkedinUrl: "https://linkedin.com/in/janedoe",
          resumeUrl: "https://resume.com/janedoe",
          emailId: "janedoe@gmail.com",
          location: "New York, USA",
          phoneNumber: "+1 123-456-7890",
        },
        type: "userInfo",
      },
      {
        data: {
          projects: [
            {
              liveLink: "https://ecommerce-demo.vercel.app",
              githubLink: "https://github.com/janedoe/ecommerce",
              projectName: "E-commerce UI",
              projectTitle: "E-commerce UI",
              projectDescription:
                "Built a responsive e-commerce site using Next.js + Tailwind",
              projectImage: "https://www.janedoe.com/ecommerce.png",
              techStack: [
                "Next.js",
                "Tailwind CSS",
                "React",
                "Node.js",
                "MongoDB",
              ],
            },
            {
              liveLink: "https://ecommerce-demo.vercel.app",
              githubLink: "https://github.com/janedoe/ecommerce",
              projectName: "Chatify",
              projectTitle: "Chat website in React",
              projectDescription:
                "Built a responsive chat website using React.js + Tailwind",
              projectImage: "https://www.janedoe.com/ecommerce.png",
              techStack: [
                "Next.js",
                "Tailwind CSS",
                "React",
                "Node.js",
                "MongoDB",
              ],
            },
            
          ],
        },
        type: "projects",
      },
      {
        data: {
          email: "janedoe@gmail.com",
        },
        type: "contact",
      },
    ],
  },
};
