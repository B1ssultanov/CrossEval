// components/LogosScroller.tsx
'use client'

import React, { useMemo } from 'react'
import Image from 'next/image'

export interface Logo {
  src: string
  alt: string
  width?: number
  height?: number
}

export interface LogosScrollerProps {
  logos: Logo[]
  /** duration in seconds for one full scroll loop */
  duration?: number
  /** space between logos */
  gapPx?: number
}

export const LogosScroller: React.FC<LogosScrollerProps> = ({
  logos,
  duration = 20,
  gapPx = 32,
}) => {
  // duplicate the array so we can loop seamlessly
  const track = useMemo(() => [...logos, ...logos], [logos])

  return (
    <div className="relative overflow-hidden w-full">
      <div
        className="flex whitespace-nowrap items-center animate-marquee"
        style={{
          // override the default Tailwind animation duration
          '--marquee-duration': `${duration}s`,
        } as React.CSSProperties}
      >
        {track.map((logo, idx) => (
          <div
            key={idx}
            className="flex-shrink-0"
            style={{ marginRight: `${gapPx}px` }}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width ?? 100}
              height={logo.height ?? 50}
              unoptimized={false}
              priority={false}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
