import { Mountain, MessageSquare, Map, Star } from "lucide-react";

export const DASHBOARD_STATS = [
  {
    title: "TOTAL EXPEDITIONS",
    value: 24,
    icon: Mountain,
    iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
  },
  {
    title: "ACTIVE INQUIRIES",
    value: 156,
    icon: MessageSquare,
    iconBg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400",
  },
  {
    title: "DESTINATIONS COVERED",
    value: 12,
    icon: Map,
    iconBg: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
  },
  {
    title: "FEATURED PACKAGES",
    value: 5,
    icon: Star,
    iconBg: "bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400",
  }
];

export const RECENT_INQUIRIES = [
  { id: "JD", name: "James Dawson", subject: "Everest Base Camp Luxury Tour", status: "PENDING", date: "Oct 12, 2023", initials: "JD"},
  { id: "ML", name: "Maya Lin", subject: "Annapurna Circuit Inquiry", status: "REPLIED", date: "Oct 11, 2023", initials: "ML" },
  { id: "RK", name: "Robert King", subject: "Booking for K2 Base Camp", status: "PENDING", date: "Oct 10, 2023", initials: "RK" },
  { id: "SP", name: "Sarah Park", subject: "Manaslu Circuit Gear List", status: "REPLIED", date: "Oct 10, 2023", initials: "SP" },
];