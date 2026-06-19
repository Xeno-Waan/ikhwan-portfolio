import React from "react";
import TechStackIcon from "../components/TechStackIcon";

const techStacks = [
  { icon: "html.svg", language: "HTML" },
  { icon: "css.svg", language: "CSS" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "reactjs.svg", language: "ReactJS" },
  { icon: "nodejs.svg", language: "Node JS" },
  { icon: "bootstrap.svg", language: "Bootstrap" },
  { icon: "vercel.svg", language: "Vercel" },
];

export default function TechStackSection() {
  return (
    <section className="h-full flex flex-col justify-center px-[5%] md:px-[8%] bg-transparent overflow-hidden" id="TechStack">
      <div className="text-center pb-6" data-aos="fade-up" data-aos-duration="1000">
        <h1 className="inline-block text-3xl md:text-4xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-[#dfcfb9] font-serif">
          <span style={{
            color: '#bfa37a',
            backgroundImage: 'linear-gradient(45deg, #bfa37a 10%, #dfcfb9 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Tech Stack
          </span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm mt-1">
          The technologies, tools, and languages I use to build robust and responsive digital experiences.
        </p>
      </div>

      <div className="flex justify-center items-center">
        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-7 gap-4 lg:gap-6">
          {techStacks.map((stack, index) => (
            <div
              key={index}
              data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
              data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
            >
              <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
