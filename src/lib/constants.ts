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
  { 
    id: "JD", 
    name: "James Dawson", 
    email: "james.dawson@example.com",
    subject: "Everest Base Camp Luxury Tour", 
    status: "PENDING", 
    date: "Oct 12, 2023", 
    initials: "JD"
  },
  { 
    id: "ML", 
    name: "Maya Lin", 
    email: "maya.lin@example.com",
    subject: "Annapurna Circuit Inquiry", 
    status: "REPLIED", 
    date: "Oct 11, 2023", 
    initials: "ML" 
  },
  { 
    id: "RK", 
    name: "Robert King", 
    email: "robert.king@example.com",
    subject: "Booking for K2 Base Camp", 
    status: "PENDING", 
    date: "Oct 10, 2023", 
    initials: "RK" 
  },
  { 
    id: "SP", 
    name: "Sarah Park", 
    email: "sarah.park@example.com",
    subject: "Manaslu Circuit Gear List", 
    status: "REPLIED", 
    date: "Oct 10, 2023", 
    initials: "SP" 
  },
];

export const INQUIRY_FILTER_TABS=[
    {
        id:"all",
        label:"All Inquiries",
        count:248,
        value:"All",
    },
    {
        id:"pending",
        label:"Pending",
        count:12,
        value:"Pending"
    },
    {
        id:"replied",
        label:"Replied",
        count:236,
        value:"Replied"
    }
]

export const CONTENT_FILTER_TABS=[
  {
    id:"why_choose_us",
    label:"Why Choose Us",
    value:"Why_Choose_Us"
  },
  {
    id:"about_us",
    label:"About Us",
    value:"About_Us"
  }
] 