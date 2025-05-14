import TooltipButton from '@/components/common/TooltipButton'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import useConstants from '@/hooks/useConstants'
import useJSONData from '@/hooks/useJSONData'
import { removeBookmarkFromKey } from '@/lib/bookmark'
import { handleCopyRecordURL } from '@/lib/record'
import { cn } from '@/lib/utils'
import { Record } from '@/types/record'
import { Copy, Trash2 } from 'lucide-react'
import { useState } from 'react'

export const BookmarkRecordAction = ({ record }: { record: Record }) => {
	const { common } = useJSONData({ selector: '#xml_record' })
	const { bookmark_url } = common
	const { toast } = useToast()
	const { message } = useConstants()
	const [loading, setLoading] = useState(false)
	const removeBookmark = () => {
		setLoading(true)

		removeBookmarkFromKey(`${bookmark_url}`, record).then((res) => {
			setLoading(false)
			window.location.reload()
		})
		toast({
			title: `${message.bookmarkHasBeenRemoved}`,
			duration: 500,
		})
		return
	}

	const handleCopy = () => {
		
		handleCopyRecordURL(record)
		toast({
			title: message.recordIsCopied,
		})
	}

	return (
		<>
			<TooltipButton
				variant="ghost"
				size="icon"
				disabled={loading}
				onClick={removeBookmark}
				tooltipContent={`${message.bookmarkRemove}`}>
				<Trash2
					className={cn('h-4 w-4 text-primary')}
					fill={'hsl(var(--opac-blue))'}
					stroke={'hsl(var(--opac-blue))'}
				/>
			</TooltipButton>
			<Separator orientation="vertical" />
			<TooltipButton
				variant="ghost"
				size="icon"
				onClick={handleCopy}
				tooltipContent={message.copyRecordUrl}>
				<Copy className="h-4 w-4 text-primary" />
			</TooltipButton>
		</>
	)
}
