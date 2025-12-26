"use client"

import * as React from "react"
import { FAQCard } from "./faq-card"
import { useAnalytics } from "@/lib/hooks/use-analytics"

interface FAQItem {
  question: string
  answer: string
}

interface FAQsTabProps {
  faqs?: FAQItem[]
  cardWidth?: string | number
}

export function FAQsTab({ faqs: propFAQs, cardWidth }: FAQsTabProps = {} as FAQsTabProps) {
  const { analytics } = useAnalytics()
  const faqTimeTrackers = React.useRef<Record<number, { startTime: number | null }>>({})

  // Filter out empty FAQs (where both question and answer are empty or whitespace)
  const faqs: FAQItem[] = React.useMemo(() => {
    if (!propFAQs || !Array.isArray(propFAQs) || propFAQs.length === 0) {
      return []
    }
    // Filter out FAQs with empty question or answer
    return propFAQs.filter(
      faq => faq && 
      faq.question && 
      faq.answer && 
      faq.question.trim() !== '' && 
      faq.answer.trim() !== ''
    )
  }, [propFAQs])

  const [openIndex, setOpenIndex] = React.useState<number | null>(null)

  const handleToggle = (index: number) => {
    const isCurrentlyOpen = openIndex === index
    
    if (isCurrentlyOpen) {
      // Closing FAQ - track time spent
      if (faqTimeTrackers.current[index]?.startTime !== null) {
        const duration = Date.now() - faqTimeTrackers.current[index].startTime!
        analytics.faqClosed(faqs[index].question, index, duration)
        faqTimeTrackers.current[index].startTime = null
      }
      setOpenIndex(null)
    } else {
      // Opening FAQ
      analytics.faqOpened(faqs[index].question, index)
      faqTimeTrackers.current[index] = { startTime: Date.now() }
      setOpenIndex(index)
    }
  }

  if (!faqs || faqs.length === 0) {
    return (
      <div 
        className="absolute flex items-center justify-center"
        style={{
          left: '0px',
          top: '0px',
          width: '100%',
          height: '100%',
        }}
      >
        <p 
          className="text-sm opacity-50"
          style={{
            color: 'var(--text-primary)',
          }}
        >
          No data to display
        </p>
      </div>
    )
  }

  return (
    <div 
      className="flex flex-col"
      style={{
        gap: '16px',
      }}
    >
      {faqs.map((faq, index) => (
        <FAQCard
          key={index}
          item={faq}
          isOpen={openIndex === index}
          onToggle={() => handleToggle(index)}
          width={cardWidth}
        />
      ))}
    </div>
  )
}
