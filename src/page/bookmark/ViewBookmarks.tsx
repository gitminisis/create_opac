import useJSONData from '@/hooks/useJSONData'
import { deepSearchKey } from '@/lib/record'

const ViewBookmarks = () => {
	const obj = useJSONData({ selector: '#xml_record' })
	const onClick = () => {
		 let url = deepSearchKey(obj, 'bookmark_url')[0]
		 window.location.href = `${url}?SHOWORDERLIST&COOKIE=BOOKMARK&NEW=Y`
	}

	return (
		<>
			<button
				onClick={onClick}
				className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 hover:bg-gray-200">
				View bookmarks
			</button>
		</>
	)
}

export default ViewBookmarks
