import React from 'react';

const Loading: React.FC = () => {
    return (
      <div className='h-screen'>
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-sxpurple"></div>
        </div>
      </div>

    );
};

export default Loading;
