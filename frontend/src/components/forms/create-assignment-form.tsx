"use client";

import { useState } from "react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import TooltipInfo from "@/components/shadcn-custom/tooltip-info"; // Import the reusable component
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, Minus, Upload } from "lucide-react";
import { format, addDays } from "date-fns";
import { createAssignment } from "@/api/courses";
import { DateRange } from "react-day-picker";

// Define prop types for receiving courseId
interface AssignmentFormProps {
  courseId: number;
}

export default function AssignmentForm({ courseId }: AssignmentFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<
    "essay" | "presentation" | "code" | "quiz" | "project"
  >("essay");
  // const [crossCheck, setCrossCheck] = useState<boolean>(false);
  const [evaluationMethod, setEvaluationMethod] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [weight, setWeight] = useState<number | "">("");
  const [criteria, setCriteria] = useState<{ name: string; weight: number }[]>([
    { name: "", weight: 0 },
  ]);
  const [startDate, setStartDate] = useState<Date | undefined>(
    addDays(new Date(), 1)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    addDays(new Date(), 2)
  );
  const [endCrossDate, setEndCrossDate] = useState<Date | undefined>();
  const [description, setDescription] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleCriteriaChange = (
    index: number,
    field: "name" | "weight",
    value: string
  ) => {
    const newCriteria = [...criteria];
    newCriteria[index] = {
      ...newCriteria[index],
      [field]: field === "weight" ? Number(value) : value,
    };
    setCriteria(newCriteria);
  };

  const addCriteria = () => {
    setCriteria([...criteria, { name: "", weight: 0 }]);
  };

  const removeCriteria = (index: number) => {
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (weight === "" || weight <= 0) {
      toast({
        title: "Error",
        description: "Weight must be a positive number",
        variant: "destructive",
      });
      return;
    }

    const totalCriteriaWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
    if (totalCriteriaWeight !== weight) {
      toast({
        title: "Error",
        description: "Total criteria weight must equal the assignment weight",
        variant: "destructive",
      });
      return;
    }

    try {
      const assignmentData = {
        course_id: courseId, // ✅ Use the received courseId
        type,
        title,
        description,
        start_date: startDate ? format(startDate, "yyyy-MM-dd") : "",
        end_date: endDate ? format(endDate, "yyyy-MM-dd") : "",
        end_cross_date: endCrossDate ? format(endCrossDate, "yyyy-MM-dd") : "",
        weight,
        criteria,
        // isCrossCheck: crossCheck ? "1" : "0",
        evaluation_method: evaluationMethod,
        rubrics_file: file,
      };
      console.log(assignmentData);
      const result = await createAssignment(assignmentData);
      console.log("Assignment created:", result);
      toast({
        title: "Success",
        description: "Assignment created successfully",
        variant: "success",
      });

      router.push(`/course/${courseId}`);
      // Handle success (e.g., show a success message, reset form, etc.)
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast({
        title: "Error",
        description: "Failed to create assignment",
        variant: "destructive",
      });
      // Handle error (e.g., show error message)
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row gap-8 p-4"
    >
      <div className="flex-1 space-y-4">
        <h3 className="text-lg font-semibold text-indigo-500">Title</h3>

        <Input
          placeholder="Assignment Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <h3 className="text-lg font-semibold text-indigo-500">
          Assignment type
        </h3>

        <Select
          value={type}
          onValueChange={(value) =>
            setType(
              value as "essay" | "presentation" | "code" | "quiz" | "project"
            )
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select assignment type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="essay">Essay</SelectItem>
            <SelectItem value="presentation">Presentation</SelectItem>
            <SelectItem value="code">Code</SelectItem>
            <SelectItem value="quiz">Quiz</SelectItem>
            <SelectItem value="project">Project</SelectItem>
          </SelectContent>
        </Select>

        <h3 className="text-lg font-semibold text-indigo-500">
          Evalutaion method
        </h3>
        <div className="flex items-center space-x-2">
          {/* <Checkbox
            id="cross-check"
            checked={crossCheck}
            onCheckedChange={(checked) => setCrossCheck(checked === true)}
          /> */}
          <Select onValueChange={setEvaluationMethod} value={evaluationMethod}>
            <SelectTrigger id="evaluation-method">
              <SelectValue placeholder="Select evaluation method" />
              {/* Tooltip with explanations */}
              <TooltipInfo
                infoTexts={[
                  "Cross-check: Peer-reviewed evaluation.",
                  "System-check: Automated verification.",
                  "Manual-check: Human-reviewed assessment.",
                ]}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cross-check">Cross-check</SelectItem>
              <SelectItem value="System-check">System-check</SelectItem>
              <SelectItem value="Manual-check">Manual-check</SelectItem>
            </SelectContent>
          </Select>

          {/* <label htmlFor="cross-check text-indigo-500">Cross-check</label> */}
        </div>

        <h3 className="text-lg font-semibold text-indigo-500">Rubrics</h3>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 ">
          <Input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center justify-center text-sm text-gray-600 py-10 hover:bg-mylightcyan transition-colors duration-100 rounded-lg"
          >
            <Upload className="h-8 w-8" />
            <span>Drop file here or click to upload</span>
            {file && <span className="mt-2">{file.name}</span>}
          </label>
        </div>
      </div>
      <div className="flex-1 space-y-4">
        <h3 className="text-lg font-semibold text-indigo-500">Total Weight</h3>
        <Input
          type="number"
          placeholder="Assignment Weight"
          value={weight}
          onChange={(e) =>
            setWeight(e.target.value ? Number(e.target.value) : "")
          }
          required
        />
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-indigo-500">Criteria</h3>
          {criteria.map((c, index) => (
            <div key={index} className="flex space-x-2">
              <Input
                placeholder="Criteria Name"
                value={c.name}
                onChange={(e) =>
                  handleCriteriaChange(index, "name", e.target.value)
                }
                required
              />
              <Input
                type="number"
                placeholder="Weight"
                value={c.weight}
                onChange={(e) =>
                  handleCriteriaChange(index, "weight", e.target.value)
                }
                required
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeCriteria(index)}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addCriteria}>
            <Plus className="h-4 w-4 mr-2" /> Add Criteria
          </Button>
        </div>
        {/* Start Date Picker */}
        <h3 className="text-lg font-semibold text-indigo-500">
          {evaluationMethod === "Cross-check" && "Cross-Check Submit "}Dates
        </h3>
        <div className="flex space-x-36 font-bold text-mylightgray">
          <div>Start date</div>
          <div>End date</div>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="mr-4">
              {startDate ? format(startDate, "PPP") : "Выберите дату начала"}
              <CalendarIcon className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => {
                if (date && endDate && date >= endDate) {
                  toast({
                    title: "Ошибка",
                    description:
                      "Дата начала должна быть раньше даты окончания",
                    variant: "destructive",
                  });
                  return;
                }
                setStartDate(date || undefined);
              }}
              disabled={(date) => date < new Date()} // Prevent past dates
            />
          </PopoverContent>
        </Popover>
        {/* End Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              {endDate ? format(endDate, "PPP") : "Выберите дату окончания"}
              <CalendarIcon className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => {
                if (date && startDate && date <= startDate) {
                  toast({
                    title: "Ошибка",
                    description: "Дата окончания должна быть позже даты начала",
                    variant: "destructive",
                  });
                  return;
                }
                setEndDate(date || undefined);
              }}
              disabled={(date) => (startDate ? date <= startDate : false)} // Ensure end date is after start date
            />
          </PopoverContent>
        </Popover>
        {evaluationMethod === "Cross-check" && (
          <div>
            <h3 className="text-lg font-semibold text-indigo-500 mb-4">
              Cross-Check End Date
            </h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  {endCrossDate
                    ? format(endCrossDate, "PPP")
                    : "Choose the end date for cross-check"}
                  <CalendarIcon className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endCrossDate}
                  onSelect={(date) => {
                    if (date && endDate && date <= endDate) {
                      toast({
                        title: "Ошибка",
                        description:
                          "Дата окончания кросс-проверки должна быть позже даты окончания задания",
                        variant: "destructive",
                      });
                      return;
                    }
                    setEndCrossDate(date || undefined);
                  }}
                  disabled={(date) => (endDate ? date <= endDate : false)} // Ensure cross-check end date is after assignment end date
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
        <h3 className="text-lg font-semibold text-indigo-500">Description</h3>
        <Textarea
          placeholder="Assignment Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Button variant={"indigo"} type="submit" className="w-full">
          Create Assignment
        </Button>
      </div>
    </form>
  );
}
