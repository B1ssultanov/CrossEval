"use client";

import crossEvalLogo from "../../public/images/CrossEvalLogo.png";
import burger from "../../public/images/burger.png";
import search from "../../public/images/search.png";
import Image from "next/image";
import React from "react";
import BurgerMenu from './BurgerMenu'
import { useState } from "react";


const Navbar = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleMenuOpen = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const handleClick = () => {
        if(isSearchOpen !== true){
            setIsSearchOpen(!isSearchOpen);

        }
    };

    return (
        <div className="w-full h-[60px] flex items-center justify-between shadow-lg">
            <Image src={crossEvalLogo} width={103} height={45} />
            <div className="flex items-center relative">
                <input
                    className={`py-2  px-3 w-[150px] ${isSearchOpen ? 'block' : 'hidden'} rounded-3xl bg-gray-200 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-500`}
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
                    <Image src={burger} className="w-[29px] h-[29px]" />
                </button>
                {
                    isMenuOpen && 
                <BurgerMenu />

                }
                
            </div>
        </div>
    );
};

export default Navbar;
