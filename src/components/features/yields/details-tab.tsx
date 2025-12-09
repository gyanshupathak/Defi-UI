"use client"

import * as React from "react"
import { designTokens, shadows } from "@/lib/design-system"
import Image from "next/image"

function ShareIcon({ className }: { className?: string }) {
  return (
    <div className="relative shrink-0" style={{ width: '14px', height: '14px' }}>
      <Image
        src="/images/icons/redirect.svg"
        alt="Redirect"
        fill
        className="object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none'
        }}
      />
    </div>
  )
}

function DeBankIcon({ className }: { className?: string }) {
  return (
    <div className="relative shrink-0" style={{ width: '14px', height: '14px' }}>
      <Image
        src="/images/icons/base.png"
        alt="Base"
        fill
        className="object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none'
        }}
      />
    </div>
  )
}

function DottedLine() {
  return (
    <div 
      className="flex-1 h-px relative" 
      style={{ 
        minWidth: '0',
        backgroundImage: 'repeating-linear-gradient(to right, rgba(0, 0, 0, 0.1) 0px, rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 3px)',
        backgroundSize: '4px 1px',
        backgroundRepeat: 'repeat-x',
      }}
    />
  )
}

interface DetailRowProps {
  label: string
  value: string
  showCopyIcon?: boolean
  onCopy?: () => void
}

function DetailRow({ label, value, showCopyIcon = false, onCopy }: DetailRowProps) {
  return (
    <div
      className="flex items-end gap-[8px] py-[8px] w-full"
    >
      <p
        className="font-['Hanken_Grotesk',sans-serif] font-normal leading-normal shrink-0 text-[16px] text-black"
        style={{ opacity: 0.5 }}
      >
        {label}
      </p>
      <DottedLine />
      <div className="flex items-center gap-[8px] shrink-0">
        <p
          className="font-['Hanken_Grotesk',sans-serif] font-normal leading-[24px] text-[16px] text-black tracking-[0.44px]"
        >
          {value}
        </p>
        {showCopyIcon && (
          <button
            type="button"
            onClick={onCopy}
            className="flex items-center justify-center p-[5px] rounded-[99px] cursor-pointer bg-transparent border-0 hover:opacity-70 transition-opacity"
            style={{
              backgroundColor: 'rgba(245, 245, 245, 0.1)',
            }}
            aria-label="Copy address"
          >
            <ShareIcon />
          </button>
        )}
      </div>
    </div>
  )
}

interface ExposureCardProps {
  title: string
  tokenImages: string[]
  additionalCount: number
}

