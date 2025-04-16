// ScrollAreaComponents.tsx

import * as React from 'react'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { cn } from '@/lib/utils' // Adjust the path to your utility function if needed

export const ScrollAreaRoot = React.forwardRef<
	React.ElementRef<typeof ScrollArea.Root>,
	React.ComponentPropsWithoutRef<typeof ScrollArea.Root>
>(({ className, ...props }, ref) => (
	<ScrollArea.Root
		ref={ref}
		className={cn(
			'w-[200px] h-[225px] rounded overflow-hidden shadow-[0_2px_10px] shadow-blackA4 bg-white',
			className
		)}
		{...props}
	/>
))
ScrollAreaRoot.displayName = ScrollArea.Root.displayName

export const ScrollAreaViewport = React.forwardRef<
	React.ElementRef<typeof ScrollArea.Viewport>,
	React.ComponentPropsWithoutRef<typeof ScrollArea.Viewport>
>(({ className, ...props }, ref) => (
	<ScrollArea.Viewport ref={ref} className={cn('w-full h-full rounded', className)} {...props} />
))
ScrollAreaViewport.displayName = ScrollArea.Viewport.displayName

export const ScrollAreaScrollbar = React.forwardRef<
	React.ElementRef<typeof ScrollArea.Scrollbar>,
	React.ComponentPropsWithoutRef<typeof ScrollArea.Scrollbar>
>(({ className, orientation, ...props }, ref) => (
	<ScrollArea.Scrollbar
		ref={ref}
		className={cn(
			'flex select-none touch-none p-0.5 bg-blackA3 transition-colors duration-[160ms] ease-out hover:bg-blackA5',
			orientation === 'vertical'
				? 'data-[orientation=vertical]:w-2.5'
				: 'data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5',
			className
		)}
		orientation={orientation}
		{...props}
	/>
))
ScrollAreaScrollbar.displayName = ScrollArea.Scrollbar.displayName

export const ScrollAreaThumb = React.forwardRef<
	React.ElementRef<typeof ScrollArea.Thumb>,
	React.ComponentPropsWithoutRef<typeof ScrollArea.Thumb>
>(({ className, ...props }, ref) => (
	<ScrollArea.Thumb
		ref={ref}
		className={cn(
			"flex-1 bg-mauve10 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]",
			className
		)}
		{...props}
	/>
))
ScrollAreaThumb.displayName = ScrollArea.Thumb.displayName

export const ScrollAreaCorner = React.forwardRef<
	React.ElementRef<typeof ScrollArea.Corner>,
	React.ComponentPropsWithoutRef<typeof ScrollArea.Corner>
>(({ className, ...props }, ref) => (
	<ScrollArea.Corner ref={ref} className={cn('bg-blackA5', className)} {...props} />
))
ScrollAreaCorner.displayName = ScrollArea.Corner.displayName
