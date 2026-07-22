import { Mountain, MessageSquare, Map, Star, LayoutDashboard, ImageIcon, Building2, FileText } from "lucide-react";

export const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Packages', href: '/dashboard/packages', icon: Mountain },
  { name: 'Categories & Destinations', href: '/dashboard/categories&destinations', icon: Map },
  { name: 'Inquiries', href: '/dashboard/inquiries', icon: MessageSquare },
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: MessageSquare },
  { name: 'Gallery', href: '/dashboard/gallery', icon: ImageIcon },
  { name: 'Company Info', href: '/dashboard/companyinfo', icon: Building2 },
  { name: "Content Management", href:"/dashboard/contentManagement",icon:FileText },
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
        value:"All",
    },
    {
        id:"pending",
        label:"Pending",
        value:"Pending"
    },
    {
        id:"replied",
        label:"Replied",
        value:"Replied"
    }
]

export const CONTENT_FILTER_TABS=[
  {
    id:"why_plan_with_us",
    label:"Why Plan With Us",
    value:"Why_Plan_With_Us"
  },
  {
    id:"about_us",
    label:"About Us",
    value:"About_Us"
  },
  {
    id:"affiliations",
    label:"Affiliations",
    value:"Affiliations"
  }
] 

export const ALL_ICONS = [
    // From WHY_CHOOSE_US_ICONS
    { label: "Mountain", value: "mountain", component: "Mountain" },
    { label: "Shield", value: "shield", component: "Shield" },
    { label: "Globe", value: "globe", component: "Globe" },
    { label: "Award", value: "award", component: "Award" },
    { label: "Users", value: "users", component: "Users" },
    { label: "Clock", value: "clock", component: "Clock" },
    { label: "Star", value: "star", component: "Star" },
    { label: "Heart", value: "heart", component: "Heart" },
    { label: "Compass", value: "compass", component: "Compass" },
    { label: "Map", value: "map", component: "Map" },
    
    // From PACKAGE_TYPES_ICONS
    { label: "Camera", value: "camera", component: "Camera" },
    { label: "Coffee", value: "coffee", component: "Coffee" },
    { label: "Sparkles", value: "sparkles", component: "Sparkles" },
    { label: "Tent", value: "tent", component: "Tent" },
    { label: "Cloud", value: "cloud", component: "Cloud" },
    
    // NEW ICONS FOR TRAVEL & ADVENTURE
    { label: "Binoculars", value: "binoculars", component: "Binoculars" },
    { label: "Zap", value: "zap", component: "Zap" },
    { label: "Hotel", value: "hotel", component: "Hotel" },
    { label: "Sun", value: "sun", component: "Sun" },
    { label: "Moon", value: "moon", component: "Moon" },
    { label: "Umbrella", value: "umbrella", component: "Umbrella" },
    { label: "Wind", value: "wind", component: "Wind" },
    { label: "Snowflake", value: "snowflake", component: "Snowflake" },
    { label: "Flame", value: "flame", component: "Flame" },
    { label: "Droplets", value: "droplets", component: "Droplets" },
    { label: "Leaf", value: "leaf", component: "Leaf" },
    { label: "Flower", value: "flower", component: "Flower" },
    { label: "Feather", value: "feather", component: "Feather" },
    { label: "Crown", value: "crown", component: "Crown" },
    { label: "Gem", value: "gem", component: "Gem" },
    { label: "Diamond", value: "diamond", component: "Diamond" },
    { label: "Medal", value: "medal", component: "Medal" },
    { label: "Trophy", value: "trophy", component: "Trophy" },
    
    // TRAVEL & TRANSPORTATION
    { label: "Plane", value: "plane", component: "Plane" },
    { label: "Car", value: "car", component: "Car" },
    { label: "Bus", value: "bus", component: "Bus" },
    { label: "Bike", value: "bike", component: "Bike" },
    { label: "Ship", value: "ship", component: "Ship" },
    { label: "Train", value: "train", component: "Train" },
    { label: "Rocket", value: "rocket", component: "Rocket" },
    
    // NATURE & LANDSCAPE
    { label: "MountainSnow", value: "mountainSnow", component: "MountainSnow" },
    
    // FOOD & DINING
    { label: "Wine", value: "wine", component: "Wine" },
    { label: "Beer", value: "beer", component: "Beer" },
    { label: "Cake", value: "cake", component: "Cake" },
    { label: "Pizza", value: "pizza", component: "Pizza" },
    { label: "Utensils", value: "utensils", component: "Utensils" },
    
    // CULTURE & RELIGION
    { label: "Church", value: "church", component: "Church" },
    
    // MISC
    { label: "Gift", value: "gift", component: "Gift" },
    { label: "Music", value: "music", component: "Music" },
    { label: "Book", value: "book", component: "Book" },
    { label: "Video", value: "video", component: "Video" },
    { label: "Image", value: "image", component: "Image" },
    { label: "Phone", value: "phone", component: "Phone" },
    { label: "Mail", value: "mail", component: "Mail" },
    { label: "Share", value: "share", component: "Share" },
    { label: "HeartHandshake", value: "heartHandshake", component: "HeartHandshake" },
    { label: "Handshake", value: "handshake", component: "Handshake" },
] as const;


export const CATEGORIES_AND_DESTINATIONS_TAB=[
  {
    id:"package_types",
    label:"Package Types",
    value:"Package_Types"
  },
  {
    id:"destinations",
    label:"Destinations",
    value:"Destinations"
  }
]

