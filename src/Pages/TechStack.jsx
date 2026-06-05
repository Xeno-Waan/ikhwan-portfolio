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
    <section className="md:px-[10%] px-[5%] w-full py-[6rem] bg-[#050507] overflow-hidden" id="TechStack">
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-[#dfcfb9] font-serif">
          <span style={{
            color: '#bfa37a',
            backgroundImage: 'linear-gradient(45deg, #bfa37a 10%, #dfcfb9 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Tech Stack
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          The technologies, tools, and languages I use to build robust and responsive digital experiences.
        </p>
      </div>

      <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5">
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
