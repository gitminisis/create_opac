import useJSONData from '@/hooks/useJSONData'
import axios from 'axios'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@radix-ui/react-toast'
import useConstants from '@/hooks/useConstants'
import { validateBookmarkResponse } from '@/lib/bookmark'
import { bookmarkCount } from '@/store'
import { useAtom } from 'jotai'

const BookmarkAll = () => {
	const { common, records } = useJSONData({ selector: '#xml_record' })
	const { bookmark_url, bookmark_count } = common
	const { toast } = useToast()
	const { message } = useConstants()
	const [count, setCount] = useAtom(bookmarkCount)

	const bookmarkAllRecord = () => {
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
					toast({
						title: message.allRecordsBookmarked,
						action: (
							<ToastAction altText="View bookmark">
								{message.viewBookmark}
							</ToastAction>
						),
					})
					window.location.reload()
					return
				}
				// in case response is not successful
				window.location.reload()
			})
		} else {
			toast({
				title: message.allRecordsBookmarked,
				action: <ToastAction altText="View bookmark">{message.viewBookmark}</ToastAction>,
			})
		}
	}

	return (
		<button
			type="button"
			onClick={bookmarkAllRecord}
			className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 hover:bg-gray-200">
			{message.bookmarkAll}
		</button>
	)
}

export default BookmarkAll
