import useJSONData from '@/hooks/useJSONData'
import { deepSearchKey } from '@/lib/record'
import { Badge } from '@/components/ui/badge'
import useConstants from '@/hooks/useConstants'
import { useEffect } from 'react'
import { bookmarkCount } from '@/store'
import { useAtom } from 'jotai'

const ViewBookmarks = () => {
	const jsonData = useJSONData({ selector: '#xml_record' })
	const { message } = useConstants()
	const [count, setCount] = useAtom(bookmarkCount)
	const defaultCount = jsonData.common.bookmark_count

	// set default count on first load
	useEffect(() => {
		setCount(Number.parseInt(`${defaultCount}`) || 0)
	}, [defaultCount, setCount])

	const getBookmarkSumURL = () => {
		let url = deepSearchKey(jsonData, 'bookmark_url')[0]
		return `${url}?SHOWORDERLIST&COOKIE=BOOKMARK&NEW=Y&NOMSG=[MESSAGES]no-bookmark.html`
	}

	return (
		<a
			href={getBookmarkSumURL()}
			className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 hover:bg-gray-200">
			{message.viewBookmark}
			<Badge className={'bg-black'}>{count}</Badge>
		</a>
	)
}

export default ViewBookmarks
