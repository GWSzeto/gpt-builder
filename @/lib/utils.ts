import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
  let debounceTimer: NodeJS.Timeout;

  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(this, args), delay);
  };
}

export function AddRemoveArray<T>(flag: boolean, arr: T[], item: T) {
  if (flag) {
    return [...arr, item];
  } else {
    return arr.filter((i) => i !== item);
  }
}


// TIME

export function getDateTime(date: Date) {
  return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

export function getTime(date: Date) {
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

