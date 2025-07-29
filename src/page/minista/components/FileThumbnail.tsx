import { FileItem } from '@/types/tdr'

interface FileThumbnailProps {
	file: FileItem
}

export function FileThumbnail({ file }: FileThumbnailProps) {
	return (
		<div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
			<img src={file.thumbnail} alt={file.name} className="w-full h-full object-contain" />
		</div>
	)
}
