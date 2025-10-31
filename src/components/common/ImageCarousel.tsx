import React from 'react'

import { ChevronLeft, ChevronRight, Scan } from 'lucide-react'
import LightboxImage from './LightboxImage'
import Slide from './slide'

export type ImageProps = {
	src: string
	alt?: string
	caption?: string
}

export interface DocumentProps {
	src: string
	caption?: string
}

export type VideoProps = {
	type: 'video'
	width: number
	height: number
	sources: {
		src: string
		type: 'video/mp4'
	}[]
}
export interface ImageCarouselProps {
	items: (ImageProps | VideoProps)[]
	renderItems: (item: ImageProps | VideoProps, index: number) => React.ReactNode
}

const ImageCarousel = ({ items, renderItems }: ImageCarouselProps) => {
	const [current, setCurrent] = React.useState(0)
	const [openLightbox, setOpenLightbox] = React.useState(false)
	const currentImage = items[current]

	return (
		<div className="flex flex-col space-y-4">
			<div className="flex w-full group cursor-pointer relative">
				{(currentImage as ImageProps).src ? (
					<img
						className="mx-auto w-full lg:max-w-[400px] min-h-[433px] bg-gray-300 rounded"
						{...currentImage}
						alt={(currentImage as ImageProps).src || (currentImage as ImageProps).alt}
					/>
				) : (
					<video className="mx-auto w-full lg:max-w-[400px]" controls>
						<source src={(currentImage as VideoProps).sources[0].src} type="video/mp4"></source>
					</video>
				)}
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
					onClick={() => setCurrent(current + 1 === items.length ? items.length - 1 : current + 1)}
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
