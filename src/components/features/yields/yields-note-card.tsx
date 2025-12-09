"use client"

import * as React from "react"
import { designTokens } from "@/lib/design-system"

interface YieldsNoteCardProps {
  label?: string
  content: string
  className?: string
}

export function YieldsNoteCard({ label = "Note: ", content, className }: YieldsNoteCardProps) {
  return (
    <>
      <div 
        className={`absolute rounded-[16px] border border-solid ${className || ''}`}
        style={{
          left: '24px',
          top: '550px',
          width: '620px',
          height: '61px',
          backgroundColor: '#f8f5ff',
          borderColor: '#e6dbff',
        }}
      />
      <p 
        className="absolute text-[12px] leading-[18px] tracking-[0.15px] whitespace-pre-wrap not-italic"
        style={{ 
          left: '39px',
          top: '563px',
          width: '590px',
          color: designTokens.colors.text.primary,
          fontFamily: "'Hanken Grotesk', sans-serif",
          fontWeight: 400,
        }}
      >
        <span className="font-medium">{label}</span>
        <span className="font-normal">{content}</span>
      </p>
    </>
  )
}

