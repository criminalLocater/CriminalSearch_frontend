import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Sidebar = ({ role, handleActiveTab, isActiveTab }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const currentPath = window.location.pathname;

    // Detect screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => {
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    const getLinks = () => {
        const baseLinks = [];

        // Add Home/Services/Contact links only for mobile
        if (isMobile) {
            baseLinks.push(
                { name: "Home", path: "/" },
                { name: "Services", path: "/service" },
                { name: "Contact", path: "/contact" }
            );
        }

        // Role-specific links
        switch (role) {
            case "admin":
                baseLinks.push(
                    { name: "Manage Users", tab: "manageusers" },
                    { name: "Manage Stations", tab: "managestations" },
                    { name: "Profile", tab: "profile" }
                );
                break;
            case "sic":
                baseLinks.push(
                    { name: "Add Criminal", tab: "addcriminal" },
                    { name: "View Criminals", tab: "criminalpage" },
                    { name: "Profile", tab: "profile" }
                );
                break;
            case "officer":
                baseLinks.push(
                    { name: "Criminals Records", tab: "criminalsrecords" },
                    { name: "Profile", tab: "profile" }
                );
                break;
            default:
                // Already added Home/Services/Contact above if mobile
                baseLinks.push({ name: "Login", path: "/login" });
                break;
        }

        return baseLinks;
    };

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-indigo-800 to-purple-900 text-white p-6 shadow-xl transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col md:h-full`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo / Title */}
                    <div className="flex items-center justify-between mb-8 md:mb-12">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-white text-indigo-900 font-bold flex items-center justify-center mr-3 shadow-md">
                                BP
                            </div>
                            <h2 className="text-2xl font-extrabold hidden md:block">
                                Barrackpore
                            </h2>
                        </div>

                        {/* Close Button (mobile only) */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="md:hidden text-white focus:outline-none"
                            aria-label="Close sidebar"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="space-y-2 flex-1">
                        {getLinks().map((link, index) => {
                            const isActive = link.tab
                                ? isActiveTab === link.tab
                                : currentPath === link.path;

                            return (
                                <Link
                                    key={index}
                                    to={link.path || "#"}
                                    className={`block py-3 px-4 rounded-lg transition-all duration-200 ${
                                        isActive
                                            ? "bg-white text-indigo-900 shadow-md font-semibold"
                                            : "hover:bg-indigo-700 hover:shadow hover:translate-x-1"
                                    }`}
                                    onClick={(e) => {
                                        if (window.innerWidth < 768) {
                                            setIsOpen(false); // Close mobile sidebar
                                        }

                                        if (link.tab) {
                                            e.preventDefault(); // Prevent default for tab-based nav
                                            handleActiveTab(link.tab);
                                        }
                                        // If path exists, let <Link> handle routing
                                    }}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Divider */}
                    <hr className="my-6 border-t border-gray-700" />

                    {/* Role Badge */}
                    <div className="mt-auto">
                        <div className="px-4 py-2 bg-indigo-700 rounded-full text-center text-sm uppercase tracking-wider font-medium shadow-inner">
                            Role:{" "}
                            <span className="font-bold capitalize">
                                {role || "Guest"}
                            </span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;