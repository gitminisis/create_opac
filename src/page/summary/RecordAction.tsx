import TooltipButton from '@/components/common/TooltipButton'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import useConstants from '@/hooks/useConstants'
import useJSONData from '@/hooks/useJSONData'
import { bookmarkSelect, validateBookmarkResponse } from '@/lib/bookmark'
import { deepSearchKey, handleCopyRecordURL } from '@/lib/record'
import { cn } from '@/lib/utils'
import { bookmarkCount } from '@/store'
import { Record } from '@/types/record'
import { useAtom } from 'jotai'
import { Copy, Star } from 'lucide-react'
import { useState } from 'react'

export const RecordAction = ({ record }: { record: Record }) => {
	const { is_bookmarked } = record
	const [like, setLike] = useState(is_bookmarked ? Boolean(JSON.parse(is_bookmarked)) : true)
	const { common } = useJSONData({ selector: '#xml_record' })
	const { bookmark_url, bookmark_count } = common
	const { toast } = useToast()
	const sisn = deepSearchKey(record, 'sisn')[0] as string
	const { message } = useConstants()
	const [count, setCount] = useAtom(bookmarkCount)
	const [loading, setLoading] = useState(false)
	const handleBookmark = () => {
		setLoading(true)
		if (like) {
			setLoading(false)
			toast({
				title: message.successfullBookmark,
				duration: 2000,
				action: (
					<a
						className={
							'p-1 text-center border-solid border-2 rounded-md text-sm font-bold'
						}
						href={`${bookmark_url}?SHOWORDERLIST&COOKIE=BOOKMARK&NEW=Y&NOMSG=[MESSAGES]no-bookmark.html`}>
						{message.viewBookmark}
					</a>
				),
			})
			return
		}

		bookmarkSelect(`${bookmark_url}`, record).then((res) => {
			setLoading(false)
			const isValid = validateBookmarkResponse(
				res,
				typeof bookmark_count === 'number'
					? bookmark_count
					: Number.parseInt(bookmark_count || '0')
			)
			if (isValid && isValid.isSuccess) {
				setLike(true)
				setCount(isValid.newCount || count)
				toast({
					title: message.successfullBookmark,
					duration: 2000,
					action: (
						<a
							className={
								'p-1 text-center border-solid border-2 rounded-md text-sm font-bold'
							}
							href={`${bookmark_url}?SHOWORDERLIST&COOKIE=BOOKMARK&NEW=Y&NOMSG=[MESSAGES]no-bookmark.html`}>
							{message.viewBookmark}
						</a>
					),
				})
				return
			}
		})
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
				onClick={handleBookmark}
				tooltipContent={`${message.bookmark}`}>
				<Star
					className={cn('h-4 w-4 text-primary')}
					fill={like ? 'hsl(var(--opac-blue))' : 'rgb(0,0,0,0)'}
					stroke={like ? 'hsl(var(--opac-blue))' : 'hsl(var(--primary'}
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
			{/* {record.avail ? <><Separator orientation="vertical" />
			<TooltipButton
				variant="ghost"
				size="icon"
				onClick={handleCopy}
				tooltipContent="Request record">
				<Copyright className="h-4 w-4 text-primary" />
			</TooltipButton></> : ""} */}
		</>
	)
}
