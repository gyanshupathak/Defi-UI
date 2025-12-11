"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { designTokens, typographyClasses } from "@/lib/design-system"

export interface PortfolioDashboardEmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  buttonText?: string
  buttonVariant?: "default" | "blue" | "outline"
  onButtonClick?: () => void
  showButton?: boolean
}

export function PortfolioDashboardEmptyState({
  icon,
  title,
  description,
  buttonText = "Make a Deposit",
  buttonVariant = "default",
  onButtonClick,
  showButton = true,
}: PortfolioDashboardEmptyStateProps) {
  const router = useRouter()

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick()
    } else {
      router.push("/deposit")
    }
  }

  return (
    <div 
      className="flex flex-col items-center"
      style={{ 
        gap: '24px',
        paddingTop: '124px',
      }}
    >
      <div 
        className="flex flex-col items-center"
        style={{ gap: '16px' }}
      >
        {icon && (
          <div 
            className="relative"
            style={{ 
              width: '100px',
              height: '100px',
            }}
          >
            <div 
              className="absolute inset-0 rounded-full"
              style={{ 
                backgroundColor: designTokens.colors.background.main,
              }}
            />
            
            <div className="absolute inset-0 flex items-center justify-center">
              {icon}
            </div>
          </div>
        )}

        <div 
          className="flex flex-col items-center text-center"
          style={{ gap: '8px' }}
        >
          <p 
            className="font-semibold text-[16px] leading-normal font-sans"
            style={{ 
              color: designTokens.colors.text.primary,
            }}
          >
            {title}
          </p>
          <p 
            className={typographyClasses.label1}
            style={{ 
              color: designTokens.colors.text.primary,
              opacity: 0.5,
              maxWidth: '294px',
            }}
          >
            {description}
          </p>
        </div>
      </div>

      {showButton && (
        <div 
          className="relative"
          style={{ 
            width: '400px',
            height: '56px',
          }}
        >
          <Button
            className="w-full h-full"
            variant={buttonVariant}
            size="default"
            showDepositIcon={buttonVariant === "default" || buttonVariant === "blue"}
            onClick={handleButtonClick}
          >
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  )
}

