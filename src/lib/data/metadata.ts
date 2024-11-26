/**
 * @title App Metadata
 * @fileoverview App metadata
 * @path /lib/data/metadata.ts
 */

import { HeaderNavItemsType } from "@/types/types";

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

export const phaseOneSolution = [
    [2, 2],
    [2, 8],
    [3, 3],
    [3, 7],
    [4, 4],
    [4, 6],
    [5, 5],
    [6, 4],
    [6, 6],
    [7, 3],
    [7, 7],
    [8, 2],
    [8, 8]
];

export const isPhaseTwo = false;

