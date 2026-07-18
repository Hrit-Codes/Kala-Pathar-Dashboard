// src/lib/utils/helper.tsx
import React from "react";
import { AxiosError } from "axios";
import { 
    Mountain, Shield, Globe, Award, Users, Clock, Star, Heart, 
    Compass, Map, Camera, Coffee, Sparkles, Tent, Cloud,
    Binoculars, Zap, Hotel, Sun, Moon, Umbrella, Wind, 
    Snowflake, Flame, Droplets, Leaf, Flower, Feather, 
    Crown, Gem, Diamond, Medal, Trophy,
    Plane, Car, Bus, Bike, Ship, Train, Rocket,
    MountainSnow, Wine, Beer, Cake, Pizza, Utensils,
    Church, Gift, Music, Book, Video, Image, Phone,
    Mail, Share, HeartHandshake, Handshake,
    type LucideIcon
} from 'lucide-react';

export const getEstimatedReadTime = (
  content: string,
  charsPerMinute: number = 1000
): string => {
  if (!content) return "0 seconds";

  const plainText = content.replace(/<[^>]*>/g, " ").trim();
  const charCount = plainText.replace(/\s+/g, '').length;
  
  if (charCount === 0) return "0 seconds";

  const minutes = charCount / charsPerMinute;

  if (minutes < 1) {
    const seconds = Math.max(5, Math.round(minutes * 60));
    return `${seconds} seconds`;
  }

  const roundedMinutes = Math.round(minutes);
  return `${roundedMinutes} minute${roundedMinutes > 1 ? "s" : ""}`;
};

export async function fetchOrNull<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export const getCampaignStatusLabel = (status: string) => {
    switch (status) {
        case "completed":
            return "COMPLETED";
        case "processing":
            return "PROCESSING";
        case "pending":
            return "PENDING";
        case "failed":
            return "FAILED";
        default:
            return status.toUpperCase();
    }
};

export const getCampaignStatusBadge = (status: string) => {
    switch (status) {
        case "completed":
            return "badge-success";
        case "processing":
            return "badge-warning";
        case "pending":
            return "badge-pending";
        case "failed":
            return "badge-error";
        default:
            return "badge";
    }
};

// ✅ Using JSX directly (works because file is .tsx)
export const iconMap: Record<string, React.ReactNode> = {
    mountain: <Mountain size={22} />,
    shield: <Shield size={22} />,
    globe: <Globe size={22} />,
    award: <Award size={22} />,
    users: <Users size={22} />,
    clock: <Clock size={22} />,
    star: <Star size={22} />,
    heart: <Heart size={22} />,
    compass: <Compass size={22} />,
    map: <Map size={22} />,
    camera: <Camera size={22} />,
    coffee: <Coffee size={22} />,
    sparkles: <Sparkles size={22} />,
    tent: <Tent size={22} />,
    cloud: <Cloud size={22} />,
    binoculars: <Binoculars size={22} />,
    zap: <Zap size={22} />,
    hotel: <Hotel size={22} />,
    sun: <Sun size={22} />,
    moon: <Moon size={22} />,
    umbrella: <Umbrella size={22} />,
    wind: <Wind size={22} />,
    snowflake: <Snowflake size={22} />,
    flame: <Flame size={22} />,
    droplets: <Droplets size={22} />,
    leaf: <Leaf size={22} />,
    flower: <Flower size={22} />,
    feather: <Feather size={22} />,
    crown: <Crown size={22} />,
    gem: <Gem size={22} />,
    diamond: <Diamond size={22} />,
    medal: <Medal size={22} />,
    trophy: <Trophy size={22} />,
    plane: <Plane size={22} />,
    car: <Car size={22} />,
    bus: <Bus size={22} />,
    bike: <Bike size={22} />,
    ship: <Ship size={22} />,
    train: <Train size={22} />,
    rocket: <Rocket size={22} />,
    mountainSnow: <MountainSnow size={22} />,
    wine: <Wine size={22} />,
    beer: <Beer size={22} />,
    cake: <Cake size={22} />,
    pizza: <Pizza size={22} />,
    utensils: <Utensils size={22} />,
    church: <Church size={22} />,
    gift: <Gift size={22} />,
    music: <Music size={22} />,
    book: <Book size={22} />,
    video: <Video size={22} />,
    image: <Image size={22} />,
    phone: <Phone size={22} />,
    mail: <Mail size={22} />,
    share: <Share size={22} />,
    heartHandshake: <HeartHandshake size={22} />,
    handshake: <Handshake size={22} />,
};

// ✅ Helper function to get icon with custom size
export const getIcon = (key: string, size: number = 22): React.ReactNode => {
    const icon = iconMap[key];
    if (!icon) return <Mountain size={size} />;
    
    // Clone the icon with new size
    return React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size });
};

// ✅ Get icon component for direct usage
export const getIconComponent = (name: string): LucideIcon | null => {
    const iconMap: Record<string, LucideIcon> = {
        Mountain, Shield, Globe, Award, Users, Clock, Star, Heart,
        Compass, Map, Camera, Coffee, Sparkles, Tent, Cloud,
        Binoculars, Zap, Hotel, Sun, Moon, Umbrella, Wind,
        Snowflake, Flame, Droplets, Leaf, Flower, Feather,
        Crown, Gem, Diamond, Medal, Trophy,
        Plane, Car, Bus, Bike, Ship, Train, Rocket,
        MountainSnow, Wine, Beer, Cake, Pizza, Utensils,
        Church, Gift, Music, Book, Video, Image, Phone,
        Mail, Share, HeartHandshake, Handshake
    };
    
    return iconMap[name] || null;
};