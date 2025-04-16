import { FolderOpen } from 'lucide-react'

export default function EmptyState() {
	return (
		<div className="w-full max-w-3xl mx-auto p-4">
			<div className="text-center py-16 px-4">
				<FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
				<h3 className="mt-2 text-sm font-semibold text-gray-900">No collections</h3>
			</div>
		</div>
	)
}
