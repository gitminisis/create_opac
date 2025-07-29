import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface ModalFooterProps {
	onClose: () => void
}

export function ModalFooter({ onClose }: ModalFooterProps) {
	return (
		<div className="flex justify-end space-x-2 p-4 border-t mt-auto">
			<Button variant="outline" onClick={onClose}>
				Close
			</Button>
			<Button>
				<Download className="w-4 h-4 mr-2" /> Download
			</Button>
		</div>
	)
}
