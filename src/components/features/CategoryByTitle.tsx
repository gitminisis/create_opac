import Section from '../common/Section'
import { useState } from 'react'
import { Button } from '../ui/button'
import useConstants from '@/hooks/useConstants'
import { getSessionID } from '@/lib/utils'

const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))

const CategoryByTitle = () => {
	const [active, setActive] = useState<string | null>(null)
	const { message } = useConstants()
	const handleClick = (letter: string) => {
		let HOME_SESSID = getSessionID()
		window.location.href = `${HOME_SESSID}?SEARCH&NEW=Y&EXP=TITLE1+${letter}&DATABASE=DESCRIPTION_WEB&REPORT=WEB_UNION_SUM&SIMPLE_EXP=Y`
		setActive(null)
	}

	return (
		<div className="w-full p-4 mx-auto space-y-4 rounded mt-8">
			<div className="font-bold">{message.browseByTitle}</div>
			<div className="w-full grid grid-cols-6 gap-2 md:flex md:justify-evenly">
				{letters.map((l) => (
					<Button
						key={l}
						variant={active === l ? 'outline' : 'default'}
						size="sm"
						className="w-[40px]"
						aria-pressed={active === l}
						onClick={() => handleClick(l)}>
						{l}
					</Button>
				))}
			</div>
		</div>
	)
}

export default CategoryByTitle
