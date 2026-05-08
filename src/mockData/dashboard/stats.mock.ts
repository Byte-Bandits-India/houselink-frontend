export interface DashboardStat {
  id: string;
  label: string;
  value: number;
  icon: string;
  color: string;
  change: string;
  changeType: "up" | "down" | "neutral";
}

export const dashboardStats: DashboardStat[] = [
  {
    id: "approved",
    label: "Approved Properties",
    value: 12,
    icon: "CheckCircle",
    color: "success",
    change: "+2 this month",
    changeType: "up",
  },
  {
    id: "pending",
    label: "Pending Review",
    value: 4,
    icon: "Clock",
    color: "warning",
    change: "2 awaiting",
    changeType: "neutral",
  },
  {
    id: "credits",
    label: "Available Credits",
    value: 250,
    icon: "Coins",
    color: "info",
    change: "50 used this month",
    changeType: "down",
  },
  {
    id: "leads",
    label: "Total Leads",
    value: 38,
    icon: "Users",
    color: "brand",
    change: "+8 this week",
    changeType: "up",
  },
];
