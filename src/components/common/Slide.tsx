import * as React from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { cn } from '@/lib/utils'

export type ItemsPerSlide = {
	sm?: number
	md?: number
	lg?: number
	xl?: number
}

export interface SlideProps<T> {
	itemsPerSlide?: ItemsPerSlide
	carouselStyle?: string
	items: T[]
	className?: string
	renderItem: (item: T, index: number) => React.ReactNode
	auto?: boolean
	delay?: number
}
const Slide = <T,>({
	items,
	className,
	renderItem,
	carouselStyle,
	auto = false,
	delay = 2000,
}: SlideProps<T>) => {
	return (
		<Carousel
			plugins={
				auto
					? [
							Autoplay({
								delay,
							}),
						]
					: undefined
			}
			className={cn('w-full', className)}>
			<CarouselContent className="ml-0 md:-ml-4 flex justify-center">
				{items.map((item, index) => (
					<CarouselItem
						className={cn(
							'sm:basis-1/1 md:basis-1/2 lg:basis-1/3 xl:basis-1/3 max-w-max',
							carouselStyle
						)}
						key={index}>
						{renderItem(item, index)}
					</CarouselItem>
				))}
			</CarouselContent>
			{/* <CarouselPrevious /> */}
			{/* <CarouselNext /> */}
		</Carousel>
	)
}

export default Slide
