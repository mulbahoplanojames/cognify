"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type RequestType = "feature" | "feedback" | "bug";

export function FeatureRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "feature" as RequestType,
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/v1/feature-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "Failed to submit request");
      }

      toast.success(
        "Thank you for your submission! We'll review your request soon."
      );

      // Reset form
      setFormData({
        title: "",
        description: "",
        type: "feature",
        email: "",
      });
    } catch (error) {
      console.error("Error submitting feature request:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit your request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="type" className="block mb-2">
            Type of Request
          </Label>
          <Select
            value={formData.type}
            onValueChange={(value: RequestType) =>
              setFormData((prev) => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="feature">Feature Request</SelectItem>
              <SelectItem value="feedback">General Feedback</SelectItem>
              <SelectItem value="bug">Bug Report</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="title" className="block mb-2">
            Title
          </Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Briefly describe your request"
            required
          />
        </div>

        <div>
          <Label htmlFor="description" className="block mb-2">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            placeholder="Please provide as much detail as possible about your request..."
            required
          />
          <p className="mt-2 text-sm text-muted-foreground">
            Include any relevant information that would help us understand your
            request better.
          </p>
        </div>

        <div>
          <Label htmlFor="email" className="block mb-2">
            Email (optional)
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            If you'd like us to follow up with you about this request.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </form>
  );
}
