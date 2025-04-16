import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { useAdminForm } from '@/hooks/useAdminForm'
import Home from '@/page/Home'
import { ReactNode, useState } from 'react'

const AdminForm = ({
	children,
	enablePreview = false,
}: {
	children?: ReactNode
	enablePreview?: boolean
}) => {
	const { handleFormSave, formData } = useAdminForm()
	const [previewMode, setPreviewMode] = useState(false)

	return (
		<div className="flex col-span-3 flex-row  space-x-4 min-w-[500px] w-full max-w-6xl mx-auto">
			<div className="w-full">{children}</div>

			<div className="w-44 h-full sticky top-0 items-end p-4 space-y-2">
				<Button className="w-28" onClick={() => handleFormSave()}>
					Save changes
				</Button>
				{enablePreview && (
					<Button
						variant="outline"
						className="w-28"
						onClick={() => {
							setPreviewMode(true)
						}}>
						Preview
					</Button>
				)}
			</div>
			<Dialog open={previewMode} onOpenChange={setPreviewMode}>
				<DialogContent className="w-screen max-w-screen-2xl h-[80vh] roundedv">
					<DialogHeader>
						<DialogTitle>Preview</DialogTitle>
						<DialogDescription></DialogDescription>
					</DialogHeader>
					<div className="overflow-auto">
						<Home previewMode={true} previewData={formData} />
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default AdminForm
