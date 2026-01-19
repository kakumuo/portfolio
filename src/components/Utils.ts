import type { Preload } from "./types";


export function formatDate(date:Date|number, relative:boolean = false) {
  const targetDate = new Date(date);
  if (isNaN(targetDate.getTime())) {
    throw new Error("Invalid date input");
  }

  if (relative) {
    const diffMs:number = Date.now() - targetDate.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
      return `${diffSeconds} sec${diffSeconds > 1 ? 's' : ''} ago`;
    } else if (diffMinutes < 60) {
      return `${diffMinutes} min${diffMinutes > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays > 1  ? 's' : ''} ago`;
    }
  }

  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, "0");
  const day = String(targetDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function threeDigitCode(text:string) {
  let sum = 0;

  for (let i = 0; i < text.length; i++) {
    sum += text.charCodeAt(i); // Unicode code point for each character
  }

  const n = sum % 1000;        // keep only three digits
  return n.toString().padStart(3, "0");
}

