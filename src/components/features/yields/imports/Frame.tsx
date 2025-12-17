"use client"

import React from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import svgPathsDefault from './svg-default';
import svgPathsRibbon from './svg-ribbon';
import { TokenType } from '../token-selector';
import { tokenData, TokenData } from '../token-data';
import { designTokens } from '@/lib/design-system';
import { StrategyType } from '@/app/(dashboard)/yields/page';
import InitiateDepositButton from '../initiate-deposit-button';

// Helper components for text
function Text({ text, additionalClassNames = "" }: { text: string; additionalClassNames?: string }) {
  return (
    <div className={clsx("flex-none", additionalClassNames)}>
      <div className="flex flex-col font-['Hanken_Grotesk:Bold',sans-serif] h-[31.484px] justify-center leading-[0] relative text-[32px] text-black w-[17.636px]">
        <p className="leading-[normal]">{text}</p>
      </div>
    </div>
  );
}

function Text1({ text, additionalClassNames = "" }: { text: string; additionalClassNames?: string }) {
  return (
    <div className={clsx("flex-none", additionalClassNames)}>
      <div className="flex flex-col font-['Hanken_Grotesk:Bold',sans-serif] h-[31.484px] justify-center leading-[0] relative text-[32px] text-black w-[7.556px]">
        <p className="leading-[normal]">{text}</p>
      </div>
    </div>
  );
}

function Text2({ text, additionalClassNames = "" }: { text: string; additionalClassNames?: string }) {
  return (
    <div className={clsx("flex-none", additionalClassNames)}>
      <div className="flex flex-col font-['Hanken_Grotesk:Bold',sans-serif] h-[31.484px] justify-center leading-[0] relative text-[32px] text-black w-[19.968px]">
        <p className="leading-[normal]">{text}</p>
      </div>
    </div>
  );
}

function Text3({ text, additionalClassNames = "" }: { text: string; additionalClassNames?: string }) {
  return (
    <div className={clsx("flex-none", additionalClassNames)}>
      <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.188px] justify-center leading-[0] opacity-50 relative text-[12.188px] text-black w-[7.76px]">
        <p className="leading-[normal]">{text}</p>
      </div>
    </div>
  );
}

function Text4({ text, additionalClassNames = "" }: { text: string; additionalClassNames?: string }) {
  return (
    <div className={clsx("flex-none", additionalClassNames)}>
      <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.188px] justify-center leading-[0] opacity-50 relative text-[12.188px] text-black w-[7.213px]">
        <p className="leading-[normal]">{text}</p>
      </div>
    </div>
  );
}

function Text5({ text, additionalClassNames = "" }: { text: string; additionalClassNames?: string }) {
  return (
    <div className={clsx("flex-none", additionalClassNames)}>
      <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.188px] justify-center leading-[0] opacity-50 relative text-[12.188px] text-black w-[7.129px]">
        <p className="leading-[normal]">{text}</p>
      </div>
    </div>
  );
}

function Text6({ text, additionalClassNames = "" }: { text: string; additionalClassNames?: string }) {
  return (
    <div className={clsx("flex-none", additionalClassNames)}>
      <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.188px] justify-center leading-[0] opacity-50 relative text-[12px] text-black w-[8.415px]">
        <p className="leading-[normal]">{text}</p>
      </div>
    </div>
  );
}

function Text7({ text, additionalClassNames = "" }: { text: string; additionalClassNames?: string }) {
  return (
    <div className={clsx("flex-none", additionalClassNames)}>
      <div className="flex flex-col font-['Hanken_Grotesk:Bold',sans-serif] h-[31.484px] justify-center leading-[0] relative text-[32px] text-black w-[19.201px]">
        <p className="leading-[normal]">{text}</p>
      </div>
    </div>
  );
}

function Helper1({ additionalClassNames = "" }: { additionalClassNames?: string }) {
  return (
    <div className={clsx("flex-none", additionalClassNames)}>
      <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.188px] justify-center leading-[0] opacity-50 relative text-[12.188px] text-black w-[3.178px]">
        <p className="leading-[normal]"></p>
      </div>
    </div>
  );
}

interface YieldsCircleProps {
  tokenType?: TokenType;
  isAnimating?: boolean;
}

export default function YieldsCircle({ tokenType = 'usd', isAnimating = false }: YieldsCircleProps) {
  const data = tokenData[tokenType];

  React.useEffect(() => {
    console.log('YieldsCircle: tokenType changed to', tokenType, 'data:', data);
  }, [tokenType, data]);

  return (
    <div className="relative w-[600px] h-[600px]">
      <Circle 
        svgPaths={svgPathsDefault} 
        tokenData={data}
        tokenType={tokenType}
        isAnimating={isAnimating}
      />
    </div>
  );
}

interface CircleProps {
  svgPaths: any;
  tokenData: TokenData;
  tokenType: TokenType;
  isAnimating?: boolean;
}

