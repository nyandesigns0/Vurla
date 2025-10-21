"use client";

import { ReactNode } from "react";

interface LoadingSpinnerProps {
  isVisible: boolean;
  text?: string;
  spinnerSize?: 'sm' | 'md' | 'lg';
  overlayOpacity?: number;
  zIndex?: number;
  children?: ReactNode;
}

export function LoadingSpinner({
  isVisible,
  text,
  spinnerSize = 'md',
  overlayOpacity = 0.3,
  zIndex = 50,
  children
}: LoadingSpinnerProps) {
  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden"
      style={{ zIndex }}
    >
      {/* Color swipe animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20 animate-swipe" />
      
      {/* Enhanced blur overlay with multiple layers */}
      <div className="absolute inset-0">
        {/* Primary blur layer */}
        <div 
          className="absolute inset-0 animate-blur-pulse"
          style={{
            background: `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%), 
                        radial-gradient(circle at 70% 80%, rgba(0,0,0,0.1) 0%, transparent 50%)`,
            backdropFilter: 'blur(2px)',
            animation: 'blurPulse 2s ease-in-out infinite'
          }}
        />
        
        {/* Secondary animated blur layer */}
        <div 
          className="absolute inset-0 animate-blur-wave"
          style={{
            background: `linear-gradient(45deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.02) 50%, rgba(255,255,255,0.05) 100%)`,
            backdropFilter: 'blur(1px)',
            animation: 'blurWave 3s ease-in-out infinite'
          }}
        />
        
        {/* Subtle color wash */}
        <div 
          className="absolute inset-0 animate-color-wash"
          style={{
            background: `linear-gradient(135deg, rgba(var(--primary-rgb, 0,0,0), 0.03) 0%, transparent 50%, rgba(var(--primary-rgb, 0,0,0), 0.03) 100%)`,
            animation: 'colorWash 4s ease-in-out infinite'
          }}
        />
      </div>
      
      {text && (
        <div className="absolute inset-0 flex items-center justify-center">
			  <p className="text-body-sm-medium opacity-60 animate-fade-in">
            {text}
          </p>
        </div>
      )}
      {children}
    </div>
  );
}
