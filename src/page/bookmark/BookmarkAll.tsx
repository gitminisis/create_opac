import useJSONData from '@/hooks/useJSONData'
import axios from 'axios'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@radix-ui/react-toast'
import useConstants from '@/hooks/useConstants'
import { validateBookmarkResponse } from '@/lib/bookmark'
import { bookmarkCount } from '@/store'
import { useAtom } from 'jotai'
import { useState } from 'react'

const BookmarkAll = () => {
	const { common, records } = useJSONData({ selector: '#xml_record' })
	const { bookmark_url, bookmark_count } = common
	const { toast } = useToast()
	const { message } = useConstants()
	const [count, setCount] = useAtom(bookmarkCount)
	const [loading, setLoading] = useState(false)

	const bookmarkAllRecord = () => {
		setLoading(true)
		const dataString = records
			.filter(({ is_bookmarked }) => is_bookmarked === 'false')
			.map(
				({ record, database_name }) =>
					`mcheckbox_${record.sisn}=${record.sisn}-${database_name}`
			)
			.join('&')

		if (dataString) {
			axios.post(`${bookmark_url}?ADDSELECTION&COOKIE=BOOKMARK`, dataString).then((res) => {
				const bookmarkCount =
					typeof bookmark_count === 'number'
						? bookmark_count
						: Number.parseInt(bookmark_count || '0')
				const isValid = validateBookmarkResponse(res, bookmarkCount)
				if (isValid?.isSuccess) {
					setCount(isValid.newCount || count)
					window.location.reload()
					toast({
						title: message.allRecordsBookmarked,
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
				// in case response is not successful
				setLoading(false)
				window.location.reload()
			})
		} else {
			toast({
				title: message.allRecordsBookmarked,
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
			setLoading(false)
		}
	}

	return (
		<button
			disabled={loading}
			type="button"
			onClick={bookmarkAllRecord}
			className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 hover:bg-gray-200">
			{message.bookmarkAll}
		</button>
	)
}

export default BookmarkAll
