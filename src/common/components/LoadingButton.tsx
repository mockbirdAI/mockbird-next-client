import React, { useState } from 'react';
import { Button, ButtonProps } from '@/common/components/ui/Button'; // Adjust the import path to where your Button component is

const LoadingButton: React.FC<ButtonProps & { loadingText?: string }> = ({ children, loadingText = 'Loading...', onClick, ...props }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Define the click handler
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setIsLoading(true); // Start loading
    try {
      onClick && await onClick(e);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <Button {...props} onClick={handleClick} disabled={isLoading || props.disabled}>
      {isLoading ? (
        <>
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          {loadingText && <span className="sr-only">{loadingText}</span>}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingButton;
