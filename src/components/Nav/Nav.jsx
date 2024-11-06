import { useState } from "react";

function Nav({ onSearch }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        onSearch(term); // Send the search term up to CardOP
    };

    return ( 
        <>
            <nav className="bg-[#091225] ">
                <div className="mt-6 md:mt-0 sm:mt-6 max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-2 md:py-4">
                    <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="/img/logo.png" className="md:h-[18vh] h-[10vh]" alt="Logo" />
                    </a>
                    <div className="flex items-center md:order-2">
                        <div className={`relative ${isMenuOpen ? "block" : "hidden"} md:block`}>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="block w-full p-2 text-sm md:text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 md:w-64 md:transition-width md:duration-300 md:focus:w-80"
                                placeholder="Pesquisar por OP..."
                            />
                        </div>
                        <button
                            type="button"
                            onClick={toggleMenu}
                            className="md:hidden text-gray-500 rounded-lg text-sm p-2.5 ms-2"
                        >
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 19L15 15M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                            </svg>
                            <span className="sr-only">Pesquisar</span>
                        </button>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Nav;
