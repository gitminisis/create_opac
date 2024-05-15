import React from 'react'

import Slide from './Slide'
import { ChevronLeft, ChevronRight, Scan } from 'lucide-react'
import LightboxImage from './LightboxImage'

export type ImageProps = {
	src: string
	alt?: string
	caption?: string
}
export interface ImageCarouselProps {
	items: ImageProps[]
	renderItems: (item: ImageProps, index: number) => React.ReactNode
}

const ImageCarousel = ({ items, renderItems }: ImageCarouselProps) => {
	const [current, setCurrent] = React.useState(0)
	const [openLightbox, setOpenLightbox] = React.useState(false)
	const currentImage = items[current]

	return (
		<div className="flex flex-col space-y-4">
			<div className="flex w-full group cursor-pointer relative">
				// eslint-disable-next-line jsx-a11y/alt-text
				<img className="mx-auto w-full lg:max-w-[400px]" {...currentImage} />
				<Scan
					strokeWidth={'3px'}
					className="cursor-pointer absolute bg-gray-400 bg-opacity-30  w-8 h-8 text-white hover:text-primary bottom-2 right-2 transition-all ease-in duration-400 "
					onClick={() => setOpenLightbox(true)}
				/>
				<ChevronLeft
					strokeWidth={'3px'}
					className="cursor-pointer absolute bg-gray-400 bg-opacity-30 w-8 h-8 text-white hover:text-primary left-2 top-1/2  transition-all ease-in duration-400 "
					onClick={() => setCurrent(current - 1 < 0 ? 0 : current - 1)}
				/>
				<ChevronRight
					strokeWidth={'3px'}
					className="cursor-pointer absolute bg-gray-400 bg-opacity-30  w-8 h-8 text-white hover:text-primary right-2 top-1/2 transition-all ease-in duration-400 "
					onClick={() =>
						setCurrent(current + 1 === items.length ? items.length - 1 : current + 1)
					}
				/>
				<LightboxImage onOpen={setOpenLightbox} open={openLightbox} items={items} />
			</div>

			<Slide
				carouselStyle="sm:basis-1/4"
				items={items}
				renderItem={(item, index) => (
					<div className="cursor-pointer w-fit" onClick={() => setCurrent(index)}>
						{renderItems(item, index)}
					</div>
				)}
				auto={false}
			/>
		</div>
	)
}

export default ImageCarousel
