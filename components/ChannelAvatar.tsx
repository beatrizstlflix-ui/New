'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ChannelAvatar({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return <div className="w-12 h-12 rounded-full bg-panel2 shrink-0" />
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={48}
      height={48}
      className="rounded-full shrink-0 w-12 h-12 object-cover"
      onError={() => setFailed(true)}
    />
  )
}
