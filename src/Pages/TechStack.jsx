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
