"use client"

import * as React from "react"
import { designTokens, typographyClasses } from "@/lib/design-system"
import { cn } from "@/lib/utils"

export interface Tab {
  id: string
  label: string
  badge?: number
}

export interface DashboardTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
  style?: React.CSSProperties
}

export function DashboardTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
  style,
}: DashboardTabsProps) {
  return (
    <div 
      className={cn("flex items-center gap-[32px] relative pb-[1px]", className)}
      style={{
        ...style,
      }}
    >
      <div 
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{
          backgroundColor: designTokens.colors.border.separator,
          zIndex: 0,
        }}
      />
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className="relative flex flex-col items-center justify-end pb-[3px] pt-0 px-0 h-[44px] cursor-pointer bg-transparent border-0"
          style={{
            zIndex: tabs.length - index,
          }}
        >
          <div 
            className="flex items-center gap-[4px] justify-center h-full mb-[-3px] px-[3px] py-0 whitespace-nowrap"
            style={{
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: 'normal',
              color: activeTab === tab.id ? designTokens.colors.primary : '#1d2d3e',
            }}
          >
            <p className="leading-[normal]">{tab.label}</p>
            {tab.badge !== undefined && tab.badge > 0 && (
              <div 
                className="flex items-center justify-center rounded-[99px]"
                style={{
                  backgroundColor: designTokens.colors.status.error,
                  width: '20px',
                  minWidth: '20px',
                  height: '20px',
                  paddingLeft: '4px',
                  paddingRight: '4px',
                  paddingTop: '5px',
                  paddingBottom: '5px',
                }}
              >
                <p 
                  style={{
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    fontSize: '10px',
                    fontWeight: 400,
                    lineHeight: '10px',
                    color: designTokens.colors.background.white,
                    textAlign: 'center',
                  }}
                >
                  {tab.badge}
                </p>
              </div>
            )}
          </div>

          {activeTab === tab.id && (
            <div 
              className="absolute bottom-0 left-0 right-0 h-[3px] rounded-tl-[2px] rounded-tr-[2px]"
              style={{
                backgroundColor: designTokens.colors.primary,
              }}
            />
          )}
        </button>
      ))}
    </div>
  )
}
