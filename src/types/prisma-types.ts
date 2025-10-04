export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  VISITOR = "VISITOR",
  AUTHOR = "AUTHOR",
  GUEST = "GUEST",
}

export enum PostStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  PUBLISHED = "PUBLISHED",
  PENDING = "PENDING",
}

export enum CommentStatus {
  VISIBLE = "VISIBLE",
  PENDING = "PENDING",
  HIDDEN = "HIDDEN",
  DELETED = "DELETED",
}

export enum ReactionType {
  LIKE = "LIKE",
  CLAP = "CLAP",
  INSIGHTFUL = "INSIGHTFUL",
}

export enum ReportStatus {
  OPEN = "OPEN",
  REVIEWED = "REVIEWED",
  DISMISSED = "DISMISSED",
}

export enum TargetType {
  POST = "POST",
  COMMENT = "COMMENT",
  USER = "USER",
}
