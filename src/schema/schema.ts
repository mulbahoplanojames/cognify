import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(6, { message: "Name must be at least 6 characters long" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]+$/, {
      message:
        "Password must contain at least one letter, one number and one special character",
    }),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]+$/, {
      message:
        "Password must contain at least one letter, one number and one special character",
    }),
});

export const sendVerificationEmailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, {
      message: "Password must be at least 8 characters long.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Confirm Password must be at least 8 characters long.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

// model Post {
//   id          String     @id @default(cuid()) @map("_id")
//   authorId    String
//   title       String
//   slug        String     @unique
//   excerpt     String?
//   content     String
//   coverImage  String?
//   ogImage     String?
//   status      PostStatus @default(DRAFT)
//   scheduledAt DateTime?
//   publishedAt DateTime?
//   readingTime Int?
//   views       Int        @default(0)
//   createdAt   DateTime   @default(now())
//   updatedAt   DateTime   @updatedAt

//   // Relations
//   author     User       @relation(fields: [authorId], references: [id], onDelete: Cascade)
//   category   Category?  @relation(fields: [categoryId], references: [id])
//   categoryId String?
//   tags       Tag[]      @relation(fields: [tagIds], references: [id])
//   tagIds     String[]
//   comments   Comment[]
//   reactions  Reaction[]
//   bookmarks  Bookmark[]
//   versions   PostVersion[]

//   @@map("posts")
// }

export const postSchema = z.object({
  title: z
    .string()
    .min(6, { message: "Title must be at least 6 characters long" }),
  excerpt: z
    .string()
    .min(6, { message: "Excerpt must be at least 6 characters long" }),
  slug: z
    .string()
    .min(6, { message: "Slug must be at least 6 characters long" }),
  content: z
    .string()
    .min(6, { message: "Content must be at least 6 characters long" }),
  coverImage: z
    .string()
    .min(6, { message: "Cover Image must be at least 6 characters long" }),
  ogImage: z
    .string()
    .min(6, { message: "OG Image must be at least 6 characters long" }),
});
