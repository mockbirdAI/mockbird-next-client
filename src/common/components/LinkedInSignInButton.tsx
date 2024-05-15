import { FC, ReactNode } from 'react';
import LoadingButton from './LoadingButton';
import { signIn } from 'next-auth/react';

interface LinkedInSignInButtonProps {
  children: ReactNode;
}
const LinkedInSignInButton: FC<LinkedInSignInButtonProps> = ({ children }) => {
  const loginWithLinkedIn = async () => {
    const signInData = await signIn('linkedin', {  
      redirect: true, 
      callbackUrl: '/dashboard'
  });
    if (signInData?.error) {
      // Handle error (e.g., display a message to the user)
      console.error('Failed to sign in:', signInData.error);
    }
  }
  

  return (
    <LoadingButton onClick={loginWithLinkedIn} className='w-full'>
      {children}
    </LoadingButton>
  );
};

export default LinkedInSignInButton;