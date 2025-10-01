import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

type Props = {
	src: string
	alt: string
	className?: string
}

const ImagePreview = ({ src, alt, className }: Props) => {
	const [error, setError] = useState(false)
	useEffect(() => {
		setError(false)
	}, [src])
	return (
		<div className={cn('', className)}>
			<p className="font-bold">Preview</p>

			<img
				className="w-[250px] max-h-[200px]"
				src={src}
				alt={alt}
				onError={(e) => {
					setError(true)
					// eslint-disable-next-line no-param-reassign
					;(e.target as HTMLImageElement).src = 'https://placehold.co/1440x1080'
				}}
			/>
			{error && <span className="text-red-500">Unable to load image</span>}
		</div>
	)
}

export default ImagePreview
