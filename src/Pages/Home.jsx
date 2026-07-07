import React, { useState, useEffect, useCallback, memo } from "react"
import { Link } from "react-router-dom"
import { Github, Linkedin, Mail, ExternalLink, Instagram, Sparkles } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"
import translations from "../translations"

// Memoized Components
const StatusBadge = memo(({ label }) => (
  <div className="inline-block animate-float lg:mx-0">
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
      <div className="relative px-3 sm:px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
        <span className="bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] text-transparent bg-clip-text sm:text-sm text-[0.7rem] font-medium flex items-center font-sans">
          <Sparkles className="sm:w-3.5 sm:h-3.5 w-3 h-3 mr-2 text-amber-400" />
          {label}
        </span>
      </div>
    </div>
  </div>
));

const MainTitle = memo(() => (
  <div className="space-y-1">
    <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold tracking-tight font-serif leading-tight">
      <span className="relative inline-block">
        <span className="absolute -inset-2 bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] blur-2xl opacity-10"></span>
        <span className="relative bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
          Muhammad Ikhwan
        </span>
      </span>
      <br />
      <span className="relative inline-block mt-1">
        <span className="absolute -inset-2 bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] blur-2xl opacity-10"></span>
        <span className="relative bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] bg-clip-text text-transparent">
          Web Dev & Creative
        </span>
      </span>
    </h1>
  </div>
));

const TechStack = memo(({ tech }) => (
  <div className="px-3 py-1.5 hidden sm:block rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-xs text-gray-300 hover:border-[#bfa37a]/30 transition-colors">
    {tech}
  </div>
));

const CTAButton = memo(({ href, text, icon: Icon }) => (
  <Link to={href}>
    <button className="group relative w-[140px]">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] rounded-xl opacity-40 blur-md group-hover:opacity-75 transition-all duration-700"></div>
      <div className="relative h-10 bg-[#050507] backdrop-blur-xl rounded-lg border border-white/10 leading-none overflow-hidden">
        <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-[#bfa37a]/10 to-[#dfcfb9]/10"></div>
        <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm group-hover:gap-3 transition-all duration-300">
          <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent font-medium z-10">
            {text}
          </span>
          <Icon className={`w-4 h-4 text-gray-200 ${text === 'Contact' || text === 'Kontak' ? 'group-hover:translate-x-1' : 'group-hover:rotate-45'} transform transition-all duration-300 z-10`} />
        </span>
      </div>
    </button>
  </Link>
));

const SocialLink = memo(({ icon: Icon, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <button className="group relative p-2">
      <div className="absolute inset-0 bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] rounded-xl blur opacity-10 group-hover:opacity-30 transition duration-300"></div>
      <div className="relative rounded-xl bg-black/50 backdrop-blur-xl p-2 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all duration-300">
        <Icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
      </div>
    </button>
  </a>
));

// Constants
const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 2000;

const SOCIAL_LINKS = [
  { icon: Github, link: "https://github.com/Xeno-Waan" },
  { icon: Linkedin, link: "https://www.linkedin.com/in/muhammad-ikhwan-manshur-3ba78a352?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
  { icon: Instagram, link: "https://www.instagram.com/mhmmdikhwnmanshr?igsh=MzQ3cG9ldGp2M3Ew" }
];

const Home = () => {
  const { lang } = useLanguage();
  const t = translations[lang].home;

  const [text, setText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // Reset typing when language changes
  useEffect(() => {
    setText("");
    setWordIndex(0);
    setCharIndex(0);
    setIsTyping(true);
  }, [lang]);

  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);

  const WORDS = t.typingWords;

  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < WORDS[wordIndex].length) {
        setText(prev => prev + WORDS[wordIndex][charIndex]);
        setCharIndex(prev => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        setText(prev => prev.slice(0, -1));
        setCharIndex(prev => prev - 1);
      } else {
        setWordIndex(prev => (prev + 1) % WORDS.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex, WORDS]);

  useEffect(() => {
    const timeout = setTimeout(
      handleTyping,
      isTyping ? TYPING_SPEED : ERASING_SPEED
    );
    return () => clearTimeout(timeout);
  }, [handleTyping]);

  return (
    <div className="h-full bg-transparent overflow-hidden px-[5%] sm:px-[6%] lg:px-[8%]" id="Home">
      <div className={`relative z-10 h-full transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <div className="h-full flex items-center">
          <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-6 lg:gap-12 w-full">
            {/* Left Column */}
            <div className="w-full lg:w-1/2 space-y-4 sm:space-y-5 text-left lg:text-left order-1 lg:order-1">
              <div className="space-y-3 sm:space-y-4">
                <StatusBadge label={t.statusBadge} />
                <MainTitle />

                {/* Typing Effect */}
                <div className="h-7 flex items-center">
                  <span className="text-lg md:text-xl bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent font-light">
                    {text}
                  </span>
                  <span className="w-[3px] h-5 bg-gradient-to-t from-[#bfa37a] to-[#dfcfb9] ml-1 animate-blink"></span>
                </div>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-400 max-w-xl leading-relaxed font-light">
                  {t.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 justify-start">
                  {t.techStack.map((tech, index) => (
                    <TechStack key={index} tech={tech} />
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-row gap-3 w-full justify-start">
                  <CTAButton href="/projects" text={t.btnProjects} icon={ExternalLink} />
                  <CTAButton href="/contact" text={t.btnContact} icon={Mail} />
                </div>

                {/* Social Links */}
                <div className="hidden sm:flex gap-3 justify-start">
                  {SOCIAL_LINKS.map((social, index) => (
                    <SocialLink key={index} {...social} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Premium Framed Profile Picture */}
            <div className="w-full lg:w-1/2 h-auto relative flex items-center justify-center order-2 lg:order-2"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}>
              <div className={`relative w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 opacity-95 group`}>
                {/* Glowing Aura */}
                <div className={`absolute -inset-4 bg-gradient-to-r from-[#bfa37a]/15 to-[#dfcfb9]/15 rounded-full blur-3xl transition-all duration-1000 ease-in-out ${
                  isHovering ? "opacity-75 scale-110" : "opacity-40 scale-100"
                }`}></div>
                
                {/* Outer Glassmorphic Border Card */}
                <div className="relative w-full h-full rounded-2xl p-3 bg-white/[0.02] backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-700 group-hover:border-[#bfa37a]/30 group-hover:shadow-[0_0_50px_rgba(191,163,122,0.15)]">
                  {/* Photo Frame Container */}
                  <div className="w-full h-full rounded-xl overflow-hidden relative border border-white/5 bg-slate-950">
                    <img 
                      src="/Photo.jpg" 
                      alt="Muhammad Ikhwan Manshur" 
                      className={`w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out transform ${
                        isHovering ? "scale-105" : "scale-100"
                      }`}
                      loading="eager"
                    />
                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70"></div>
                  </div>
                  
                  {/* Bottom overlay badge */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                    <p className="text-white font-serif font-semibold text-sm sm:text-base">M. Ikhwan Manshur</p>
                    <p className="text-xs text-gray-400 font-light">Web Dev · Design · Video · Photography</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Home);