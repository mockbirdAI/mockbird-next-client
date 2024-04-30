'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/common/components/ui/Button';
import { useSession } from 'next-auth/react';

interface Service {
  id: number;
  service: string;
  duration: number;
  price: number;
}

interface ServicesMultiSelectProps {
  services: Service[];
}

const ServicesMultiSelect: React.FC<ServicesMultiSelectProps> = ({ services }) => {
    const { data: session } = useSession();
    const [servicesList, setServicesList] = useState<Service[]>(services);
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);

    const selectService = (id: number) => {
        setSelectedServiceId(id);
    };

    const updateServiceDetails = (id: number, key: keyof Service, value: string) => {
        const updatedServices = servicesList.map(service => {
            if (service.id === id) {
                return {
                    ...service,
                    [key]: key === 'service' ? value : parseInt(value, 10)
                };
            }
            return service;
        });
        setServicesList(updatedServices);
    };

    const addNewService = () => {
        const newService = {
            id: Date.now(),
            service: 'New Service',
            duration: 3600,
            price: 1000
        };
        setServicesList([...servicesList, newService]);
    };

    const removeSelectedService = () => {
        if (!selectedServiceId) return;
        setServicesList(servicesList.filter(service => service.id !== selectedServiceId));
        setSelectedServiceId(null);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSelectedServiceId(null);
        const updatedServicesList = servicesList.map(service => ({
          service: service.service,
          duration: service.duration,
          price: service.price
        }));
        try {
          await fetch('/api/set-services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ services: updatedServicesList, userId: session?.user.id })
          });
        } catch (error) {
          console.error(error);
        }
    };

    const selectedService = servicesList.find(service => service.id === selectedServiceId);

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-xs mx-auto">
            <div className="space-y-1">
                {servicesList.map((service) => (
                    <button key={service.id} type="button" onClick={() => selectService(service.id)} className={`w-full text-left ${selectedServiceId === service.id ? 'bg-blue-100' : 'bg-white'} p-2 border border-gray-300 rounded-md`}>
                        {service.service}
                    </button>
                ))}
            </div>
            {selectedService && (
                <div className="mt-4">
                    <label className="block">Service Name:
                        <input type="text" value={selectedService.service} onChange={(e) => updateServiceDetails(selectedService.id, 'service', e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                    </label>
                    <label className="block">Duration (seconds):
                        <input type="number" value={selectedService.duration} onChange={(e) => updateServiceDetails(selectedService.id, 'duration', e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                    </label>
                    <label className="block">Price (cents):
                        <input type="number" value={selectedService.price} onChange={(e) => updateServiceDetails(selectedService.id, 'price', e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                    </label>
                </div>
            )}
            <Button type="button" onClick={addNewService} className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Add New Service
            </Button>
            <Button disabled={selectedServiceId == null} type="button" onClick={removeSelectedService} className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Remove Selected Service
            </Button>
            <Button type="submit" className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Save Changes
            </Button>
        </form>
    );
};

export default ServicesMultiSelect;