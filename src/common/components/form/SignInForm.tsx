'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/common/components/ui/Form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/common/components/ui/Input';
import { Button } from '@/common/components/ui/Button';
import Link from 'next/link';
import GoogleSignInButton from '@/common/components/GoogleSignInButton';
import { signIn } from 'next-auth/react';
import LoadingButton from '@/common/components/LoadingButton';
import { useState } from 'react';
import { toast } from '../ui/use-toast';
import LinkedInSignInButton from '../LinkedInSignInButton';
import { useSearchParams } from 'next/navigation'

const FormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must have than 8 characters'),
});


const SignInForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const searchParams = useSearchParams()
  const hasError = searchParams.get('error') != null;

  const [error, setError] = useState(hasError ? "An error has occured, please check your login credentials and try again." : "");

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setSignInLoading(true);
    try {
      const signInData = await signIn('credentials', {
        email: values.email.toLowerCase(),
        password: values.password,
        redirect: true, 
        callbackUrl: '/dashboard'
      });
    } catch (error) {
      console.error(error);
    }

    setSignInLoading(false);
    // if (signInData?.error) {
    //   setError(signInData.error);
    // }
  };
  

  const [signInLoading, setSignInLoading] = useState(false);

  return (
    <div className='w-[300px]'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
          <div className='space-y-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='mail@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Enter your password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <LoadingButton loading={signInLoading} className='w-full mt-6' type='submit'>
            Sign in
          </LoadingButton>

          <p className='text-center text-sm text-gray-600 mt-2'>
          Forgot your password? &nbsp;
          <Link className='text-blue-500 hover:underline' href='/request-password-reset'>
            Reset password
          </Link>
          </p>
          
          <div>
            <p className='text-sm text-red-500'>{error}</p>
          </div>
        </form>
        <div className='mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
          or
        </div>
        <LinkedInSignInButton>Sign in with LinkedIn</LinkedInSignInButton>
        <p className='text-center text-sm text-gray-600 mt-2'>
          If you don&apos;t have an account, please&nbsp;
          <Link className='text-blue-500 hover:underline' href='/sign-up'>
            Sign up
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default SignInForm;