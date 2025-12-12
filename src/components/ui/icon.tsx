"use client"

import * as React from "react"

interface IconProps {
  src: string
  className?: string
  style?: React.CSSProperties
}

export function Icon({ src, className, style }: IconProps) {
  const [svgContent, setSvgContent] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetch(src)
      .then((res) => res.text())
      .then((text) => {
        // Update SVG to inherit color properly
        const updatedSvg = text.replace(
          /<svg([^>]*)>/,
          '<svg$1 style="display: block; width: 100%; height: 100%;" class="icon-svg">'
        )
        setSvgContent(updatedSvg)
      })
      .catch(() => setSvgContent(null))
  }, [src])

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
