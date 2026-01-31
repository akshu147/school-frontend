'use client'

import * as React from 'react'

// Fallback for AvatarPrimitive if '@radix-ui/react-avatar' is not installed
const AvatarPrimitive = {
  Root: (props: React.ComponentProps<'div'>) => <div {...props} />,
  Image: (props: React.ComponentProps<'img'>) => <img {...props} />,
  Fallback: (props: React.ComponentProps<'span'>) => <span {...props} />,
};

import { cn } from '@/lib/utils'

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        'relative flex size-8 shrink-0 overflow-hidden rounded-full',
        className,
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('aspect-square size-full', className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        'bg-linear-to-r/srgb from-indigo-500 to-teal-400 flex size-full items-center justify-center rounded-full',
        className,
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
