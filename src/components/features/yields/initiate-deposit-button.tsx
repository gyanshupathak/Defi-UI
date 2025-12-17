"use client"

import React, { useState } from 'react';
import clsx from 'clsx';
import svgPathsDefault from './imports/svg-default';
import svgPathsHover from './imports/svg-hover';
import svgPathsPressed from './imports/svg-pressed';

export type ButtonState = 'default' | 'hover' | 'pressed';

interface InitiateDepositButtonProps {
  isAnimating?: boolean;
  onButtonClick?: () => void;
}

export default function InitiateDepositButton({ 
  isAnimating = false,
  onButtonClick 
}: InitiateDepositButtonProps) {
  const [buttonState, setButtonState] = useState<ButtonState>('default');

  const svgPaths = buttonState === 'hover' 
    ? svgPathsHover 
    : buttonState === 'pressed' 
    ? svgPathsPressed 
    : svgPathsDefault;

  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
    }
  };

  return (
    <div className={`absolute h-[550px] left-[29px] top-[20px] w-[542px] ${isAnimating ? 'opacity-0 animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '6000ms', animationFillMode: 'forwards', zIndex: 12 }}>
      {/* Secondary Layer */}
      <div className={clsx(
        "absolute bottom-0 h-[141.611px] left-[calc(50%+0.24px)] -translate-x-1/2 w-[294.01px]",
        "transition-all duration-150 ease-out",
        buttonState === 'pressed' && "bottom-[-3px] opacity-80"
      )}>
        <div className="absolute inset-[-6.35%_-3.82%_-7.94%_-3.06%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 315 162">
            <g filter="url(#filter0_dd_btn_sec)">
              <path d={svgPaths.p22396800 || svgPaths.pe971480} fill="#F4F0FF" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="161.843" id="filter0_dd_btn_sec" width="314.242" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="-3.372" dy="-3.372" />
                <feGaussianBlur stdDeviation="2.81" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
                <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="4.496" dy="4.496" />
                <feGaussianBlur stdDeviation="3.372" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix values="0 0 0 0 0.0327817 0 0 0 0 0.151743 0 0 0 0 0.276112 0 0 0 0.15 0" />
                <feBlend in2="effect1_dropShadow" result="effect2_dropShadow" />
                <feBlend in="SourceGraphic" in2="effect2_dropShadow" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>

      {/* Main Button */}
      <div 
        className={clsx(
          "absolute h-[119.504px] left-[calc(50%-0.34px)] -translate-x-1/2 w-[257.865px]",
          "cursor-pointer transition-all duration-150 ease-out",
          buttonState === 'default' && "bottom-[11px]",
          buttonState === 'hover' && "bottom-[13px] brightness-105",
          buttonState === 'pressed' && "bottom-[7px] brightness-95"
        )}
        style={{ pointerEvents: 'auto', zIndex: 10 }}
        onClick={handleClick}
        onMouseEnter={() => {
          console.log('Button hover enter - buttonState:', buttonState);
          setButtonState('hover');
        }}
        onMouseLeave={() => {
          console.log('Button hover leave - buttonState:', buttonState);
          setButtonState('default');
        }}
        onMouseDown={() => {
          console.log('Button mouse down - buttonState:', buttonState);
          setButtonState('pressed');
        }}
        onMouseUp={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            setButtonState('hover');
          } else {
            setButtonState('default');
          }
        }}
        onTouchStart={() => setButtonState('pressed')}
        onTouchEnd={() => setButtonState('default')}
      >
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 258 120" style={{ pointerEvents: 'none' }}>
          <path d={svgPaths.p56f3800} fill="#5496DE" />
        </svg>
        
        {/* DEPOSIT text */}
        <div className="absolute left-1/2 top-[57%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="flex flex-col items-center">
            <p className="font-['Hanken_Grotesk:Bold',sans-serif] leading-[normal] text-[12.188px] text-white uppercase tracking-wider opacity-90 mb-2">Initiate</p>
            <p className="font-['Hanken_Grotesk:Bold',sans-serif] leading-[normal] text-[24.18px] text-white">DEPOSIT</p>
          </div>
        </div>
      </div>
    </div>
  );
}

