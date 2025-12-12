import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number string with commas for thousands separators
 * @param value - The number string to format (e.g., "10000.00" or "10000")
 * @returns Formatted string with commas (e.g., "10,000.00" or "10,000")
 */
export function formatNumberWithCommas(value: string): string {
  if (!value || value === '') return ''
  
  // Remove existing commas and extract the number
  const cleanValue = value.replace(/,/g, '')
  
  // Handle empty string
  if (cleanValue === '') return ''
  
  // Split by decimal point
  const parts = cleanValue.split('.')
  const integerPart = parts[0] || ''
  const decimalPart = parts[1]
  
  // Add commas to integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  
  // Combine with decimal part if it exists
  return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger
}
