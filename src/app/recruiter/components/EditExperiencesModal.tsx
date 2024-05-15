'use client';

import { Button } from "@/common/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/common/components/ui/Dialog";
import { Input } from "@/common/components/ui/Input";
import { TextArea } from "@/common/components/ui/TextArea";
import { toast, useToast } from "@/common/components/ui/use-toast";
import { useState, useEffect, Key } from "react";
import { useRouter } from "next/navigation";
import { Company } from "@prisma/client";
import { useSession } from "next-auth/react";

const EditExperiencesModal = ({ recruiterUser }: any) => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [experiences, setExperiences] = useState(recruiterUser.profile.UserCompany);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [validationErrors, setValidationErrors] = useState({});

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      const response = await fetch("/api/get-company-data", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setCompanies(data.res);
    };

    fetchCompanies();
  }, []);

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      await fetch("/api/update-experiences", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experiences })
      });
      toast({
        title: "Success",
        description: "Experiences updated successfully.",
        variant: 'default'
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const addExperience = () => {
    setExperiences([...experiences, { userId: session?.user.id , role: "", companyId: "", startDate: "", endDate: "" }]);
  };

  const removeExperience = (index: any) => {
    setExperiences(experiences.filter((_: any, i: any) => i !== index));
  };

  const updateExperienceField = (index: number, field: string, value: string) => {
    const newExperiences = [...experiences];
    newExperiences[index][field] = value;
    setExperiences(newExperiences);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={false} variant="default">Edit Experiences</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Experiences</DialogTitle>
          <DialogDescription>
            Please note that changes will not be saved without submitting.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {experiences.map((exp: any, index: number) => (
            <div key={index} className="grid grid-cols-2 gap-2">
              <Input value={exp.role} onChange={(e) => updateExperienceField(index, 'role', e.target.value)} placeholder="Role Title" />
              <select value={exp.companyId} onChange={(e) => updateExperienceField(index, 'companyId', e.target.value)} className="p-2 border rounded">
                {companies.length > 0 && companies.map((company) => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>
              <Input value={exp.startDate ? formatDate(exp.startDate) : ""} onChange={(e) => updateExperienceField(index, 'startDate', e.target.value)} placeholder="Start Date" type="date" />
              <Input value={exp.endDate ? formatDate(exp.endDate) : ""} onChange={(e) => updateExperienceField(index, 'endDate', e.target.value)} placeholder="End Date" type="date" />
              <Button onClick={() => removeExperience(index)} variant="destructive">Remove</Button>
            </div>
          ))}
          <Button onClick={addExperience} variant="outline">Add Experience</Button>
        </div>
        <DialogFooter>
          <Button onClick={handleSaveChanges} disabled={loading}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditExperiencesModal;
