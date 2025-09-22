import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  MoreHorizontal,
} from "lucide-react";
// import { Post } from "@/types/admin";
import { Post } from "@/lib/prisma";

interface PostCardProps {
  post: Post;
  onStatusUpdate: (postId: string, status: string) => void;
  showApproveReject?: boolean;
}

export default function ContentPostCard({
  post,
  onStatusUpdate,
  showApproveReject = false,
}: PostCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-lg">{post.title}</h3>
              <Badge className={getStatusColor(post.status)}>
                {post.status}
              </Badge>
              {/* {post._count?.reports ? (
                <Badge variant="destructive">
                  {post._count.reports}{" "}
                  {post._count.reports === 1 ? "report" : "reports"}
                </Badge>
              ) : null} */}
            </div>
            <p className="text-muted-foreground mb-3">{post.excerpt}</p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{post.authorId || "Unknown"}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={`text-xs ${getStatusColor(post.status)}`}>
                  {post.status === "PUBLISHED" && (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  )}
                  {post.status.charAt(0) + post.status.slice(1).toLowerCase()}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {showApproveReject && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusUpdate(post.id, "PUBLISHED")}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusUpdate(post.id, "DRAFT")}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {post.status !== "PUBLISHED" && !showApproveReject && (
                  <DropdownMenuItem
                    onClick={() => onStatusUpdate(post.id, "PUBLISHED")}
                    className="text-green-600"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Publish
                  </DropdownMenuItem>
                )}
                {post.status !== "DRAFT" && !showApproveReject && (
                  <DropdownMenuItem
                    onClick={() => onStatusUpdate(post.id, "DRAFT")}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Set as Draft
                  </DropdownMenuItem>
                )}
                {post.status !== "SCHEDULED" && (
                  <DropdownMenuItem
                    onClick={() => onStatusUpdate(post.id, "SCHEDULED")}
                    className="text-blue-600"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Schedule for Later
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
