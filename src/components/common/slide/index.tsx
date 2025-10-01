import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import Autoplay from 'embla-carousel-autoplay'
import * as React from 'react'

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
const Slide = <T,>({ items, className, renderItem, carouselStyle, auto = false, delay = 2000 }: SlideProps<T>) => {
	const [currentIndex, setCurrentIndex] = React.useState(0)
	const [carouselApi, setCarouselApi] = React.useState<any>(null)
	React.useEffect(() => {
		if (!carouselApi) {
			return
		}

		carouselApi.on('select', () => {
			setCurrentIndex(carouselApi.selectedScrollSnap())
		})
	}, [carouselApi])


	return (
		<div className="w-full mx-auto relative">
			<Carousel
				setApi={setCarouselApi}
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
				<CarouselContent className="ml-0 md:-ml-4">
					{items.map((item, index) => (
						<CarouselItem className={cn('sm:basis-1/1 md:basis-1/2 lg:basis-1/3 xl:basis-1/3 max-w-max', carouselStyle)} key={index}>
							{renderItem(item, index)}
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious className="hidden sm:flex absolute left-[-25px] top-1/2 transform -translate-y-1/2 h-10 w-10 border-2" />
				<CarouselNext className="hidden sm:flex absolute right-[-25px] top-1/2 transform -translate-y-1/2 h-10 w-10 border-2" />
			</Carousel>
			{/* 
			<div className="flex justify-center mt-4 space-x-2">
				{items.map((_, index) => (
					<Button
						key={index}
						variant="outline"
						size="icon"
						className={cn(
							'w-3 h-3 rounded-full p-0',
							currentIndex === index ? 'bg-primary' : 'bg-secondary'
						)}
						onClick={() => handleIndexClick(index)}
					/>
				))}
			</div> */}
		</div>
	)
}

export default Slide
