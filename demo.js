const data = {
  sections: [
    {
      data: {
        name: "Jane Doe",
        role: "Frontend Developer",
        description:
          "I'm a frontend developer with a passion for building beautiful UIs.",
        availableForWork : true,
      },

      type: "hero",
    },
    {
        data:{
            githubUrl : "https://github.com/janedoe",
            linkedinUrl : "https://linkedin.com/in/janedoe",
            resumeUrl : "https://resume.com/janedoe",
            emailId: "janedoe@gmail.com",
            location : "New York, USA",
            phoneNumber : "+1 123-456-7890"
        },
        type: "userInfo"
    },
    {
      data: {
        projects: [
          {
            liveLink: "https://ecommerce-demo.vercel.app",
            githubLink: "https://github.com/janedoe/ecommerce",
            projectName: "E-commerce UI",
            projectTitle : "E-commerce UI",
            projectDescription : "Built a responsive e-commerce site using Next.js + Tailwind",
            projectImage : "https://www.janedoe.com/ecommerce.png",
            techStack : ["Next.js", "Tailwind CSS", "React", "Node.js", "MongoDB"]
          },
          {
            link: "https://janedoe.vercel.app",
            title: "Portfolio Website",
            description: "This very portfolio you're seeing!",
          },
        ],
      },
      type: "projects",
    },
    { data: { email: "janedoe@gmail.com" }, type: "contact" },
  ],
};
