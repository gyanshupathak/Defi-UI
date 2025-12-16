import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumberWithCommas(value: string): string {
  if (!value || value === '') return ''
  
  const cleanValue = value.replace(/,/g, '')
  
  if (cleanValue === '') return ''
  
  const parts = cleanValue.split('.')
  const integerPart = parts[0] || ''
  const decimalPart = parts[1]
  
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  
  return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger
}

export function formatAddress(address: string | undefined, chars: number = 4): string {
  if (!address) return ''
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}
