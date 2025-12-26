"use client"

import * as React from "react"

interface IconProps {
  src: string
  className?: string
  style?: React.CSSProperties
  fallback?: string // Optional fallback icon path
}

export function Icon({ src, className, style, fallback }: IconProps) {
  const [svgContent, setSvgContent] = React.useState<string | null>(null)
  const [currentSrc, setCurrentSrc] = React.useState(src)

  React.useEffect(() => {
    setCurrentSrc(src)
    setSvgContent(null)
  }, [src])

  React.useEffect(() => {
    fetch(currentSrc)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`)
        }
        return res.text()
      })
      .then((text) => {
        const updatedSvg = text.replace(
          /<svg([^>]*)>/,
          '<svg$1 style="display: block; width: 100%; height: 100%;" class="icon-svg">'
        )
        setSvgContent(updatedSvg)
      })
      .catch(() => {
        // If fetch fails and we have a fallback, try the fallback
        if (fallback && currentSrc !== fallback) {
          setCurrentSrc(fallback)
        } else {
          setSvgContent(null)
        }
      })
  }, [currentSrc, fallback])

  if (!svgContent) return null

  return (
    <div
      className={className}
      style={{
        ...style,
        color: 'inherit',
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  )
}
