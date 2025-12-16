'use client';

import * as React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { designTokens } from '@/lib/design-system';

interface ConnectWalletButtonProps {
  isBridgeContext?: boolean;
  className?: string;
}

export function ConnectWalletButton({ 
  isBridgeContext = false,
  className 
}: ConnectWalletButtonProps) {

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
            className={className}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="relative inline-flex items-center justify-center whitespace-nowrap focus-visible:outline-none"
                    style={{
                      backgroundColor: isBridgeContext 
                        ? designTokens.colors.primary 
                        : 'rgba(127, 86, 217, 0.15)',
                      color: isBridgeContext 
                        ? '#FFFFFF' 
                        : designTokens.colors.primary,
                      boxShadow: '-4px -4px 5px 0px #FFFFFF, 4px 4px 5px 0px rgba(0,0,0,0.08)',
                      borderRadius: '9999px',
                      height: 'auto',
                      paddingLeft: '16px',
                      paddingRight: '16px',
                      paddingTop: '10px',
                      paddingBottom: '10px',
                      border: '3px solid #F4F0FF',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'Hanken Grotesk, sans-serif',
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: '16px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.boxShadow = 'inset 4px 4px 6px 0px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.boxShadow = '-4px -4px 5px 0px #FFFFFF, 4px 4px 5px 0px rgba(0,0,0,0.08)';
                    }}
                  >
                    Connect Wallet
                  </button>
                );
              }

              return (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="relative inline-flex items-center justify-center whitespace-nowrap focus-visible:outline-none"
                    style={{
                      backgroundColor: isBridgeContext 
                        ? designTokens.colors.primary 
                        : 'rgba(127, 86, 217, 0.15)',
                      color: isBridgeContext 
                        ? '#FFFFFF' 
                        : designTokens.colors.primary,
                      boxShadow: '-4px -4px 5px 0px #FFFFFF, 4px 4px 5px 0px rgba(0,0,0,0.08)',
                      borderRadius: '9999px',
                      height: 'auto',
                      paddingLeft: '16px',
                      paddingRight: '16px',
                      paddingTop: '10px',
                      paddingBottom: '10px',
                      border: '3px solid #F4F0FF',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'Hanken Grotesk, sans-serif',
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: '16px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.boxShadow = 'inset 4px 4px 6px 0px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.boxShadow = '-4px -4px 5px 0px #FFFFFF, 4px 4px 5px 0px rgba(0,0,0,0.08)';
                    }}
                  >
                    {account.displayName}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

