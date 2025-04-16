import { cn } from '@/lib/utils'

type Props = {
	src: string
	alt: string
	className?: string
}

const ImagePreview = ({ src, alt, className }: Props) => {
	return (
		<div className={cn('', className)}>
			<p className="font-bold">Preview</p>

			<img className="w-[250px] max-h-[200px]" src={src} alt={alt} />
		</div>
	)
}

export default ImagePreview
