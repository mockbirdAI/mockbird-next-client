'use client'

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  return (
    <div className="bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <a href="#" className="text-xl font-semibold text-gray-800">StealthXI</a>
            </div>
            <div className="hidden md:block">
              <ul className="ml-4 flex items-center space-x-4">
                <li><a href="#" className="text-gray-600 hover:text-gray-800">Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800">Contact</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800">Login</a></li>
                <li><a href="#" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Sign Up</a></li>
              </ul>
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
}
