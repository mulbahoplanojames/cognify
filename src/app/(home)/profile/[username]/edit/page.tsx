"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, X } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Skill name is required"),
  level: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]),
});

const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Project name is required"),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters"),
  url: z.string().url("Please enter a valid URL").or(z.literal("")),
});

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  experience: z.string().min(10, {
    message: "Please provide some details about your experience.",
  }),
  bio: z.string().max(160).min(4),
  website: z.string().url().or(z.literal("")),
  github: z.string(),
  twitter: z.string(),
  company: z.string(),
  location: z.string(),
  skills: z.array(skillSchema).optional(),
  projects: z.array(projectSchema).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function EditProfilePage() {
  const session = useSession();
  const router = useRouter();

  if (!session.data?.user) {
    router.push("/auth/login");
  }

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      username: "",
      experience: "",
      bio: "",
      website: "",
      github: "",
      twitter: "",
      company: "",
      location: "",
      skills: [],
      projects: [],
    },
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/v1/users/me");
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await response.json();

        // Set form values with the fetched data
        form.reset({
          name: userData.name || "",
          username: userData.username || "",
          experience: userData.experience || "",
          bio: userData.bio || "",
          website: userData.social?.website || "",
          github: userData.social?.github || "",
          twitter: userData.social?.twitter || "",
          company: userData.company || "",
          location: userData.location || "",
          skills: userData.skills || [],
          projects: userData.projects || [],
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast("Error", {
          description:
            "Failed to load user data. Please refresh the page to try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [form]);

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  const [newSkill, setNewSkill] = useState({ name: "", level: "Intermediate" });
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    url: "",
  });

  const addSkill = () => {
    if (newSkill.name.trim()) {
      appendSkill({
        id: Date.now().toString(),
        name: newSkill.name.trim(),
        level: newSkill.level as any,
      });
      setNewSkill({ name: "", level: "Intermediate" });
    }
  };

  const addProject = () => {
    if (newProject.name.trim() && newProject.description.trim()) {
      appendProject({
        id: Date.now().toString(),
        name: newProject.name.trim(),
        description: newProject.description.trim(),
        url: newProject.url.trim(),
      });
      setNewProject({ name: "", description: "", url: "" });
    }
  };

  async function onSubmit(data: ProfileFormValues) {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/v1/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          username: data.username,
          bio: data.bio,
          experience: data.experience,
          social: {
            website: data.website,
            github: data.github,
            twitter: data.twitter,
          },
          company: data.company,
          location: data.location,
          skills: data.skills || [],
          projects: data.projects || [],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      // Update the session
      //   await updateUser({
      //     ...session,
      //     name: data.name,
      //     bio: data.bio,
      //     company: data.company,
      //     location: data.location,
      //   });

      toast("Profile updated", {
        description: "Your profile has been updated successfully.",
      });

      router.push(`/profile/${session?.data?.user?.name}`);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast("Error", {
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-28">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Edit Profile</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading || isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update your basic information and how you want to be displayed
                on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    {...form.register("name")}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Your username"
                    {...form.register("username")}
                  />
                  {form.formState.errors.username && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.username.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <Textarea
                  id="experience"
                  placeholder="Tell us about your professional experience"
                  className="min-h-[100px]"
                  {...form.register("experience")}
                />
                {form.formState.errors.experience && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.experience.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us a little bit about yourself"
                  className="min-h-[100px]"
                  {...form.register("bio")}
                />
                <p className="text-sm text-muted-foreground">
                  This will be displayed on your public profile.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Add or update your contact information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="Where do you work?"
                    {...form.register("company")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Where are you based?"
                    {...form.register("location")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Social Profiles</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground">
                        https://
                      </span>
                      <Input
                        id="website"
                        placeholder="yourwebsite.com"
                        className="rounded-l-none"
                        {...form.register("website")}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground">
                        github.com/
                      </span>
                      <Input
                        id="github"
                        placeholder="username"
                        className="rounded-l-none"
                        {...form.register("github")}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground">
                        twitter.com/
                      </span>
                      <Input
                        id="twitter"
                        placeholder="username"
                        className="rounded-l-none"
                        {...form.register("twitter")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
              <CardDescription>
                Add or update your skills and expertise.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Skill (e.g., JavaScript, React)"
                    value={newSkill.name}
                    onChange={(e) =>
                      setNewSkill({ ...newSkill, name: e.target.value })
                    }
                    className="flex-1"
                  />
                  <select
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newSkill.level}
                    onChange={(e) =>
                      setNewSkill({ ...newSkill, level: e.target.value })
                    }
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <Button type="button" onClick={addSkill}>
                    Add
                  </Button>
                </div>

                {skillFields.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Your Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {skillFields.map((skill, index) => (
                        <div
                          key={skill.id}
                          className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm"
                        >
                          <span>{skill.name}</span>
                          <span className="text-muted-foreground text-xs">
                            ({skill.level})
                          </span>
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="ml-1 text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>
                Showcase your projects and work samples.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input
                        id="project-name"
                        placeholder="Project Name"
                        value={newProject.name}
                        onChange={(e) =>
                          setNewProject({ ...newProject, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-url">
                        Project URL (optional)
                      </Label>
                      <Input
                        id="project-url"
                        placeholder="https://example.com"
                        value={newProject.url}
                        onChange={(e) =>
                          setNewProject({ ...newProject, url: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-description">Description</Label>
                    <Textarea
                      id="project-description"
                      placeholder="Describe the project, your role, and key achievements"
                      value={newProject.description}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          description: e.target.value,
                        })
                      }
                      className="min-h-[80px]"
                    />
                  </div>
                  <Button type="button" onClick={addProject}>
                    Add Project
                  </Button>
                </div>

                {projectFields.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Your Projects</h4>
                    <div className="space-y-4">
                      {projectFields.map((project, index) => (
                        <div key={project.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium">{project.name}</h5>
                              {project.url && (
                                <a
                                  href={
                                    project.url.startsWith("http")
                                      ? project.url
                                      : `https://${project.url}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline"
                                >
                                  {project.url.replace(/^https?:\/\//, "")}
                                </a>
                              )}
                              <p className="text-sm text-muted-foreground mt-1">
                                {project.description}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeProject(index)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
