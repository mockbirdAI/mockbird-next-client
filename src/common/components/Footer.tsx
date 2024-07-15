import React from 'react';
import Image from 'next/image';
import { Button, buttonVariants } from './ui/Button';
import Link from 'next/link';

const Footer = () => {
  return (
    // <footer className="text-white bg-gradient-to-t from-purple-500 via-purple-600 to-purple-700">
    <footer className="text-black bg-gradient-to-t bg-slate-50 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-wrap">
          {/* Stay in the Know */}
          <div className="w-full md:w-1/3 px-4 mb-6 md:mb-0">
            <div className='flex flex-row mb-4'>
              <Image
                src="/mockbird_temp_logo.svg"
                alt="mockbird logo"
                width={50}
                height={50}
                quality={100}
                className="w-7 h-7"
              />
              <h2 className="ms-2 text-2xl font-semibold">Mockbird</h2>

            </div>
            
            <h2 className="text font-thin mb-3">Book with recruiters now & get the practice for your next interview.</h2>
            <Link
              className={buttonVariants({
                variant: "default",
                size: "sm",
                className: "text-black w-[250px]",
              })}
              href="https://forms.gle/duFKw7MEejDCCKnE6"
              target="_blank"
            >
              Join as a Recruiter
            </Link>
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
            <h3 className="text-xl font-semibold">Contact Us:</h3>
            <p>contact@mockbird.ai</p>
            <a target='_blank' href="/support-ticket">Create Support Ticket</a>
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
