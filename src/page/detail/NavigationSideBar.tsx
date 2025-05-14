'use client'

import { Button } from '@/components/ui/button'
import useJSONData from '@/hooks/useJSONData'
import { handleCopyRecordURL } from '@/lib/record'
import { ArrowLeft, Printer } from 'lucide-react'
import ShareButton from './ShareButton'
import useConstants from '@/hooks/useConstants'

export default function NavigationSideBar() {
	const { message } = useConstants()
	const { backToSummary, nextRecord, previousRecord, records } = useJSONData({
		selector: '#xml_record',
	})
	const record = records[0]
	return (
		<div className="w-full mt-2 space-y-3">
			<nav className="grid gap-2">
				<a href={backToSummary}>
					<Button
						variant="ghost"
						className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground group transition-all duration-300">
						<ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
						{message.returnToSearchResults}
					</Button>
				</a>

				<ShareButton url={handleCopyRecordURL(record, true) || window.location.href} />
			</nav>
		</div>
	)
}
