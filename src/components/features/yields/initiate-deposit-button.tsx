"use client"

import { useState } from 'react';

type ButtonState = 'default' | 'hover' | 'pressed';

interface InitiateDepositButtonProps {
  svgPaths: any; // Your SVG paths object
  onButtonClick?: () => void;
}

export function InitiateDepositButton({ svgPaths, onButtonClick }: InitiateDepositButtonProps) {
  const [buttonState, setButtonState] = useState<ButtonState>('default');

  return (
    <div className="absolute h-[180px] left-[67px] top-[490px] w-[542px]">
      {/* Background Shadow Layer */}
      <div className="absolute bottom-0 h-[141.611px] left-1/2 w-[294.01px] -translate-x-1/2 z-0">
        <div className="absolute inset-[-6.35%_-3.82%_-7.94%_-3.06%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 315 162">
            <g filter="url(#filter0_dd_btn_shadow)">
              <path d={svgPaths.pa7c6800} fill="#F4F0FF" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="161.843" id="filter0_dd_btn_shadow" width="314.242" x="0" y="0">
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

      {/* Main Interactive Button */}
      <div 
        className="absolute bottom-[11px] h-[119.504px] left-1/2 w-[257.865px] -translate-x-1/2 z-10 cursor-pointer transition-all duration-150 ease-out"
        style={{
          transform: `translate(-50%, 0) ${buttonState === 'pressed' ? 'translateY(2px)' : ''}`,
          filter: buttonState === 'pressed' 
            ? 'brightness(0.85) drop-shadow(0 1px 2px rgba(0,0,0,0.3))' 
            : buttonState === 'hover'
            ? 'brightness(1.08) drop-shadow(0 6px 12px rgba(84, 150, 222, 0.4))'
            : 'drop-shadow(0 4px 6px rgba(84, 150, 222, 0.25))',
        }}
        onMouseEnter={() => setButtonState('hover')}
        onMouseLeave={() => setButtonState('default')}
        onMouseDown={() => setButtonState('pressed')}
        onMouseUp={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            setButtonState('hover');
            onButtonClick?.();
          } else {
            setButtonState('default');
          }
        }}
        onTouchStart={() => setButtonState('pressed')}
        onTouchEnd={() => {
          setButtonState('default');
          onButtonClick?.();
        }}
      >
        {/* Button SVG Shape */}
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 258 120">
          <path d={svgPaths.p56f3800} fill="#5496DE" />
        </svg>
        
        {/* Text Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* "INITIATE" Text */}
          <div className="absolute left-1/2 top-[18%] -translate-x-1/2">
            <div className="relative w-[50px]">
              <span className="absolute left-0 top-0 text-[12.188px] text-white" style={{ transform: 'rotate(10.157deg)' }}>I</span>
              <span className="absolute left-[3px] top-[1px] text-[12.188px] text-white" style={{ transform: 'rotate(7.956deg)' }}>N</span>
              <span className="absolute left-[12px] top-[2px] text-[12.188px] text-white" style={{ transform: 'rotate(5.751deg)' }}>I</span>
              <span className="absolute left-[15px] top-[2px] text-[12.188px] text-white" style={{ transform: 'rotate(3.811deg)' }}>T</span>
              <span className="absolute left-[23px] top-[2px] text-[12.188px] text-white" style={{ transform: 'rotate(1.869deg)' }}>I</span>
              <span className="absolute left-[27px] top-[2px] text-[12.188px] text-white">A</span>
              <span className="absolute left-[33px] top-[2px] text-[12.188px] text-white" style={{ transform: 'rotate(-2.649deg)' }}>T</span>
              <span className="absolute left-[41px] top-[1px] text-[12.188px] text-white" style={{ transform: 'rotate(-5.296deg)' }}>E</span>
            </div>
          </div>
          
          {/* "DEPOSIT" Text */}
          <div className="absolute left-1/2 top-[48%] -translate-x-1/2">
            <div className="relative w-[105px]">
              <span className="absolute left-0 top-0 text-[24.18px] text-white" style={{ transform: 'rotate(10.848deg)', fontWeight: 700 }}>D</span>
              <span className="absolute left-[17px] top-[2px] text-[24.18px] text-white" style={{ transform: 'rotate(6.124deg)', fontWeight: 700 }}>E</span>
              <span className="absolute left-[32px] top-[3px] text-[24.18px] text-white" style={{ transform: 'rotate(1.88deg)', fontWeight: 700 }}>P</span>
              <span className="absolute left-[46px] top-[3px] text-[24.18px] text-white" style={{ transform: 'rotate(-2.883deg)', fontWeight: 700 }}>O</span>
              <span className="absolute left-[63px] top-[2px] text-[24.18px] text-white" style={{ transform: 'rotate(-7.69deg)', fontWeight: 700 }}>S</span>
              <span className="absolute left-[77px] top-[0] text-[24.18px] text-white" style={{ transform: 'rotate(-10.843deg)', fontWeight: 700 }}>I</span>
              <span className="absolute left-[82px] top-[-3px] text-[24.18px] text-white" style={{ transform: 'rotate(-14.093deg)', fontWeight: 700 }}>T</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}