function ExposureCard({ title, tokenImages, additionalCount }: ExposureCardProps) {
  return (
    <div
      className="relative rounded-[16px]"
      style={{
        width: '413px',
        height: '88px',
        backgroundColor: designTokens.colors.background.main,
        boxShadow: shadows.popOut,
      }}
    >
      <div
        className="absolute flex items-center gap-[40px]"
        style={{
          left: '20px',
          top: '20px',
          right: '20px',
          overflow: 'hidden',
        }}
      >
        {/* Asset Exposure Section */}
        <div className="flex flex-col gap-[8px] items-start justify-end" style={{ width: '170px', maxWidth: '170px', overflow: 'hidden' }}>
          <div className="flex items-start pl-0 pr-[6px] py-0 w-full" style={{ overflow: 'hidden' }}>
            {tokenImages.map((img, index) => (
              <div
                key={index}
                className="relative rounded-full shrink-0"
                style={{
                  width: '24px',
                  height: '24px',
                  marginRight: index < tokenImages.length - 1 ? '-6px' : '0',
                  zIndex: tokenImages.length - index,
                }}
              >
                {img.startsWith('/') ? (
                  <Image
                    src={img}
                    alt={`Token ${index + 1}`}
                    fill
                    className="object-cover rounded-full pointer-events-none"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                ) : (
                  <img
                    src={img}
                    alt={`Token ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover rounded-full pointer-events-none"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                )}
              </div>
            ))}
            <div
              className="grid grid-cols-[max-content] grid-rows-[max-content] justify-items-start leading-[0] relative shrink-0 rounded-[99px]"
              style={{
                width: '24px',
                height: '24px',
                marginLeft: '-6px',
                backgroundColor: '#f2f2f2',
              }}
            >
              <p
                className="col-[1] row-[1] font-['Hanken_Grotesk',sans-serif] font-normal leading-normal text-[12px] text-black"
                style={{
                  marginLeft: '8px',
                  marginTop: '4px',
                }}
              >
                +{additionalCount}
              </p>
            </div>
          </div>
          <p
            className="font-['Hanken_Grotesk',sans-serif] font-medium leading-normal text-[12px] text-black tracking-[0.6px] opacity-50 whitespace-nowrap shrink-0"
            style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {title}
          </p>
        </div>

        {/* Divider */}
        <div className="flex flex-row items-center self-stretch">
          <div className="bg-[#d9d9d9] h-full shrink-0 w-px" />
        </div>

        {/* Protocol Exposure Section */}
        <div className="flex items-start">
          <div className="flex flex-col gap-[8px] items-start justify-end" style={{ width: '170px', maxWidth: '170px', overflow: 'hidden' }}>
            <div className="flex items-start pl-0 pr-[6px] py-0 w-full" style={{ overflow: 'hidden' }}>
              {tokenImages.map((img, index) => (
                <div
                  key={index}
                  className="relative rounded-full shrink-0"
                  style={{
                    width: '24px',
                    height: '24px',
                    marginRight: index < tokenImages.length - 1 ? '-6px' : '0',
                    zIndex: tokenImages.length - index,
                  }}
                >
                  {img.startsWith('/') ? (
                    <Image
                      src={img}
                      alt={`Token ${index + 1}`}
                      fill
                      className="object-cover rounded-full pointer-events-none"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  ) : (
                    <img
                      src={img}
                      alt={`Token ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover rounded-full pointer-events-none"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  )}
                </div>
              ))}
              <div
                className="grid grid-cols-[max-content] grid-rows-[max-content] justify-items-start leading-[0] relative shrink-0 rounded-[99px]"
                style={{
                  width: '24px',
                  height: '24px',
                  marginLeft: '-6px',
                  backgroundColor: '#f2f2f2',
                }}
              >
                <p
                  className="col-[1] row-[1] font-['Hanken_Grotesk',sans-serif] font-normal leading-normal text-[12px] text-black"
                  style={{
                    marginLeft: '8px',
                    marginTop: '4px',
                  }}
                >
                  +{additionalCount}
                </p>
              </div>
            </div>
            <p
              className="font-['Hanken_Grotesk',sans-serif] font-medium leading-normal text-[12px] text-black tracking-[0.6px] opacity-50 whitespace-nowrap shrink-0"
              style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              PROTOCOL EXPOSURE
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DetailsTab() {
  const tokenImages = [
    "/images/icons/base.png",
    "/images/icons/base.png",
    "/images/icons/base.png",
    "/images/icons/base.png",
  ]

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {
      const textArea = document.createElement("textarea")
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
    })
  }

  return (
    <div
      className="relative rounded-[16px]"
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: designTokens.colors.background.main,
        boxShadow: shadows.cardDefault,
      }}
    >
      <div className="absolute" style={{ left: '24px', top: '24px' }}>
        <ExposureCard
          title="ASSET EXPOSURE"
          tokenImages={tokenImages}
          additionalCount={5}
        />
      </div>

      <div className="absolute" style={{ left: '461px', top: '24px' }}>
        <button
          type="button"
          className="relative flex items-center justify-center gap-[8px] rounded-[16px] cursor-pointer bg-transparent border-0 hover:opacity-80 transition-opacity"
          style={{
            width: '183px',
            height: '88px',
            backgroundColor: designTokens.colors.background.main,
            boxShadow: shadows.popOut,
          }}
        >
          <p
            className="text-[12px] leading-[14px] font-normal opacity-70"
            style={{
              color: designTokens.colors.text.primary,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            View on DeBank
          </p>
          <DeBankIcon />
        </button>
      </div>

      <div
        className="absolute flex flex-col gap-[22px] items-start"
        style={{
          left: '24px',
          top: '144px',
          width: 'calc(100% - 48px)',
        }}
      >
        <DetailRow
          label="Contract Address"
          value="0x82...2d23"
          showCopyIcon
          onCopy={() => handleCopy("0x82...2d23")}
        />
        <DetailRow
          label="Management Fees"
          value="0%"
        />
        <DetailRow
          label="Performance Fee"
          value="10%"
        />
        <DetailRow
          label="Audited by"
          value="Pashov Audit Group"
          showCopyIcon
          onCopy={() => handleCopy("Pashov Audit Group")}
        />
        <DetailRow
          label="Vault Deployment Date"
          value="25 Nov 2025"
        />
        <DetailRow
          label="Rate Provider Address"
          value="0x32...2f19"
          showCopyIcon
          onCopy={() => handleCopy("0x32...2f19")}
        />
        <DetailRow
          label="Fee Receipt"
          value="0x32...2f19"
          showCopyIcon
          onCopy={() => handleCopy("0x32...2f19")}
        />
        <DetailRow
          label="Owner Address"
          value="0x52...3d64"
          showCopyIcon
          onCopy={() => handleCopy("0x52...3d64")}
        />
      </div>
    </div>
  )
}
