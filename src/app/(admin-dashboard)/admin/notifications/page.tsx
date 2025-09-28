import React from "react";

export default function NotificationsPage() {
  const handleFetchNotifications = async () => {
    const response = await fetch("/api/v1/notifications");
    const data = await response.json();
    return data;
  };
  return <div>NotificationsPage</div>;
}
