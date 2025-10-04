"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Reply, Trash2 } from "lucide-react";
import type { CommentWithAuthor } from "@/lib/services/comment-service";
import { ReactionButtons } from "./reaction-buttons";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const session = useSession();
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/v1/comments/${postId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session.data?.session || !newComment.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: newComment,
          postId,
        }),
      });

      if (response.ok) {
        setNewComment("");
        fetchComments();
        toast.success("Comment posted!");
      } else {
        throw new Error("Failed to post comment");
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to post comment",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !replyText.trim() || !replyTo) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: replyText,
          postId,
          parentId: replyTo,
        }),
      });

      if (response.ok) {
        setReplyText("");
        setReplyTo(null);
        fetchComments();
        toast.success("Reply posted!");
      } else {
        throw new Error("Failed to post reply");
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to post reply",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const response = await fetch(`/api/v1/comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchComments();
        toast.success("Comment deleted");
      } else {
        throw new Error("Failed to delete comment");
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to delete comment",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
      </div>

      {/* New Comment Form */}
      {session.data?.session ? (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div className="flex gap-3">
                <Avatar className="size-8">
                  <AvatarImage src={session.data?.user.image || ""} />
                  <AvatarFallback>
                    {session.data?.user.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading || !newComment.trim()}
                >
                  {isLoading ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              Sign in to join the conversation
            </p>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.image || ""} />
                    <AvatarFallback>
                      {comment.author.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {comment.author.name || comment.author.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                      {comment.editedAt && " (edited)"}
                    </p>
                  </div>
                </div>
                {session?.data?.user.id === comment.authorId && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{comment.body}</p>
              <div className="flex items-center gap-4">
                <ReactionButtons targetId={comment.id} targetType="comment" />
                {session.data?.session && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setReplyTo(replyTo === comment.id ? null : comment.id)
                    }
                  >
                    <Reply className="h-4 w-4 mr-1" />
                    Reply
                  </Button>
                )}
              </div>

              {/* Reply Form */}
              {replyTo === comment.id && (
                <form onSubmit={handleSubmitReply} className="mt-4 space-y-3">
                  <div className="flex gap-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={session.data?.user.image || ""} />
                      <AvatarFallback>
                        {session.data?.user.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      rows={2}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReplyTo(null)}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" disabled={isLoading || !replyText.trim()}>
                      Reply
                    </Button>
                  </div>
                </form>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 space-y-3 border-l-2 border-muted pl-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={reply.author.image || ""} />
                            <AvatarFallback>
                              {reply.author.name?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {reply.author.name || reply.author.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(reply.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {session.data?.user.id === reply.authorId && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(reply.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm ml-8">{reply.body}</p>
                      <div className="ml-8">
                        <ReactionButtons
                          targetId={reply.id}
                          targetType="comment"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
