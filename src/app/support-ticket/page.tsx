// pages/support.tsx
'use client';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/common/components/ui/Button'; // Ensure you have a Select component or create a basic one
import { Input } from '@/common/components/ui/Input';
import { TextArea } from '@/common/components/ui/TextArea';
import { toast } from '@/common/components/ui/use-toast';
import { useRouter } from 'next/navigation';

// Define your form schema using zod
const supportFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  category: z.string(), // Add category to the schema
  message: z.string().min(20, "Message must be at least 20 characters long")
});

type SupportFormData = z.infer<typeof supportFormSchema>;

const SupportPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SupportFormData>({
    resolver: zodResolver(supportFormSchema)
  });

  const onSubmit: SubmitHandler<SupportFormData> = async (data) => {
    try {
      const response = await fetch('/api/create-support-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      if (response.ok) {
        toast({
          title: "Success",
          description: "Support ticket created!",
          variant: 'default'
        });
        reset();
      }
      
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error creating ticket, please try again later.",
        variant: 'destructive'
      });
    }
  };

  return (
    <div className='min-h-screen'>
      <div className="flex flex-col items-center justify-center p-6">
        <h1 className="text-xl font-semibold mb-4">Mockbird Support Ticketing Form</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <Input id="name" {...register('name')} placeholder="Your name" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <Input id="email" {...register('email')} placeholder="Your email" type="email" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select id="category" {...register('category')} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option value="">Select a category</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Billing/Refund">Billing/Refund</option>
              <option value="Technical Support">Technical Support</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <TextArea id="message" {...register('message')} placeholder="Your message" rows={4} />
            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
          </div>

          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </div>
    </div>
  );
};

export default SupportPage;
