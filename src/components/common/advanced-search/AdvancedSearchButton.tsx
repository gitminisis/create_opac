import { Button } from '@/components/ui/button'
import { TextSearch } from 'lucide-react'
import React from 'react'

interface ShowAdvSearch {
	setShowAdvSearch: React.Dispatch<React.SetStateAction<boolean>>
}

const AdvanceSearchButton: React.FC<ShowAdvSearch> = ({ setShowAdvSearch }: any) => {
	return (
		<Button
			variant="ghost"
			className="right-0 top-0 h-full w-full max-w-[130px] flex justify-center items-center rounded-md"
			onClick={() => setShowAdvSearch((prev: boolean) => !prev)}>
			<TextSearch className="mr-2" />
			<div className="text-base">Advanced </div>
		</Button>
	)
}

export default AdvanceSearchButton
