import { Button } from '@/components/ui/button'

interface ModalFooterProps {
	onClose: () => void
}

export function ModalFooter({ onClose }: ModalFooterProps) {
	return (
		<div className="flex justify-end space-x-2 p-4 border-t mt-auto">
			<Button variant="outline" onClick={onClose}>
				Close
			</Button>
		</div>
	)
}
