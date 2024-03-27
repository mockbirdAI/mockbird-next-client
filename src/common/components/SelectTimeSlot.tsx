import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/common/components/ui/Select";

interface TimeSlotsProps {
  onChange?: (value: Date) => void;
  timeslots: Date[];
}

export function SelectTimeSlots({ timeslots, onChange }: TimeSlotsProps) {
  const [selectedTime, setSelectedTimeSlot] = React.useState<string>("");
  const handleSelect = (value: string) => {
    setSelectedTimeSlot(value);
    const date = new Date(value);
    if (onChange && !isNaN(date.getTime())) { // Check if date is valid
      onChange(date);
    }
  };

  return (
    <Select value={selectedTime} onValueChange={(e) => handleSelect(e)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a Time Slot">{selectedTime}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Date/Times</SelectLabel>
          {timeslots.map((timeslot, index) => (
            <SelectItem key={index} value={timeslot.toLocaleString()}>
              {timeslot.toLocaleString()}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
