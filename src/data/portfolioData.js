import img1 from "../assets/img1.JPG";
import img2 from "../assets/img2.JPG";
import img3 from "../assets/img3.JPG";
import photo1 from "../assets/photo1.JPG";
import photo2 from "../assets/photo2.PNG";
import photo3 from "../assets/photo3.png";
import m1 from "../assets/m1.PNG";
import m2 from "../assets/m2.PNG";
import w1 from "../assets/w1.PNG";
import w2 from "../assets/w2.PNG";
import ph from "../assets/ph.png";

export const initialPortfolioData = {
  githubUsername: "",
  hero: {
    name: "Kundan Kumar",
    roles: ["Web Developer", "AI Developer", "Software Developer"],
    tagline:
      "I turn complex ideas into seamless, impactful web experiences — building modern, scalable, and lightning-fast applications that make a difference.",
    resumeLink: "",
    hireMeLink: "#contact",
    viewWorkLink: "#projects"
  },
  about: {
    name: "Kundan Kumar",
    title: "AI Full-Stack Developer",
    profileImage: ph,
    bio: "I build scalable, modern applications with a strong focus on clean architecture, delightful UX, and performance. My toolkit spans Java, React, Next.js, TypeScript, Tailwind CSS, and RESTful APIs — bringing ideas to life from concept to production with robust architectures and smooth interfaces.",
    stats: [
      { id: "s1", label: "Experience", value: "1+ Years" },
      { id: "s2", label: "Specialty", value: "AI Full-Stack" },
      { id: "s3", label: "Focus", value: "Performance & UX" }
    ],
    aboutMe:
      "I'm a Software Developer, Content Creator, and Web Developer — passionate about building fast, resilient applications and sharing coding insights with the developer community.",
    aboutMeSub:
      "I love turning ideas into scalable, user-friendly products that make a real impact."
  },
  projects: [
    {
      id: "p1",
      title: "NK Studio",
      link: "https://www.nk.studio/",
      bgColor: "#0d4d3d",
      image: img1,
      mobileImage: photo1,
      description: "Creative studio platform with fluid animations and responsive portfolio showcases."
    },
    {
      id: "p2",
      title: "Gamily",
      link: "https://gamilyapp.com/",
      bgColor: "#3884d3",
      image: img2,
      mobileImage: photo2,
      description: "Next-gen gaming community hub and engagement mobile-friendly web app."
    },
    {
      id: "p3",
      title: "Hungry Tiger",
      link: "https://www.eathungrytiger.com/",
      bgColor: "#dc9317",
      image: img3,
      mobileImage: photo3,
      description: "Modern e-commerce and dining experience with fast checkout and dynamic menus."
    }
  ],
  skills: [
    { id: "sk1", name: "Java", iconKey: "FaJava" },
    { id: "sk2", name: "React", iconKey: "FaReact" },
    { id: "sk3", name: "Next.js", iconKey: "SiNextdotjs" },
    { id: "sk4", name: "TypeScript", iconKey: "SiTypescript" },
    { id: "sk5", name: "Tailwind CSS", iconKey: "SiTailwindcss" },
    { id: "sk6", name: "FastAPI", iconKey: "SiFastapi" },
    { id: "sk7", name: "Python", iconKey: "SiPython" },
    { id: "sk8", name: "Docker", iconKey: "SiDocker" },
    { id: "sk9", name: "Node.js", iconKey: "DiNodejsSmall" },
    { id: "sk10", name: "MongoDB", iconKey: "SiMongodb" },
    { id: "sk11", name: "Angular", iconKey: "SiAngular" }
  ],
  experiences: [
    {
      id: "exp1",
      role: "Web developer",
      company: "Google",
      duration: "2025",
      description: "Built high-performance apps, integrated AI features, improved engagement by 10%."
    },
    {
      id: "exp2",
      role: "Web Developer Intern",
      company: "Mobisoft Technologies",
      duration: "2022 - 2023",
      description: "Gained hands-on web development experience."
    },
    {
      id: "exp3",
      role: "Graduate",
      company: "HCL Technologies",
      duration: "2024 - 2025",
      description: "Built frontend of GenAI-powered PV Intake App with Next.js & TS for US client."
    }
  ],
  testimonials: [
    {
      id: "t1",
      name: "Yash Sahu",
      role: "Software Engineer at HCL Technologies",
      review:
        "Kundan is a visionary developer. His attention to detail and creativity blew us away. Our project was a massive success because of him.",
      image: m1
    },
    {
      id: "t2",
      name: "Heather Forster",
      role: "UI/UX Designer at PixelWorks",
      review:
        "Working with Kundan was an absolute pleasure. He brings design and code together like magic. Highly recommend him!",
      image: w1
    },
    {
      id: "t3",
      name: "Amy Jacobsan",
      role: "Tech Manager at CodeEmpire",
      review:
        "From concept to execution, Kundan handled everything flawlessly. His work ethic and innovation are unmatched.",
      image: m2
    },
    {
      id: "t4",
      name: "Carry Smith",
      role: "CTO at Innovate Labs",
      review:
        "Kundan transformed our outdated platform into something modern and powerful. His skills are world-class.",
      image: w2
    }
  ],
  socials: [
    { id: "soc1", platform: "X", label: "X", href: "https://twitter.com/yourprofile", iconKey: "FaXTwitter" },
    { id: "soc2", platform: "LinkedIn", label: "LinkedIn", href: "https://linkedin.com/yourprofile", iconKey: "FaLinkedin" },
    { id: "soc3", platform: "Github", label: "Github", href: "https://github.com/yourprofile", iconKey: "FaGithub" },
    { id: "soc4", platform: "Facebook", label: "Facebook", href: "https://facebook.com/yourprofile", iconKey: "FaFacebook" },
    { id: "soc5", platform: "Instagram", label: "Instagram", href: "https://instagram.com/yourprofile", iconKey: "FaInstagram" },
    { id: "soc6", platform: "Youtube", label: "Youtube", href: "https://www.youtube.com/@Thekundanvlog-v2q", iconKey: "FaYoutube" }
  ]
};