function Circle({ svgPaths, tokenData, tokenType, isAnimating = false }: CircleProps) {
  return (
    <div className="absolute left-[57px] size-[600px] top-[188px]">
      {/* Main circles - all circles at base z-index */}
      {/* Outermost circle (600px) - appears with gradient arc */}
      <div className={`absolute bg-[#f4f0ff] left-1/2 rounded-[11238.9px] shadow-[4.496px_4.496px_13.488px_0px_rgba(127,86,217,0.12),-4.496px_-4.496px_11.24px_0px_white] size-[600px] top-1/2 -translate-x-1/2 -translate-y-1/2 ${isAnimating ? 'opacity-0 animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '7000ms', animationFillMode: 'forwards', zIndex: 1 }} />
      {/* Second last outer circle (568px) - appears 1 sec after 280px, with shadows */}
      <div className={`absolute bg-[#f4f0ff] border border-solid border-white left-1/2 rounded-[11238.9px] shadow-[3.799px_3.799px_11.398px_0px_rgba(127,86,217,0.12),-3.799px_-3.799px_9.499px_0px_white] size-[568px] top-1/2 -translate-x-1/2 -translate-y-1/2 ${isAnimating ? 'opacity-0 animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '4000ms', animationFillMode: 'forwards', zIndex: 1 }} />
      {/* Innermost circle (280px) - appears 1 sec after texts, with shadows like 134px circle */}
      <div className={`absolute bg-[#f4f0ff] border-[2.248px] border-[rgba(255,255,255,0.64)] border-solid left-1/2 rounded-[186.584px] shadow-[3.799px_3.799px_11.398px_0px_rgba(127,86,217,0.12),-3.799px_-3.799px_9.499px_0px_white] size-[280px] top-1/2 -translate-x-1/2 -translate-y-1/2 ${isAnimating ? 'opacity-0 animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '3000ms', animationFillMode: 'forwards', zIndex: 1 }} />
      
      <Logo tokenData={tokenData} isAnimating={isAnimating} />
      
      {/* Segments - appears 1 sec after second last circle */}
      <div className={`absolute left-1/2 size-[542px] top-[calc(50%+1px)] -translate-x-1/2 -translate-y-1/2 ${isAnimating ? 'opacity-0 animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '5000ms', animationFillMode: 'forwards', zIndex: 5 }}>
        {/* Bottom left */}
        <div className="absolute" style={{ inset: '50.87% 68.7% 11.96% 0.21%' }}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 169 202" style={{ shapeRendering: 'crispEdges' }}>
            <defs>
              <clipPath id="clip1">
                <path d={svgPaths.p4a95f40} />
              </clipPath>
              <filter id="innerShadow1" x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2.0" result="blur"/>
                <feOffset in="blur" dx="-3.5" dy="-3.5" result="offsetBlur"/>
                <feFlood floodColor="rgba(127, 86, 217, 0.18)" result="shadowColor"/>
                <feComposite in="shadowColor" in2="offsetBlur" operator="in" result="innerShadow1"/>
                
                <feGaussianBlur in="SourceAlpha" stdDeviation="2.0" result="blur2"/>
                <feOffset in="blur2" dx="3.5" dy="3.5" result="offsetBlur2"/>
                <feFlood floodColor="rgba(255, 255, 255, 0.5)" result="lightColor"/>
                <feComposite in="lightColor" in2="offsetBlur2" operator="in" result="innerShadow2"/>
                
                <feMerge>
                  <feMergeNode in="SourceGraphic"/>
                  <feMergeNode in="innerShadow1"/>
                  <feMergeNode in="innerShadow2"/>
                </feMerge>
              </filter>
            </defs>
            {/* Fill with shadow, clipped to shape */}
            <g clipPath="url(#clip1)">
              <path d={svgPaths.p4a95f40} fill="#F8F5FF" filter="url(#innerShadow1)" />
            </g>
          </svg>
        </div>
        
        {/* Bottom right */}
        <div className="absolute" style={{ inset: '50.88% 0.21% 11.95% 68.7%' }}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 169 202" style={{ shapeRendering: 'crispEdges' }}>
            <defs>
              <clipPath id="clip2">
                <path d={svgPaths.pd1d2730} />
              </clipPath>
              <filter id="innerShadow2" x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2.0" result="blur"/>
                <feOffset in="blur" dx="-3.5" dy="-3.5" result="offsetBlur"/>
                <feFlood floodColor="rgba(127, 86, 217, 0.18)" result="shadowColor"/>
                <feComposite in="shadowColor" in2="offsetBlur" operator="in" result="innerShadow1"/>
                
                <feGaussianBlur in="SourceAlpha" stdDeviation="2.0" result="blur2"/>
                <feOffset in="blur2" dx="3.5" dy="3.5" result="offsetBlur2"/>
                <feFlood floodColor="rgba(255, 255, 255, 0.5)" result="lightColor"/>
                <feComposite in="lightColor" in2="offsetBlur2" operator="in" result="innerShadow2"/>
                
                <feMerge>
                  <feMergeNode in="SourceGraphic"/>
                  <feMergeNode in="innerShadow1"/>
                  <feMergeNode in="innerShadow2"/>
                </feMerge>
              </filter>
            </defs>
            {/* Fill with shadow, clipped to shape */}
            <g clipPath="url(#clip2)">
              <path d={svgPaths.pd1d2730} fill="#F8F5FF" filter="url(#innerShadow2)" />
            </g>
          </svg>
        </div>
        
        {/* Top left */}
        <div className="absolute" style={{ inset: '8.24% 0.21% 50.88% 65.61%' }}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 186 222" style={{ shapeRendering: 'crispEdges' }}>
            <defs>
              <clipPath id="clip3">
                <path d={svgPaths.p22bfbf00} />
              </clipPath>
              <filter id="innerShadow3" x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2.0" result="blur"/>
                <feOffset in="blur" dx="-3.5" dy="-3.5" result="offsetBlur"/>
                <feFlood floodColor="rgba(127, 86, 217, 0.18)" result="shadowColor"/>
                <feComposite in="shadowColor" in2="offsetBlur" operator="in" result="innerShadow1"/>
                
                <feGaussianBlur in="SourceAlpha" stdDeviation="2.0" result="blur2"/>
                <feOffset in="blur2" dx="3.5" dy="3.5" result="offsetBlur2"/>
                <feFlood floodColor="rgba(255, 255, 255, 0.5)" result="lightColor"/>
                <feComposite in="lightColor" in2="offsetBlur2" operator="in" result="innerShadow2"/>
                
                <feMerge>
                  <feMergeNode in="SourceGraphic"/>
                  <feMergeNode in="innerShadow1"/>
                  <feMergeNode in="innerShadow2"/>
                </feMerge>
              </filter>
            </defs>
            {/* Fill with shadow, clipped to shape */}
            <g clipPath="url(#clip3)">
              <path d={svgPaths.p22bfbf00} fill="#F8F5FF" filter="url(#innerShadow3)" />
            </g>
          </svg>
        </div>
        
        {/* Top right */}
        <div className="absolute" style={{ inset: '8.24% 65.61% 50.85% 0.2%' }}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 186 222" style={{ shapeRendering: 'crispEdges' }}>
            <defs>
              <clipPath id="clip4">
                <path d={svgPaths.p9e6a4f0} />
              </clipPath>
              <filter id="innerShadow4" x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2.0" result="blur"/>
                <feOffset in="blur" dx="-3.5" dy="-3.5" result="offsetBlur"/>
                <feFlood floodColor="rgba(127, 86, 217, 0.18)" result="shadowColor"/>
                <feComposite in="shadowColor" in2="offsetBlur" operator="in" result="innerShadow1"/>
                
                <feGaussianBlur in="SourceAlpha" stdDeviation="2.0" result="blur2"/>
                <feOffset in="blur2" dx="3.5" dy="3.5" result="offsetBlur2"/>
                <feFlood floodColor="rgba(255, 255, 255, 0.5)" result="lightColor"/>
                <feComposite in="lightColor" in2="offsetBlur2" operator="in" result="innerShadow2"/>
                
                <feMerge>
                  <feMergeNode in="SourceGraphic"/>
                  <feMergeNode in="innerShadow1"/>
                  <feMergeNode in="innerShadow2"/>
                </feMerge>
              </filter>
            </defs>
            {/* Fill with shadow, clipped to shape */}
            <g clipPath="url(#clip4)">
              <path d={svgPaths.p9e6a4f0} fill="#F8F5FF" filter="url(#innerShadow4)" />
            </g>
          </svg>
        </div>
        
        {/* Top center */}
        <div className="absolute" style={{ inset: '0 28.44% 75.58% 28.45%' }}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 234 133" style={{ shapeRendering: 'crispEdges' }}>
            <defs>
              <clipPath id="clip5">
                <path d={svgPaths.p16541700 || svgPaths.pa7c6800 || svgPaths.p1dbf7680} />
              </clipPath>
              <filter id="innerShadow5" x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2.0" result="blur"/>
                <feOffset in="blur" dx="-3.5" dy="-3.5" result="offsetBlur"/>
                <feFlood floodColor="rgba(127, 86, 217, 0.18)" result="shadowColor"/>
                <feComposite in="shadowColor" in2="offsetBlur" operator="in" result="innerShadow1"/>
                
                <feGaussianBlur in="SourceAlpha" stdDeviation="2.0" result="blur2"/>
                <feOffset in="blur2" dx="3.5" dy="3.5" result="offsetBlur2"/>
                <feFlood floodColor="rgba(255, 255, 255, 0.5)" result="lightColor"/>
                <feComposite in="lightColor" in2="offsetBlur2" operator="in" result="innerShadow2"/>
                
                <feMerge>
                  <feMergeNode in="SourceGraphic"/>
                  <feMergeNode in="innerShadow1"/>
                  <feMergeNode in="innerShadow2"/>
                </feMerge>
              </filter>
            </defs>
            {/* Fill with shadow, clipped to shape */}
            <g clipPath="url(#clip5)">
              <path d={svgPaths.p16541700 || svgPaths.pa7c6800 || svgPaths.p1dbf7680} fill="#F8F5FF" filter="url(#innerShadow5)" />
            </g>
          </svg>
        </div>
      </div>
      
      {/* Token Icon - appears with segments, above segments */}
      <div className={`absolute flex items-center justify-center left-[79.56px] size-[30.211px] top-[346.97px] ${isAnimating ? 'opacity-0 animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '5000ms', animationFillMode: 'forwards', zIndex: 7 }}>
        <div className="flex-none rotate-[72.113deg]">
          <TokenIcon tokenData={tokenData} />
        </div>
      </div>
      
      {/* Stable Yield USD and syUSD text - appear 2 seconds later, from center of circle, above everything */}
      <div 
        className={`${isAnimating ? 'opacity-0 animate-appear-from-behind' : 'opacity-0'}`} 
        style={{ 
          animationDelay: '2000ms', 
          animationFillMode: 'forwards', 
          zIndex: 11, 
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          transformOrigin: '300px 300px', // Center of 600px circle
          pointerEvents: 'none',
        }}
      >
        <CurveTextTokenSymbol svgPaths={svgPaths} tokenData={tokenData} />
        <CurveTextStableYield svgPaths={svgPaths} tokenData={tokenData} />
      </div>
      
      {/* All other curved texts - appear with segments, above segments */}
      <div className={`${isAnimating ? 'opacity-0 animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '5000ms', animationFillMode: 'forwards', zIndex: 7, position: 'relative', pointerEvents: 'none' }}>
      <CurveTextLifetime svgPaths={svgPaths} tokenData={tokenData} />
      <CurveText56K svgPaths={svgPaths} tokenData={tokenData} />
      <CurveTextShare svgPaths={svgPaths} tokenData={tokenData} />
      <CurveText104 svgPaths={svgPaths} tokenData={tokenData} />
      <CurveTextBaseApy svgPaths={svgPaths} tokenData={tokenData} />
      <CurveText2144 svgPaths={svgPaths} tokenData={tokenData} />
      <CurveTextTvl svgPaths={svgPaths} tokenData={tokenData} />
      <CurveText222K svgPaths={svgPaths} tokenData={tokenData} />
      <CurveText228K svgPaths={svgPaths} tokenData={tokenData} />
      <CurveTextFastRedeemed svgPaths={svgPaths} tokenData={tokenData} />
      </div>
      
      {/* Button - appears 1 sec after segments, above text */}
      <InitiateDepositButton isAnimating={isAnimating} />
    </div>
  );
}

function Logo({ tokenData, isAnimating = false }: { tokenData: TokenData; isAnimating?: boolean }) {
  return (
    <div className="absolute left-[233px] size-[134px] top-[233px]">
      {/* Logo circle - grows from center, appears 1st */}
      <div className={`absolute bg-[#f4f0ff] left-1/2 rounded-[9497.64px] shadow-[3.799px_3.799px_11.398px_0px_rgba(127,86,217,0.12),-3.799px_-3.799px_9.499px_0px_white] size-[134px] top-1/2 -translate-x-1/2 -translate-y-1/2 ${isAnimating ? 'opacity-0 animate-grow-from-center' : 'opacity-0'}`} style={{ animationDelay: '0ms', animationFillMode: 'forwards', zIndex: 2 }} />
      {/* Logo image - appears 1 second later, rotating and growing from center */}
      <div className={`absolute left-1/2 size-[72px] top-1/2 -translate-x-1/2 -translate-y-1/2 ${isAnimating ? 'opacity-0 animate-rotate-grow-from-center' : 'opacity-0'}`} style={{ animationDelay: '1000ms', animationFillMode: 'forwards', zIndex: 2 }}>
        <Image
          key={tokenData.symbol}
          src={tokenData.centerIcon}
          alt={tokenData.name}
          width={72}
          height={72}
          className="object-contain"
        />
      </div>
    </div>
  );
}

function TokenIcon({ tokenData }: { tokenData: TokenData }) {
  return (
    <div className="relative size-[24px]">
      <Image
        key={tokenData.symbol}
        src={tokenData.smallIcon}
        alt={tokenData.symbol}
        width={24}
        height={24}
        className="object-contain"
      />
    </div>
  );
}

// LIFETIME RETURNS curved text (left side)
function CurveTextLifetime({ svgPaths, tokenData }: { svgPaths: any; tokenData: TokenData }) {
  return (
    <div className="absolute contents left-[125.86px] top-[163.94px]">
      <div className="absolute flex h-[9.295px] items-center justify-center left-[125.86px] top-[267.4px] -translate-y-1/2 w-[13.38px]">
        <div className="flex-none rotate-[281.959deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.212px] justify-center leading-[0] opacity-50 relative text-[12px] text-black w-[6.915px]">
            <p className="leading-[normal]">L</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[6.101px] items-center justify-center left-[127.42px] top-[262.18px] -translate-y-1/2 w-[12.643px]">
        <div className="flex-none rotate-[283.788deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.212px] justify-center leading-[0] opacity-50 relative text-[12px] text-black w-[3.285px]">
            <p className="leading-[normal]">I</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[10.242px] items-center justify-center left-[128.29px] top-[256.88px] -translate-y-1/2 w-[13.706px]">
        <div className="flex-none rotate-[285.665deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.212px] justify-center leading-[0] opacity-50 relative text-[12px] text-black w-[7.213px]">
            <p className="leading-[normal]">F</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[10.799px] items-center justify-center left-[130.4px] top-[249.64px] -translate-y-1/2 w-[13.898px]">
        <div className="flex-none rotate-[288.256deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.212px] justify-center leading-[0] opacity-50 relative text-[12px] text-black w-[7.344px]">
            <p className="leading-[normal]">E</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[11.736px] items-center justify-center left-[132.88px] top-[242.22px] -translate-y-1/2 w-[14.226px]">
        <div className="flex-none rotate-[290.953deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.212px] justify-center leading-[0] opacity-50 relative text-[12px] text-black w-[7.891px]">
            <p className="leading-[normal]">T</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[7.782px] items-center justify-center left-[135.88px] top-[236.88px] -translate-y-1/2 w-[12.527px]">
        <div className="flex-none rotate-[292.923deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.212px] justify-center leading-[0] opacity-50 relative text-[12px] text-black w-[3.285px]">
            <p className="leading-[normal]">I</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[15.213px] items-center justify-center left-[137.32px] top-[230.06px] -translate-y-1/2 w-[15.77px]">
        <div className="flex-none rotate-[295.477deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.212px] justify-center leading-[0] opacity-50 relative text-[12px] text-black w-[11.033px]">
            <p className="leading-[normal]">M</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[12.31px] items-center justify-center left-[142.44px] top-[221.55px] -translate-y-1/2 w-[14.238px]">
        <div className="flex-none rotate-[298.736deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.212px] justify-center leading-[0] opacity-50 relative text-[12px] text-black w-[7.344px]">
            <p className="leading-[normal]">E</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[13.335px] items-center justify-center left-[150.09px] top-[208.73px] -translate-y-1/2 w-[14.524px]">
        <div className="flex-none rotate-[303.837deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.212px] justify-center leading-[0] opacity-50 relative text-[12px] text-black w-[7.867px]">
            <p className="leading-[normal]">R</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[13.169px] items-center justify-center left-[154.82px] top-[202.26px] -translate-y-1/2 w-[14.184px]">
        <div className="flex-none rotate-[306.518deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.212px] justify-center leading-[0] opacity-50 relative text-[12px] text-black w-[7.344px]">
            <p className="leading-[normal]">E</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[13.833px] items-center justify-center left-[159.54px] top-[196.01px] -translate-y-1/2 w-[14.451px]">
        <div className="flex-none rotate-[309.197deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.212px] justify-center leading-[0] opacity-50 relative text-[12px] text-black w-[7.891px]">
            <p className="leading-[normal]">T</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[14.938px] items-center justify-center left-[164.94px] top-[189.33px] -translate-y-1/2 w-[15.155px]">
        <div className="flex-none rotate-[312.178deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.212px] justify-center leading-[0] opacity-50 relative text-[12px] text-black w-[9.093px]">
            <p className="leading-[normal]">U</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[14.206px] items-center justify-center left-[171.5px] top-[182.96px] -translate-y-1/2 w-[14.19px]">
        <div className="flex-none rotate-[315.151deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.212px] justify-center leading-[0] opacity-50 relative text-[12px] text-black w-[7.867px]">
            <p className="leading-[normal]">R</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[15.235px] items-center justify-center left-[177.53px] top-[176.88px] -translate-y-1/2 w-[15.001px]">
        <div className="flex-none rotate-[318.143deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.212px] justify-center leading-[0] opacity-50 relative text-[12px] text-black w-[9.2px]">
            <p className="leading-[normal]">N</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[14.43px] items-center justify-center left-[184.89px] top-[171.15px] -translate-y-1/2 w-[13.77px]">
        <div className="flex-none rotate-[321.134deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.212px] justify-center leading-[0] opacity-50 relative text-[12px] text-black w-[7.843px]">
            <p className="leading-[normal]">S</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Lifetime Returns curved text (left side) - dynamic
function CurveText56K({ svgPaths, tokenData }: { svgPaths: any; tokenData: TokenData }) {
  // Parse value like "$5.6K" or "$4.2K" or "$3.1K"
  const value = tokenData.lifetimeReturns;
  // Extract parts: "$", "5", ".", "6", "K"
  const parts = value.match(/(\$)(\d)(\.)(\d)(K)/);
  if (!parts) return null;
  
  const [_, dollar, firstDigit, dot, secondDigit, k] = parts;
  
  return (
    <div className="absolute contents left-[80.16px] top-[147px]">
      <div className="absolute flex h-[27.558px] items-center justify-center left-[80.16px] top-[222.32px] -translate-y-1/2 w-[35.67px]">
        <Text text={dollar} additionalClassNames="rotate-[290.532deg]" />
      </div>
      <div className="absolute flex h-[29.501px] items-center justify-center left-[87.44px] top-[204.82px] -translate-y-1/2 w-[36.013px]">
        <Text text={firstDigit} additionalClassNames="rotate-[295.577deg]" />
      </div>
      <div className="absolute flex h-[21.947px] items-center justify-center left-[96.12px] top-[192.73px] -translate-y-1/2 w-[31.173px]">
        <Text1 text={dot} additionalClassNames="rotate-[299.179deg]" />
      </div>
      <div className="absolute flex h-[31.867px] items-center justify-center left-[100.67px] top-[181.1px] -translate-y-1/2 w-[36.02px]">
        <Text text={secondDigit} additionalClassNames="rotate-[302.758deg]" />
      </div>
      <div className="absolute flex h-[35.14px] items-center justify-center left-[111.9px] top-[164.57px] -translate-y-1/2 w-[37.097px]">
        <Text2 text={k} additionalClassNames="rotate-[308.096deg]" />
      </div>
    </div>
  );
}

// SHARE curved text (bottom left)
function CurveTextShare({ svgPaths, tokenData }: { svgPaths: any; tokenData: TokenData }) {
  return (
    <div className="absolute contents h-[72.676px] left-[122.82px] top-[339.69px] w-[54.477px]">
      <div className="absolute flex h-[9.607px] items-center justify-center left-[128.81px] top-[345.56px] -translate-y-1/2 w-[13.484px]">
        <div className="flex-none rotate-[76.094deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.188px] justify-center leading-[0] opacity-50 relative text-[12.188px] text-black w-[6.879px]">
            <p className="leading-[normal]">S</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[11.395px] items-center justify-center left-[130.44px] top-[352.55px] -translate-y-1/2 w-[14.038px]">
        <div className="flex-none rotate-[73.418deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.188px] justify-center leading-[0] opacity-50 relative text-[12.188px] text-black w-[8.26px]">
            <p className="leading-[normal]">H</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[11.372px] items-center justify-center left-[132.8px] top-[359.89px] -translate-y-1/2 w-[14.075px]">
        <Text3 text="A" additionalClassNames="rotate-[70.573deg]" />
      </div>
      <div className="absolute flex h-[11.266px] items-center justify-center left-[135.4px] top-[366.65px] -translate-y-1/2 w-[14.005px]">
        <Text4 text="R" additionalClassNames="rotate-[67.912deg]" />
      </div>
      <div className="absolute flex h-[11.559px] items-center justify-center left-[138.12px] top-[372.99px] -translate-y-1/2 w-[14.05px]">
        <Text5 text="E" additionalClassNames="rotate-[65.376deg]" />
      </div>
      <div className="absolute flex h-[8.272px] items-center justify-center left-[141.11px] top-[377.47px] -translate-y-1/2 w-[12.328px]">
        <Helper1 additionalClassNames="rotate-[63.56deg]" />
      </div>
      <div className="absolute flex h-[8.456px] items-center justify-center left-[142.53px] top-[380.19px] -translate-y-1/2 w-[12.275px]">
        <Helper1 additionalClassNames="rotate-[62.443deg]" />
      </div>
      <div className="absolute flex h-[11.85px] items-center justify-center left-[143.97px] top-[384.38px] -translate-y-1/2 w-[13.931px]">
        <div className="flex-none rotate-[60.697deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.188px] justify-center leading-[0] opacity-50 relative text-[12.188px] text-black w-[6.748px]">
            <p className="leading-[normal]">P</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[12.548px] items-center justify-center left-[147.28px] top-[390.19px] -translate-y-1/2 w-[14.159px]">
        <Text4 text="R" additionalClassNames="rotate-[58.237deg]" />
      </div>
      <div className="absolute flex h-[9.237px] items-center justify-center left-[151.11px] top-[394.33px] -translate-y-1/2 w-[11.814px]">
        <div className="flex-none rotate-[56.442deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.188px] justify-center leading-[0] opacity-50 relative text-[12.188px] text-black w-[2.999px]">
            <p className="leading-[normal]">I</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[14.071px] items-center justify-center left-[152.73px] top-[398.93px] -translate-y-1/2 w-[14.905px]">
        <div className="flex-none rotate-[54.408deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.188px] justify-center leading-[0] opacity-50 relative text-[12.188px] text-black w-[8.581px]">
            <p className="leading-[normal]">C</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[13.153px] items-center justify-center left-[157.74px] top-[404.97px] -translate-y-1/2 w-[13.981px]">
        <Text5 text="E" additionalClassNames="rotate-[51.653deg]" />
      </div>
    </div>
  );
}

// Share price curved text (bottom left)
function CurveText104({ svgPaths, tokenData }: { svgPaths: any; tokenData: TokenData }) {
  return (
    <div className="absolute contents h-[69.536px] left-[83.44px] top-[372.64px] w-[60.723px]">
      <div className="absolute flex h-[27.971px] items-center justify-center left-[85.89px] top-[387.92px] -translate-y-1/2 w-[35.762px]">
        <Text text="1" additionalClassNames="rotate-[68.444deg]" />
      </div>
      <div className="absolute flex h-[20.228px] items-center justify-center left-[92.53px] top-[398.62px] -translate-y-1/2 w-[31.709px]">
        <Text1 text="." additionalClassNames="rotate-[64.832deg]" />
      </div>
      <div className="absolute flex h-[30.608px] items-center justify-center left-[95.61px] top-[408.97px] -translate-y-1/2 w-[36.086px]">
        <Text text="0" additionalClassNames="rotate-[61.245deg]" />
      </div>
      <div className="absolute flex h-[32.159px] items-center justify-center left-[106.01px] top-[424.95px] -translate-y-1/2 w-[35.976px]">
        <Text text="4" additionalClassNames="rotate-[56.238deg]" />
      </div>
    </div>
  );
}

// BASE APY curved text (top)
function CurveTextBaseApy({ svgPaths, tokenData }: { svgPaths: any; tokenData: TokenData }) {
  return (
    <div className="absolute contents left-[267.05px] top-[125.77px]">
      <div className="absolute flex h-[13.319px] items-center justify-center left-[267.05px] top-[134.14px] -translate-y-1/2 w-[9.844px]">
        <div className="flex-none rotate-[350.673deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.188px] justify-center leading-[0] opacity-50 relative text-[12px] text-black w-[7.974px]">
            <p className="leading-[normal]">B</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[13.053px] items-center justify-center left-[275.56px] top-[132.97px] -translate-y-1/2 w-[9.726px]">
        <Text6 text="A" additionalClassNames="rotate-[353.571deg]" />
      </div>
      <div className="absolute flex h-[12.653px] items-center justify-center left-[284.5px] top-[132.24px] -translate-y-1/2 w-[8.568px]">
        <div className="flex-none rotate-[356.408deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.188px] justify-center leading-[0] opacity-50 relative text-[12px] text-black w-[7.82px]">
            <p className="leading-[normal]">S</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[12.307px] items-center justify-center left-[292.89px] top-[131.93px] -translate-y-1/2 w-[7.533px]">
        <div className="flex-none rotate-[359.05deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.188px] justify-center leading-[0] opacity-50 relative text-[12px] text-black w-[7.332px]">
            <p className="leading-[normal]">E</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[12.769px] items-center justify-center left-[307.34px] top-[132.36px] -translate-y-1/2 w-[9.282px]">
        <Text6 text="A" additionalClassNames="rotate-[4.188deg]" />
      </div>
      <div className="absolute flex h-[13.048px] items-center justify-center left-[315.73px] top-[133.18px] -translate-y-1/2 w-[9.217px]">
        <div className="flex-none rotate-[7.028deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.188px] justify-center leading-[0] opacity-50 relative text-[12px] text-black w-[7.784px]">
            <p className="leading-[normal]">P</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[13.425px] items-center justify-center left-[323.46px] top-[134.41px] -translate-y-1/2 w-[10.238px]">
        <div className="flex-none rotate-[9.866deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.188px] justify-center leading-[0] opacity-50 relative text-[12px] text-black w-[8.272px]">
            <p className="leading-[normal]">Y</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Base APY curved text (top) - dynamic
function CurveText2144({ svgPaths, tokenData }: { svgPaths: any; tokenData: TokenData }) {
  const apyStr = tokenData.baseApy.toFixed(2);
  // Parse "21.44" -> ["2", "1", ".", "4", "4"]
  const parts = apyStr.match(/(\d)(\d)(\.)(\d)(\d)/);
  if (!parts) return null;
  
  const [_, first, second, dot, third, fourth] = parts;
  
  return (
    <div className="absolute contents left-[243.04px] top-[67.48px]">
      <div className="absolute flex h-[34.702px] items-center justify-center left-[243.04px] top-[87.7px] -translate-y-1/2 w-[25.139px]">
        <Text7 text={first} additionalClassNames="rotate-[348.401deg]" />
      </div>
      <div className="absolute flex h-[32.817px] items-center justify-center left-[262.33px] top-[84.91px] -translate-y-1/2 w-[16.574px]">
        <div className="flex-none rotate-[352.958deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Bold',sans-serif] h-[31.484px] justify-center leading-[0] relative text-[32px] text-black w-[12.81px]">
            <p className="leading-[normal]">{second}</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[32.035px] items-center justify-center left-[278.73px] top-[83.78px] -translate-y-1/2 w-[11.223px]">
        <div className="flex-none rotate-[356.052deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Bold',sans-serif] h-[31.484px] justify-center leading-[0] relative text-[32px] text-black w-[9.076px]">
            <p className="leading-[normal]">{dot}</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[31.551px] items-center justify-center left-[290.01px] top-[83.26px] -translate-y-1/2 w-[20.441px]">
        <div className="flex-none rotate-[0.189deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Bold',sans-serif] h-[31.484px] justify-center leading-[0] relative text-[32px] text-black w-[20.337px]">
            <p className="leading-[normal]">{third}</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[33.41px] items-center justify-center left-[310.37px] top-[84.42px] -translate-y-1/2 w-[23.47px]">
        <div className="flex-none rotate-[5.907deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Bold',sans-serif] h-[31.484px] justify-center leading-[0] relative text-[32px] text-black w-[20.337px]">
            <p className="leading-[normal]">{fourth}</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[37.727px] items-center justify-center left-[330.76px] top-[89.03px] -translate-y-1/2 w-[37.306px]">
        <div className="flex-none rotate-[13.235deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Bold',sans-serif] h-[31.484px] justify-center leading-[0] relative text-[32px] text-black w-[30.919px]">
            <p className="leading-[normal]">%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// TVL curved text (right)
function CurveTextTvl({ svgPaths, tokenData }: { svgPaths: any; tokenData: TokenData }) {
  return (
    <div className="absolute contents left-[436.75px] top-[207.09px]">
      <div className="absolute flex h-[13.029px] items-center justify-center left-[436.75px] top-[213.6px] -translate-y-1/2 w-[14.499px]">
        <div className="flex-none rotate-[58.927deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.188px] justify-center leading-[0] opacity-50 relative text-[12px] text-black w-[7.867px]">
            <p className="leading-[normal]">T</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[13.175px] items-center justify-center left-[440.82px] top-[220.94px] -translate-y-1/2 w-[14.717px]">
        <Text6 text="V" additionalClassNames="rotate-[61.802deg]" />
      </div>
      <div className="absolute flex h-[11.464px] items-center justify-center left-[444.79px] top-[228.05px] -translate-y-1/2 w-[13.967px]">
        <div className="flex-none rotate-[64.518deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.188px] justify-center leading-[0] opacity-50 relative text-[12px] text-black w-[6.891px]">
            <p className="leading-[normal]">L</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// TVL value curved text (right)
function CurveText222K({ svgPaths, tokenData }: { svgPaths: any; tokenData: TokenData }) {
  return (
    <div className="absolute contents left-[446.58px] top-[142.01px]">
      <div className="absolute flex h-[35.783px] items-center justify-center left-[446.58px] top-[159.9px] -translate-y-1/2 w-[37.075px]">
        <div className="flex-none rotate-[49.645deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Bold',sans-serif] h-[31.484px] justify-center leading-[0] relative text-[32px] text-black w-[20.204px]">
            <p className="leading-[normal]">$</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[33.726px] items-center justify-center left-[459.68px] top-[176.77px] -translate-y-1/2 w-[36.813px]">
        <Text7 text="2" additionalClassNames="rotate-[55.236deg]" />
      </div>
      <div className="absolute flex h-[32.156px] items-center justify-center left-[470.62px] top-[194.29px] -translate-y-1/2 w-[36.853px]">
        <Text7 text="2" additionalClassNames="rotate-[60.688deg]" />
      </div>
      <div className="absolute flex h-[30.278px] items-center justify-center left-[480.06px] top-[212.87px] -translate-y-1/2 w-[36.556px]">
        <Text7 text="2" additionalClassNames="rotate-[66.187deg]" />
      </div>
      <div className="absolute flex h-[29.878px] items-center justify-center left-[487.84px] top-[233.13px] -translate-y-1/2 w-[36.492px]">
        <div className="flex-none rotate-[71.95deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Bold',sans-serif] h-[31.484px] justify-center leading-[0] relative text-[32px] text-black w-[21.164px]">
            <p className="leading-[normal]">K</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fast redeemed curved text (bottom right)
function CurveText228K({ svgPaths, tokenData }: { svgPaths: any; tokenData: TokenData }) {
  return (
    <div className="absolute contents h-[111.647px] left-[444.6px] top-[339.96px] w-[88.618px]">
      <div className="absolute flex h-[32.814px] items-center justify-center left-[451.37px] top-[433.3px] -translate-y-1/2 w-[35.826px]">
        <Text text="$" additionalClassNames="rotate-[306.151deg]" />
      </div>
      <div className="absolute flex h-[31.38px] items-center justify-center left-[462.11px] top-[417.59px] -translate-y-1/2 w-[36.068px]">
        <Text text="2" additionalClassNames="rotate-[301.15deg]" />
      </div>
      <div className="absolute flex h-[29.705px] items-center justify-center left-[471.75px] top-[401.17px] -translate-y-1/2 w-[36.034px]">
        <Text text="2" additionalClassNames="rotate-[296.144deg]" />
      </div>
      <div className="absolute flex h-[19.054px] items-center justify-center left-[480.4px] top-[388.43px] -translate-y-1/2 w-[31.975px]">
        <Text1 text="." additionalClassNames="rotate-[292.552deg]" />
      </div>
      <div className="absolute flex h-[26.899px] items-center justify-center left-[483.61px] top-[375.46px] -translate-y-1/2 w-[35.504px]">
        <Text text="8" additionalClassNames="rotate-[288.936deg]" />
      </div>
      <div className="absolute flex h-[26.798px] items-center justify-center left-[490.3px] top-[355.74px] -translate-y-1/2 w-[35.291px]">
        <Text2 text="K" additionalClassNames="rotate-[283.571deg]" />
      </div>
    </div>
  );
}

// FAST REDEEMED curved text (bottom right)
function CurveTextFastRedeemed({ svgPaths, tokenData }: { svgPaths: any; tokenData: TokenData }) {
  return (
    <div className="absolute contents left-[427.21px] top-[335.8px]">
      <div className="absolute flex h-[12.199px] items-center justify-center left-[427.21px] top-[405px] -translate-y-1/2 w-[13.193px]">
        <div className="flex-none rotate-[308.602deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.188px] justify-center leading-[0] opacity-50 relative text-[12.188px] text-black w-[5.88px]">
            <p className="leading-[normal]">F</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[13.46px] items-center justify-center left-[430.59px] top-[399.78px] -translate-y-1/2 w-[14.418px]">
        <Text3 text="A" additionalClassNames="rotate-[306.202deg]" />
      </div>
      <div className="absolute flex h-[12.419px] items-center justify-center left-[434.86px] top-[394.02px] -translate-y-1/2 w-[13.918px]">
        <div className="flex-none rotate-[303.634deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.188px] justify-center leading-[0] opacity-50 relative text-[12.188px] text-black w-[6.808px]">
            <p className="leading-[normal]">S</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[12.43px] items-center justify-center left-[438.35px] top-[388.36px] -translate-y-1/2 w-[14.13px]">
        <div className="flex-none rotate-[301.181deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.188px] justify-center leading-[0] opacity-50 relative text-[12.188px] text-black w-[7.153px]">
            <p className="leading-[normal]">T</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[8.745px] items-center justify-center left-[441.83px] top-[384.07px] -translate-y-1/2 w-[12.18px]">
        <Helper1 additionalClassNames="rotate-[299.359deg]" />
      </div>
      <div className="absolute flex h-[8.566px] items-center justify-center left-[443.27px] top-[381.39px] -translate-y-1/2 w-[12.241px]">
        <Helper1 additionalClassNames="rotate-[298.235deg]" />
      </div>
      <div className="absolute flex h-[11.878px] items-center justify-center left-[444.63px] top-[376.93px] -translate-y-1/2 w-[14.123px]">
        <Text4 text="R" additionalClassNames="rotate-[296.393deg]" />
      </div>
      <div className="absolute flex h-[11.447px] items-center justify-center left-[447.62px] top-[370.65px] -translate-y-1/2 w-[14.029px]">
        <Text5 text="E" additionalClassNames="rotate-[293.839deg]" />
      </div>
      <div className="absolute flex h-[12.139px] items-center justify-center left-[450.29px] top-[363.81px] -translate-y-1/2 w-[14.361px]">
        <div className="flex-none rotate-[291.107deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.188px] justify-center leading-[0] opacity-50 relative text-[12.188px] text-black w-[8.308px]">
            <p className="leading-[normal]">D</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[10.608px] items-center justify-center left-[453.06px] top-[356.84px] -translate-y-1/2 w-[13.813px]">
        <Text5 text="E" additionalClassNames="rotate-[288.374deg]" />
      </div>
      <div className="absolute flex h-[10.185px] items-center justify-center left-[455.15px] top-[350.27px] -translate-y-1/2 w-[13.67px]">
        <Text5 text="E" additionalClassNames="rotate-[285.837deg]" />
      </div>
      <div className="absolute flex h-[12.658px] items-center justify-center left-[456.99px] top-[342.12px] -translate-y-1/2 w-[14.141px]">
        <div className="flex-none rotate-[282.732deg]">
          <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal h-[12.188px] justify-center leading-[0] opacity-50 relative text-[12.188px] text-black w-[10.224px]">
            <p className="leading-[normal]">M</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Token symbol curved text (dynamic)
function CurveTextTokenSymbol({ svgPaths, tokenData }: { svgPaths: any; tokenData: TokenData }) {
  const symbol = tokenData.symbol.toLowerCase();
  const chars = symbol.split('');
  
  // Position mapping for each character - adjusted for syUSD (5 chars), syETH (5 chars), syBTC (5 chars)
  // All have 5 characters, so we can use the same positions
  const positions = [
    { left: '283.38px', top: '348.06px', rotate: '17.664deg', h: '11.526px' },
    { left: '289.31px', top: '349.39px', rotate: '9.479deg', h: '11.063px' },
    { left: '295.78px', top: '349.93px', rotate: '0deg', h: '10.125px' },
    { left: '302.44px', top: '349.34px', rotate: '350.087deg', h: '11.237px' },
    { left: '308.02px', top: '347.57px', rotate: '340.128deg', h: '12.293px' },
  ];
  
  return (
    <div className="absolute contents left-[283.38px] top-[341.42px]">
      {chars.map((char: string, idx: number) => {
        if (idx >= positions.length) return null;
        const pos = positions[idx];
        return (
          <div 
            key={idx}
            className="absolute flex items-center justify-center -translate-y-1/2"
            style={{ left: pos.left, top: pos.top, height: pos.h }}
          >
            <div className={`flex-none rotate-[${pos.rotate}]`}>
              <div className="flex flex-col font-['Hanken_Grotesk:SemiBold',sans-serif] font-semibold h-[10.125px] justify-center leading-[0] relative text-[10px] text-black">
                <p className="leading-[normal]">{char}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Stable Yield token name curved text (dynamic)
function CurveTextStableYield({ svgPaths, tokenData }: { svgPaths: any; tokenData: TokenData }) {
  // Get token color based on symbol
  const getTokenColor = (symbol: string) => {
    if (symbol.includes('USD')) return designTokens.colors.strategy.usd;
    if (symbol.includes('ETH')) return designTokens.colors.strategy.eth;
    if (symbol.includes('BTC')) return designTokens.colors.strategy.btc;
    return designTokens.colors.strategy.usd;
  };

  const tokenColor = getTokenColor(tokenData.symbol);
  
  // Extract the token type: "USD", "ETH", or "BTC"
  const tokenType = tokenData.name.replace('Stable Yield ', '').toUpperCase();
  
  return (
    <div className="absolute contents left-[255.79px] top-[244.77px]">
      {/* Stable Yield - static part */}
      <div className="absolute flex h-[11.946px] items-center justify-center left-[255.79px] top-[267.48px] -translate-y-1/2 w-[12.284px]">
        <div className="flex-none rotate-[310.529deg]">
          <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[10.125px] justify-center leading-[0] not-italic relative text-[10.125px] w-[7.06px]" style={{ color: tokenColor }}>
            <p className="leading-[normal]">S</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[10.116px] items-center justify-center left-[261.31px] top-[263.09px] -translate-y-1/2 w-[9.736px]">
        <div className="flex-none rotate-[317.484deg]">
          <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[10.125px] justify-center leading-[0] not-italic relative text-[10.125px] w-[3.925px]" style={{ color: tokenColor }}>
            <p className="leading-[normal]">t</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[11.863px] items-center justify-center left-[265.05px] top-[259.51px] -translate-y-1/2 w-[11.012px]">
        <div className="flex-none rotate-[323.939deg]">
          <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[10.125px] justify-center leading-[0] not-italic relative text-[10.125px] w-[6.249px]" style={{ color: tokenColor }}>
            <p className="leading-[normal]">a</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[12.11px] items-center justify-center left-[271.35px] top-[255.68px] -translate-y-1/2 w-[10.703px]">
        <div className="flex-none rotate-[332.22deg]">
          <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[10.125px] justify-center leading-[0] not-italic relative text-[10.125px] w-[6.763px]" style={{ color: tokenColor }}>
            <p className="leading-[normal]">b</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[10.526px] items-center justify-center left-[278.39px] top-[253.41px] -translate-y-1/2 w-[6.518px]">
        <div className="flex-none rotate-[338.49deg]">
          <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[10.125px] justify-center leading-[0] not-italic relative text-[10.125px] w-[3.016px]" style={{ color: tokenColor }}>
            <p className="leading-[normal]">l</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[11.481px] items-center justify-center left-[282.19px] top-[251.74px] -translate-y-1/2 w-[8.928px]">
        <div className="flex-none rotate-[344.567deg]">
          <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[10.125px] justify-center leading-[0] not-italic relative text-[10.125px] w-[6.467px]" style={{ color: tokenColor }}>
            <p className="leading-[normal]">e</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[10.414px] items-center justify-center left-[294.1px] top-[249.98px] -translate-y-1/2 w-[7.565px]">
        <div className="flex-none rotate-[357.609deg]">
          <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[10.125px] justify-center leading-[0] not-italic relative text-[10.125px] w-[7.149px]" style={{ color: tokenColor }}>
            <p className="leading-[normal]">Y</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[10.311px] items-center justify-center left-[301.69px] top-[250.06px] -translate-y-1/2 w-[3.717px]">
        <div className="flex-none rotate-[4.011deg]">
          <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[10.125px] justify-center leading-[0] not-italic relative text-[10.125px] w-[3.016px]" style={{ color: tokenColor }}>
            <p className="leading-[normal]">i</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[11.097px] items-center justify-center left-[304.71px] top-[250.71px] -translate-y-1/2 w-[8.132px]">
        <div className="flex-none rotate-[10.038deg]">
          <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[10.125px] justify-center leading-[0] not-italic relative text-[10.125px] w-[6.467px]" style={{ color: tokenColor }}>
            <p className="leading-[normal]">e</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[10.564px] items-center justify-center left-[311.09px] top-[251.91px] -translate-y-1/2 w-[5.712px]">
        <div className="flex-none rotate-[16.143deg]">
          <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[10.125px] justify-center leading-[0] not-italic relative text-[10.125px] w-[3.016px]" style={{ color: tokenColor }}>
            <p className="leading-[normal]">l</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[11.938px] items-center justify-center left-[314.01px] top-[253.7px] -translate-y-1/2 w-[10.111px]">
        <div className="flex-none rotate-[22.4deg]">
          <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[10.125px] justify-center leading-[0] not-italic relative text-[10.125px] w-[6.763px]" style={{ color: tokenColor }}>
            <p className="leading-[normal]">d</p>
          </div>
        </div>
      </div>
      {/* Dynamic token type: USD, ETH, or BTC */}
      <div className="absolute flex h-[12.954px] items-center justify-center left-[323.31px] top-[259.6px] -translate-y-1/2 w-[12.517px]">
        <div className="flex-none rotate-[36.246deg]">
          <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[10.125px] justify-center leading-[0] not-italic relative text-[10.125px] w-[8.098px]" style={{ color: tokenColor }}>
            <p className="leading-[normal]">{tokenType[0]}</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[12.118px] items-center justify-center left-[329.84px] top-[265.14px] -translate-y-1/2 w-[12.183px]">
        <div className="flex-none rotate-[45.855deg]">
          <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[10.125px] justify-center leading-[0] not-italic relative text-[10.125px] w-[7.06px]" style={{ color: tokenColor }}>
            <p className="leading-[normal]">{tokenType[1]}</p>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[12.233px] items-center justify-center left-[334.8px] top-[271.55px] -translate-y-1/2 w-[12.804px]">
        <div className="flex-none rotate-[55.328deg]">
          <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[10.125px] justify-center leading-[0] not-italic relative text-[10.125px] w-[7.871px]" style={{ color: tokenColor }}>
            <p className="leading-[normal]">{tokenType[2]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


function RibbonBase({ strategyType }: { strategyType: StrategyType }) {
  const getGradientColors = (strategy: StrategyType) => {
    switch (strategy) {
      case "flagship":
        return { from: "#9071fb", to: "#5433c7", text: "Flagship" };
      case "delta-neutral":
        return { from: "#E26C36", to: "#93390F", text: "Delta Neutral" };
      case "leverage-looping":
        return { from: "#E91E63", to: "#AA0808", text: "Leverage Looping" };
      default:
        return { from: "#9071fb", to: "#5433c7", text: "Flagship" };
    }
  };

  const colors = getGradientColors(strategyType);

  return (
    <div 
      className="content-stretch flex items-start justify-center px-[10.529px] py-[3.396px] relative shrink-0" 
      style={{
        background: `linear-gradient(to bottom, ${colors.from}, ${colors.to})`,
      }}
      data-name="Ribbon Base"
    >
      <p 
        className="font-['Poppins:Bold',sans-serif] leading-[10.529px] not-italic relative shrink-0 text-[7.132px] text-center text-nowrap text-white whitespace-pre"
        style={{
          minWidth: strategyType === "flagship" ? "auto" : "max-content",
        }}
      >
        {colors.text}
      </p>
    </div>
  );
}

function RibbonBaseContainer({ strategyType }: { strategyType: StrategyType }) {
  return (
    <div className="mb-[-12.227px] relative shrink-0 w-full z-[2]" data-name="Ribbon Base Container">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center px-[13.925px] py-0 relative w-full">
          <RibbonBase strategyType={strategyType} />
        </div>
      </div>
    </div>
  );
}

function RibbonBottom({ strategyType, id }: { strategyType: StrategyType; id: string }) {
  const getGradientColors = (strategy: StrategyType) => {
    switch (strategy) {
      case "flagship":
        return { from: "#9071fb", to: "#5433c7" };
      case "delta-neutral":
        return { from: "#E26C36", to: "#93390F" };
      case "leverage-looping":
        return { from: "#E91E63", to: "#AA0808" };
      default:
        return { from: "#9071fb", to: "#5433c7" };
    }
  };

  const colors = getGradientColors(strategyType);

  return (
    <div className="relative size-[17.321px]" data-name="Ribbon Bottom">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Ribbon Bottom">
          <path d={svgPathsRibbon.p111b3c00} fill={`url(#paint0_linear_${id})`} id="Base" />
          <path d={svgPathsRibbon.p3e414c00} fill="var(--fill-0, black)" fillOpacity="0.4" id="Shadow" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id={`paint0_linear_${id}`} x1="8.6606" x2="8.6606" y1="0" y2="17.3212">
            <stop stopColor={colors.from} />
            <stop offset="1" stopColor={colors.to} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function RibbonBottom1({ strategyType, id }: { strategyType: StrategyType; id: string }) {
  const getGradientColors = (strategy: StrategyType) => {
    switch (strategy) {
      case "flagship":
        return { from: "#9071fb", to: "#5433c7" };
      case "delta-neutral":
        return { from: "#E26C36", to: "#93390F" };
      case "leverage-looping":
        return { from: "#E91E63", to: "#AA0808" };
      default:
        return { from: "#9071fb", to: "#5433c7" };
    }
  };

  const colors = getGradientColors(strategyType);

  return (
    <div className="relative shrink-0 size-[17.321px]" data-name="Ribbon Bottom">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Ribbon Bottom">
          <path d={svgPathsRibbon.p111b3c00} fill={`url(#paint0_linear_${id})`} id="Base" />
          <path d={svgPathsRibbon.p3e414c00} fill="var(--fill-0, black)" fillOpacity="0.4" id="Shadow" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id={`paint0_linear_${id}`} x1="8.6606" x2="8.6606" y1="0" y2="17.3212">
            <stop stopColor={colors.from} />
            <stop offset="1" stopColor={colors.to} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function RibbonBottoms({ strategyType }: { strategyType: StrategyType }) {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Ribbon Bottoms">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <RibbonBottom strategyType={strategyType} id="ribbon-bottom-1" />
        </div>
      </div>
      <RibbonBottom1 strategyType={strategyType} id="ribbon-bottom-2" />
    </div>
  );
}

function RibbonBottomsContainer({ strategyType }: { strategyType: StrategyType }) {
  return (
    <div className="mb-[-12.227px] relative shrink-0 w-full z-[1]" data-name="Ribbon Bottoms Container">
      <div className="size-full">
        <div className="content-stretch flex flex-col items-start px-[3.396px] py-0 relative w-full">
          <RibbonBottoms strategyType={strategyType} />
        </div>
      </div>
    </div>
  );
}

interface RibbonProps {
  strategyType?: StrategyType;
}

export function Ribbon({ strategyType = "flagship" }: RibbonProps) {
  return (
    <div className="relative content-stretch flex flex-col isolate items-center pb-[12.227px] pt-0 px-0" data-name="Ribbon">
      <RibbonBaseContainer strategyType={strategyType} />
      <RibbonBottomsContainer strategyType={strategyType} />
    </div>
  );
}
