import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const activePath = location.pathname;

    const navItems = [
        { path: "/", label: "Home" },
        { path: "/about", label: "About" },
        { path: "/projects", label: "Projects" },
        { path: "/certificates", label: "Certificates" },
        { path: "/contact", label: "Contact" },
        { path: "/comments", label: "Comments" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    // Hide navbar on admin/login pages
    const hiddenPaths = ["/login", "/admin"];
    if (hiddenPaths.includes(activePath)) return null;

    return (
        <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${
            isOpen
                ? "bg-[#050507]"
                : scrolled
                ? "bg-[#050507]/70 backdrop-blur-xl border-b border-white/5 shadow-[0_1px_20px_rgba(191,163,122,0.05)]"
                : "bg-[#050507]/30 backdrop-blur-sm"
        }`}>
            <div className="mx-auto px-[4%] sm:px-[5%] lg:px-[8%]">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link
                            to="/"
                            onClick={() => setIsOpen(false)}
                            className="text-xl font-bold bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] bg-clip-text text-transparent tracking-widest font-serif"
                        >
                            MIM
                        </Link>
                    </div>

                    {/* Desktop Navigation — Tab style */}
                    <div className="hidden md:flex items-center">
                        {/* Tab Container */}
                        <div className="relative flex items-center bg-white/[0.03] border border-white/[0.08] rounded-2xl px-1.5 py-1.5 gap-0.5 backdrop-blur-md">
                            {navItems.map((item) => {
                                const isActive = activePath === item.path;
                                return (
                                    <Link
                                        key={item.label}
                                        to={item.path}
                                        className={`relative px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                                            isActive
                                                ? "text-[#0a0a0c]"
                                                : "text-[#94a3b8] hover:text-white hover:bg-white/5"
                                        }`}
                                    >
                                        {isActive && (
                                            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] shadow-[0_2px_12px_rgba(191,163,122,0.4)]" />
                                        )}
                                        <span className="relative z-10">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`relative p-2 text-[#dfcfb9] hover:text-white transition-transform duration-300 ease-in-out transform ${
                                isOpen ? "rotate-90 scale-125" : "rotate-0 scale-100"
                            }`}
                        >
                            {isOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out ${
                    isOpen
                        ? "max-h-screen opacity-100 bg-[#050507] border-b border-white/5"
                        : "max-h-0 opacity-0 overflow-hidden"
                }`}
            >
                <div className="px-4 py-4 space-y-1">
                    {navItems.map((item, index) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ease ${
                                activePath === item.path
                                    ? "bg-gradient-to-r from-[#bfa37a]/20 to-[#dfcfb9]/20 text-[#dfcfb9] border border-[#bfa37a]/20"
                                    : "text-[#94a3b8] hover:text-white hover:bg-white/5"
                            }`}
                            style={{
                                transitionDelay: `${index * 50}ms`,
                                transform: isOpen ? "translateX(0)" : "translateX(30px)",
                                opacity: isOpen ? 1 : 0,
                            }}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;