"use client"

import * as React from "react"
import { FAQCard } from "./faq-card"

interface FAQItem {
  question: string
  answer: string
}

export function FAQsTab() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(1) // Second item open by default

  const faqs: FAQItem[] = [
    {
      question: "Does the Lucidly App charge platform fees?",
      answer: "No, the Lucidly App charges 0% exit fees, allowing you to withdraw your funds without any deductions.",
    },
    {
      question: "Are there any exit fees when withdrawing from the Lucidly App?",
      answer: "No, the Lucidly App charges 0% exit fees, allowing you to withdraw your funds without any deductions.",
    },
    {
      question: "Is is secure?",
      answer: "No, the Lucidly App charges 0% exit fees, allowing you to withdraw your funds without any deductions.",
    },
    {
      question: "How are fixed yield positions created?",
      answer: "No, the Lucidly App charges 0% exit fees, allowing you to withdraw your funds without any deductions.",
    },
    {
      question: "Where is the yield coming from?",
      answer: "No, the Lucidly App charges 0% exit fees, allowing you to withdraw your funds without any deductions.",
    },
    {
      question: "Who is the curator?",
      answer: "No, the Lucidly App charges 0% exit fees, allowing you to withdraw your funds without any deductions.",
    },
  ]

  return (
    <div 
      className="absolute flex flex-col"
      style={{
        left: '0px',
        top: '0px',
        gap: '16px',
      }}
    >
      {faqs.map((faq, index) => (
        <FAQCard
          key={index}
          item={faq}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  )
}

