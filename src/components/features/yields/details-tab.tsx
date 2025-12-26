"use client"

import * as React from "react"
import { designTokens, shadows } from "@/lib/design-system"
import Image from "next/image"
import { useAnalytics } from "@/lib/hooks/use-analytics"
import type { VaultConfig } from "@/lib/config/vault-config"
import imagesData from "@/lib/utils/images.json"

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
  // Get DeBank icon from images.json (CDN), fallback to local
  const debankImage = imagesData.images_by_category.Assets.find(
    (img) => img.filename.toLowerCase() === 'debank.svg'
  )
  const debankUrl = debankImage?.url || "/images/icons/debank.svg"
  const [imageError, setImageError] = React.useState(false)
  
  return (
    <div className="relative shrink-0" style={{ width: '14px', height: '14px' }}>
      <Image
        src={imageError ? "/images/icons/debank.svg" : debankUrl}
        alt="DeBank"
        fill
        className="object-contain"
        unoptimized={debankUrl.endsWith('.svg')}
        onError={(e) => {
          if (!imageError) {
            setImageError(true)
          } else {
            (e.target as HTMLImageElement).style.display = 'none'
          }
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
}

function ExposureCard({ title }: ExposureCardProps) {
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
        <div className="flex flex-col gap-[8px] items-start justify-end" style={{ width: '170px', maxWidth: '170px', overflow: 'hidden' }}>
          <div className="flex items-center pl-0 pr-[6px] py-0 w-full" style={{ overflow: 'hidden' }}>
            <p
              className="font-['Hanken_Grotesk',sans-serif] font-normal leading-normal text-[16px] text-black"
            >
              --
            </p>
          </div>
          <p
            className="font-['Hanken_Grotesk',sans-serif] font-medium leading-normal text-[12px] text-black tracking-[0.6px] opacity-50 whitespace-nowrap shrink-0"
            style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {title}
          </p>
        </div>

        <div className="flex flex-row items-center self-stretch">
          <div className="bg-[#d9d9d9] h-full shrink-0 w-px" />
        </div>

        <div className="flex items-start">
          <div className="flex flex-col gap-[8px] items-start justify-end" style={{ width: '170px', maxWidth: '170px', overflow: 'hidden' }}>
            <div className="flex items-center pl-0 pr-[6px] py-0 w-full" style={{ overflow: 'hidden' }}>
              <p
                className="font-['Hanken_Grotesk',sans-serif] font-normal leading-normal text-[16px] text-black"
              >
                --
              </p>
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

interface DetailsTabProps {
  vaultConfig?: VaultConfig | null
}

/**
 * Format an Ethereum address for display (truncate to 0x{first2}...{last4})
 */
function formatAddress(address: string): string {
  if (!address || address.length < 10) return address
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

/**
 * Format a value, showing "--" if empty/null/undefined
 */
function formatValue(value: string | null | undefined, suffix: string = ""): string {
  if (!value || value.trim() === "") return "--"
  return `${value}${suffix}`
}

export function DetailsTab({ vaultConfig }: DetailsTabProps) {
  const { analytics } = useAnalytics()

  const handleCopy = (text: string, addressType: string) => {
    analytics.addressCopied(addressType, text)
    navigator.clipboard.writeText(text).catch(() => {
      const textArea = document.createElement("textarea")
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
    })
  }

  // Extract values from config, with fallback to "--"
  const constants = vaultConfig?.vault_constants
  
  const contractAddress = constants?.address || ""
  const managementFee = formatValue(constants?.management_fee, "%")
  const performanceFee = formatValue(constants?.performance_fee, "%")
  const auditedBy = formatValue(constants?.audited_by)
  const deploymentDate = formatValue(constants?.deployment_date)
  const rateProvider = constants?.rate_provider || ""
  const feePayout = constants?.fee_payout || ""
  const owner = constants?.owner || ""

  // Format addresses for display (truncated)
  const contractAddressDisplay = contractAddress ? formatAddress(contractAddress) : "--"
  const rateProviderDisplay = rateProvider ? formatAddress(rateProvider) : "--"
  const feePayoutDisplay = feePayout ? formatAddress(feePayout) : "--"
  const ownerDisplay = owner ? formatAddress(owner) : "--"

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
          value={contractAddressDisplay}
          showCopyIcon={!!contractAddress}
          onCopy={() => contractAddress && handleCopy(contractAddress, "Contract Address")}
        />
        <DetailRow
          label="Management Fees"
          value={managementFee}
        />
        <DetailRow
          label="Performance Fee"
          value={performanceFee}
        />
        <DetailRow
          label="Audited by"
          value={auditedBy}
          showCopyIcon={!!constants?.audited_by && constants.audited_by.trim() !== ""}
          onCopy={() => constants?.audited_by && handleCopy(constants.audited_by, "Audited by")}
        />
        <DetailRow
          label="Vault Deployment Date"
          value={deploymentDate}
        />
        <DetailRow
          label="Rate Provider Address"
          value={rateProviderDisplay}
          showCopyIcon={!!rateProvider}
          onCopy={() => rateProvider && handleCopy(rateProvider, "Rate Provider Address")}
        />
        <DetailRow
          label="Fee Receipt"
          value={feePayoutDisplay}
          showCopyIcon={!!feePayout}
          onCopy={() => feePayout && handleCopy(feePayout, "Fee Receipt")}
        />
        <DetailRow
          label="Owner Address"
          value={ownerDisplay}
          showCopyIcon={!!owner}
          onCopy={() => owner && handleCopy(owner, "Owner Address")}
        />
      </div>
    </div>
  )
}
