import React from 'react';
import AuthButton from './AuthButton';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gradient-to-r from-black to-purple-800 w-full">
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* <div className="flex-shrink-0">
            <span className="text-white font-bold text-lg">Logo</span>
          </div> */}
          <div className="flex-grow">
            <div className="flex">
              <a
                href="#"
                className="text-gray-300 hover:bg-gray-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-500"
              >
                Home
              </a>
              <a
                href="#"
                className="text-gray-300 hover:bg-gray-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-500"
              >
                About
              </a>
              <a
                href="#"
                className="text-gray-300 hover:bg-gray-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-500"
              >
                Contact
              </a>
            </div>
          </div>
          <div>
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;