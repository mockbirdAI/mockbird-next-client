import React from 'react';

const Footer = () => {
  return (
    // <footer className="text-white bg-gradient-to-t from-purple-500 via-purple-600 to-purple-700">
    <footer className="text-black bg-gradient-to-t bg-slate-50 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-wrap">
          {/* Stay in the Know */}
          <div className="w-full md:w-1/3 px-4 mb-6 md:mb-0">
            <h2 className="text-xl font-semibold">Stay in the Know</h2>
            <div className="mt-4">
              <p>Join Our Mailing List</p>
              <div className="mt-1 flex">
                <input type="email" placeholder="Your email" className="p-2 border border-gray-300 rounded-l-lg flex-1"/>
                <button className="bg-white hover:bg-gray-200 text-sxpurple p-2 rounded-r-lg">Sign Up</button>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="w-full md:w-1/3 px-4 text-center mb-6 md:mb-0">
            <h3 className="text-xl font-semibold">Follow Us</h3>
            <div className="flex justify-center space-x-4 mt-2">
              {/* Replace # with your social media links */}
              <a href="#" className="hover:underline">Facebook</a>
              <a href="#" className="hover:underline">Twitter</a>
              <a href="https://www.linkedin.com/company/mockbird/" className="hover:underline">LinkedIn</a>
            </div>
          </div>

          {/* Address and Email */}
          <div className="w-full md:w-1/3 px-4 text-right">
            {/* <p>123 Town Rd, City</p> */}
            <p>contact@mockbird.ai</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 mt-8 border-t border-gray-200">
          <p className="text-sm text-left">&copy; {new Date().getFullYear()} Mockbird. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
