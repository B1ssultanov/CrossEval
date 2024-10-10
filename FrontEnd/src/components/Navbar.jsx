"use client";
import CreateCourseModal from "../components/CreateCourseModal";
import crossEvalLogo from "../../public/images/CrossEvalLogo.png";
import burger from "../../public/images/burger.png";
import search from "../../public/images/search.png";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import BurgerMenu from "./BurgerMenu";
import profilePic from "../../public/images/user-circle.png";
import SearchBar from "./SearchBar";

const Navbar = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // state for dropdown
    const [isNavbarShown, setIsNavbarShown] = useState(true);
    const [accessToken, setAccessToken] = useState("");
    const [role, setRole] = useState("");
    // New state to check if the user is authenticated
    const [isUserAuthorized, setIsUserAuthorized] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        if (!window) return;
        const token = localStorage.getItem("accessToken");
        if (token) {
            setRole(localStorage.getItem("role"));
            setIsUserAuthorized(true); // User is logged in
            setAccessToken(token);
        }
    }, []);

    // Check URL using window.location
    useEffect(() => {
        if (typeof window !== "undefined") {
            const path = window.location.pathname;

            // Hide the navbar if URL ends with '/login' or '/register'
            if (path.endsWith("/login") || path.endsWith("/register")) {
                setIsNavbarShown(false);
            } else {
                setIsNavbarShown(true);
            }
        }
    }, []); // Empty dependency array ensures it runs once when the component mounts

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleMenuOpen = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleClick = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const handleProfileClick = () => {
        setIsDropdownOpen(!isDropdownOpen); // toggle dropdown
    };

    const handleSignOut = () => {
        // Remove tokens from localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");

        // Redirect to login page or homepage
        setIsUserAuthorized(false);
        window.location.href = "/login"; // Redirect to login
    };

    return (
        isNavbarShown && (
            <div className="w-full h-[60px] flex items-center justify-between shadow-lg rounded-bl-2xl rounded-br-2xl z-50">
                <Link href={"/"}>
                    <Image
                        src={crossEvalLogo}
                        className="ml-4 lg:w-[130px] lg:ml-5"
                        width={103}
                        height={45}
                        alt="logo"
                    />
                </Link>

                <div className="hidden lg:block">
                    <SearchBar />
                </div>

                <div className="flex items-center relative lg:hidden">
                    <input
                        className={`py-2  px-3 w-[150px] ${
                            isSearchOpen ? "block" : "hidden"
                        } rounded-3xl bg-gray-200 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-500`}
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />

                    <button
                        className="transition-colors duration-500"
                        onClick={handleClick}
                    >
                        <Image
                            src={search}
                            className="w-[23px] h-[23px] mr-3"
                            alt="search button"
                        />
                    </button>
                    <button onClick={handleMenuOpen}>
                        <Image
                            src={burger}
                            className="w-[29px] h-[29px] mr-4"
                            alt="burger menu"
                        />
                    </button>
                    {isMenuOpen && <BurgerMenu />}
                </div>

                <div className="hidden lg:flex items-center space-x-6 mr-4 relative">
                    {role==='supervisor' && (
                        <button
                            onClick={openModal}
                            className="w-[40px] h-[40px] text-3xl hover:bg-gray-200 border-2 rounded-full"
                        >
                            +
                        </button>
                    )}

                    <CreateCourseModal
                        accessToken={accessToken}
                        isOpen={isModalOpen}
                        onClose={closeModal}
                    />

                    <Link href={"/about"}>ABOUT</Link>

                    <div className="relative">
                        <button onClick={handleProfileClick}>
                            <Image
                                src={profilePic}
                                height={45}
                                width={45}
                                alt="profile"
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                {isUserAuthorized ? (
                                    <div
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={handleSignOut}
                                    >
                                        Sign Out
                                    </div>
                                ) : (
                                    <>
                                        <Link href="/login">
                                            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                                Login
                                            </div>
                                        </Link>
                                        <Link href="/register">
                                            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                                Register
                                            </div>
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    );
};

export default Navbar;
