"use client"

import * as React from "react"
import Image from "next/image"
import { ExternalLink, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { designTokens, typographyClasses, shadows } from "@/lib/design-system"

const { popIn, popInHover } = shadows
import { Button } from "@/components/ui/button"

export interface WithdrawalRequestCardProps {
  date: string
  syAmount: string
  syToken: string
  usdcAmount: string
  tokenIcon?: string
  onCancel?: () => void
  className?: string
}

export function WithdrawalRequestCard({
  date,
  syAmount,
  syToken,
  usdcAmount,
  tokenIcon = "/images/icons/USD-stable.svg",
  onCancel,
  className,
}: WithdrawalRequestCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <div
      className={cn("relative cursor-pointer", className)}
      style={{
        width: "202px",
        height: "232px",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="absolute inset-0 rounded-[16px] transition-all duration-200"
        style={{
          backgroundColor: designTokens.colors.background.main,
          boxShadow: shadows.popOut,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none rounded-[16px] transition-all duration-200"
          style={{ boxShadow: isHovered ? popInHover : popIn }}
        />
      </div>

      <div className="absolute inset-0 overflow-clip rounded-[16px]">
        <div className="absolute flex items-end justify-end left-[-20px] top-[-20px]">
          <div className="relative w-[100px] h-[100px] shrink-0">
            <Image
              src={tokenIcon}
              alt={syToken}
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div
          className="absolute flex items-center gap-[4px]"
          style={{
            left: "91px",
            top: "20px",
          }}
        >
          <ExternalLink
            size={14}
            style={{ color: designTokens.colors.text.primary }}
          />
          <p
            className={typographyClasses.label1}
            style={{ color: designTokens.colors.text.primary }}
          >
            {date}
          </p>
        </div>

        <div
          className="absolute flex items-center gap-[4px]"
          style={{
            left: "calc(50% + 47px)",
            top: "44px",
            transform: "translateX(-50%)",
          }}
        >
          <p
            className={typographyClasses.label1}
            style={{ color: designTokens.colors.text.primary }}
          >
            {syAmount}
          </p>
          <p
            className={`${typographyClasses.label1} opacity-50`}
            style={{ color: designTokens.colors.text.primary }}
          >
            {syToken}
          </p>
        </div>

        <div
          className="absolute flex items-center gap-[4px]"
          style={{
            left: "calc(50% - 0.5px)",
            top: "112px",
            transform: "translateX(-50%)",
            width: "125px",
            justifyContent: "flex-end",
          }}
        >
          <p
            className="font-medium leading-normal font-sans"
            style={{ 
              color: designTokens.colors.text.primary,
              fontSize: '28px',
              fontFamily: "'Hanken Grotesk', sans-serif"
            }}
          >
            {usdcAmount}
          </p>
          <p
            className="font-medium leading-normal font-sans opacity-50"
            style={{ 
              color: designTokens.colors.text.primary,
              fontSize: '28px',
              fontFamily: "'Hanken Grotesk', sans-serif"
            }}
          >
            USDC
          </p>
        </div>

        {onCancel && (
          <div
            className="absolute"
            style={{
              left: "50%",
              top: "180px",
              transform: "translateX(-50%)",
              width: "154px",
            }}
          >
            <Button
              variant="cancel"
              size="xs"
              onClick={onCancel}
              icon={<Trash2 size={12} />}
              className="w-full"
            >
              Cancel Request
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
