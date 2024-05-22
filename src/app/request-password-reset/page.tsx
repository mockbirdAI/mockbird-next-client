'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/common/components/ui/Form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/common/components/ui/Input';
import { Button } from '@/common/components/ui/Button';

const FormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
});

const RequestReset = () => {
  const [message, setMessage] = useState('');
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
    },
  });

  const [clicked, setClicked] = useState(false);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setClicked(true);
    const res = await fetch('/api/request-password-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: values.email }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div className='min-h-screen flex justify-center'>
      <div className='max-w-4xl w-[380px]'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="mail@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button disabled={clicked} className="w-full mt-6" type="submit">
              Request Password Reset
            </Button>
            {message && <p className="text-center text-sm text-red-500 mt-2">{message}</p>}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RequestReset;
