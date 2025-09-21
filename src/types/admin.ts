export interface kpiCardsType {
  title: string;
  value: number;
  change: string;
  changeType: "positive" | "negative";
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}
