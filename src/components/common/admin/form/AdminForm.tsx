import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAdminForm } from '@/hooks/useAdminForm'
import Home from '@/page/Home'
import { ReactNode, useState } from 'react'
import { Loader2 } from 'lucide-react'

const AdminForm = ({ children, enablePreview = false }: { children?: ReactNode; enablePreview?: boolean }) => {
	const { handleFormSave, formData, isSubmitting, progress } = useAdminForm()
	const [previewMode, setPreviewMode] = useState(false)
	return (
		<div className="flex col-span-3 flex-row  space-x-4 min-w-[500px] w-full max-w-6xl mx-auto">
			<div className="w-full">{children}</div>

			<div className="w-44 h-full sticky top-0 items-end p-4 space-y-2">
				<Button 
					className="w-28" 
					onClick={handleFormSave} 
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						<div className="flex items-center gap-2">
							<Loader2 className="h-4 w-4 animate-spin" />
							<span>Saving</span>
						</div>
					) : (
						"Save changes"
					)}
				</Button>
				{progress && (
					<div className="text-xs text-muted-foreground mt-1">{progress}</div>
				)}
				{enablePreview && (
					<Button
						variant="outline"
						className="w-28"
						onClick={() => {
							setPreviewMode(true)
						}}
						disabled={isSubmitting}
					>
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
