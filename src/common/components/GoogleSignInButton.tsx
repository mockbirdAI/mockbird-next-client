import { FC, ReactNode } from 'react';
import { Button } from '@/common/components/ui/Button';

interface GoogleSignInButtonProps {
  children: ReactNode;
}
const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {
  const loginWithGoogle = () => console.log('login with google');

  return (
    <Button onClick={loginWithGoogle} className='w-full'>
      {children}
    </Button>
  );
};

export default GoogleSignInButton;