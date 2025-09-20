"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { UserPlus, UserMinus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FollowButtonProps {
  userId: string
  username: string
}

export function FollowButton({ userId, username }: FollowButtonProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session && session.user.id !== userId) {
      checkFollowStatus()
    }
  }, [userId, session])

  const checkFollowStatus = async () => {
    try {
      const response = await fetch(`/api/follow/check?userId=${userId}`)
      if (response.ok) {
        const { following } = await response.json()
        setIsFollowing(following)
      }
    } catch (error) {
      console.error("Error checking follow status:", error)
    }
  }

  const handleToggleFollow = async () => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to follow users",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followingId: userId }),
      })

      if (response.ok) {
        const { following } = await response.json()
        setIsFollowing(following)
        toast({
          title: following ? `Following ${username}!` : `Unfollowed ${username}`,
          description: following ? "You'll see their posts in your feed" : "You won't see their posts in your feed",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Don't show follow button for own profile
  if (!session || session.user.id === userId) {
    return null
  }

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      onClick={handleToggleFollow}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isFollowing ? <UserMinus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
      {isLoading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
    </Button>
  )
}
