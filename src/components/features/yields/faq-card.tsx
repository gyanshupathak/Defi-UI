"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { designTokens, typographyClasses, shadows } from "@/lib/design-system"

interface FAQItem {
  question: string
  answer: string
}

interface FAQCardProps {
  item: FAQItem
  isOpen: boolean
  onToggle: () => void
  width?: string | number
}

export function FAQCard({ item, isOpen, onToggle, width = '668px' }: FAQCardProps) {
  const cardWidth = typeof width === 'number' ? `${width}px` : width
  
  return (
    <div 
      className="relative"
      style={{
        width: cardWidth === '100%' ? '100%' : cardWidth,
      }}
    >
      <div 
        className="absolute inset-0 rounded-[16px]"
        style={{
          backgroundColor: designTokens.colors.background.main,
          boxShadow: shadows.popOut,
        }}
      >
        <div 
          className="absolute inset-0 pointer-events-none rounded-[16px]"
          style={{
            boxShadow: shadows.popIn,
          }}
        />
      </div>

      <div 
        className="relative flex flex-col"
        style={{
          padding: '20px 24px',
          width: '100%',
        }}
      >
        <div 
          className="flex items-start justify-between gap-4"
          style={{
            width: '100%',
          }}
        >
          <p 
            className="text-[14px] leading-[22px] font-medium flex-1"
            style={{
              color: designTokens.colors.text.primary,
              fontFamily: "'Hanken Grotesk', sans-serif",
            }}
          >
            {item.question}
          </p>
          <button
            type="button"
            onClick={onToggle}
            className="flex items-center justify-center cursor-pointer bg-transparent border-0 p-0 shrink-0"
            style={{
              width: '16px',
              height: '16px',
              marginTop: '2px',
            }}
          >
            <ChevronDown 
              size={16} 
              style={{ 
                color: designTokens.colors.text.primary,
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }} 
            />
          </button>
        </div>

        {isOpen && (
          <p 
            className={`${typographyClasses.label1} opacity-50 whitespace-pre-wrap`}
            style={{
              marginTop: '8px',
              color: designTokens.colors.text.primary,
              width: '100%',
            }}
          >
            {item.answer}
          </p>
        )}
      </div>
    </div>
  )
}
