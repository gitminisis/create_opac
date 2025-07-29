import { Button } from '@/components/ui/button'

interface ModalHeaderProps {
	fileName: string
	onClose: () => void
}

export function ModalHeader({ fileName, onClose }: ModalHeaderProps) {
	return (
		<div className="flex items-center justify-between p-4 border-b">
			<h2 className="text-xl font-semibold">{fileName}</h2>
			<Button variant="ghost" size="sm" onClick={onClose}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="w-5 h-5">
					<path d="M18 6 6 18" />
					<path d="m6 6 12 12" />
				</svg>
			</Button>
		</div>
	)
}
