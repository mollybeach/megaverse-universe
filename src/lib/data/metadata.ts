/**
 * @title App Metadata
 * @fileoverview App metadata
 * @path /lib/data/metadata.ts
 */

import { HeaderNavItemsType } from "@/types/types";
//import { BookOpen, Home, FileText, BarChart } from "lucide-react";

// Define the emoji and SVG for the navigation items
const SaturnEmoji = '🪐'; // Emoji for Megaverse
//const ChallengeSVG = { src: 'https://res.cloudinary.com/storagemanagementcontainer/image/upload/v1732334298/portfolio/crossmint-logo_km22uh.svg', alt: 'Challenge Logo' }; // SVG for Challenge
const ChallengeEmoji = '🏆'; // Emoji for Challenge
const BookIcon = '📚'; // Emoji for Documentation
const MapEmoji = '🗺️'; // Emoji for Map


export const HeaderNavItems: HeaderNavItemsType[] = [
    { value: "megaverse", icon: SaturnEmoji, label: "Megaverse" },
    { value: "challenge", icon: ChallengeEmoji, label: "Challenge" , external: "https://challenge.crossmint.com/"},
    { value: "documentation", icon: BookIcon, label: "Documentation", external: "https://challenge.crossmint.com/documentation" },
    { value: "map", icon: MapEmoji, label: "Map", external: "https://challenge.crossmint.com/map" },
];

