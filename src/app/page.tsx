import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gray-100">

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Your SaaS</h1>
          <p className="text-lg text-gray-600 mb-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod justo id nunc tincidunt, vitae tincidunt nisl tincidunt.</p>
          <a href="#" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Get Started</a>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;