'use client';

import { Button } from "@/common/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/common/components/ui/Dialog";
import { Input } from "@/common/components/ui/Input";
import { TextArea } from "@/common/components/ui/TextArea";
import { toast, useToast } from "@/common/components/ui/use-toast";
import { useState, useEffect, Key } from "react";
import { useRouter } from "next/navigation";
import { Company, School } from "@prisma/client";
import { useSession } from "next-auth/react";

const EditEducationModal = ({ recruiterUser }: any) => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [education, setEducation] = useState(recruiterUser.profile.UserSchool);
  const [schools, setSchools] = useState<School[]>([]);
  const [validationErrors, setValidationErrors] = useState({});

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchSchools = async () => {
      const response = await fetch("/api/get-school-data", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setSchools(data.res);
    };

    fetchSchools();
  }, []);

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      await fetch("/api/update-education", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ education })
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

  const addEducation = () => {
    setEducation([...education, { userId: session?.user.id , degree: "", major: "", schoolId: "", startDate: "", endDate: "" }]);
  };

  const removeEducation = (index: any) => {
    setEducation(education.filter((_: any, i: any) => i !== index));
  };

  const updateEducationField = (index: number, field: string, value: string) => {
    const newEducation = [...education];
    newEducation[index][field] = value;
    setEducation(newEducation);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={false} variant="default">Edit Education</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Experiences</DialogTitle>
          <DialogDescription>
            Please note that changes will not be saved without submitting.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {education.map((educ: any, index: number) => (
            <div key={index} className="grid grid-cols-2 gap-2">
              <Input value={educ.degree} onChange={(e) => updateEducationField(index, 'degree', e.target.value)} placeholder="Degree" />
              <Input value={educ.major} onChange={(e) => updateEducationField(index, 'major', e.target.value)} placeholder="Major" />
              <select value={educ.schoolId || ""} onChange={(e) => updateEducationField(index, 'schoolId', e.target.value)} className="p-2 border rounded">
                <option value="" disabled>Select School</option>
                {schools.length > 0 && schools.map((school) => (
                  <option key={school.id} value={school.id}>{school.name}</option>
                ))}
              </select>
              <Input value={educ.startDate ? formatDate(educ.startDate) : ""} onChange={(e) => updateEducationField(index, 'startDate', e.target.value)} placeholder="Start Date" type="date" />
              <Input value={educ.endDate ? formatDate(educ.endDate) : ""} onChange={(e) => updateEducationField(index, 'endDate', e.target.value)} placeholder="End Date" type="date" />
              <Button onClick={() => removeEducation(index)} variant="destructive">Remove</Button>
            </div>
          ))}
          <Button onClick={addEducation} variant="outline">Add Education</Button>
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

export default EditEducationModal;
