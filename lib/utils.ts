import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Returns the emoji flag for a given country code (e.g. 'BR' -> 🇧🇷)
export function getEmojiFlag(countryCode: string): string {
  if (!countryCode) return '';
  return countryCode
    .toUpperCase()
    .replace(/./g, char =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function newUploadId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
