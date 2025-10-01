import React from 'react'
import Section from '../common/Section'
import useConstants from '@/hooks/useConstants'
import { Button } from '../ui/button'

const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))

const Indexes = () => {
	const [active, setActive] = React.useState<string | null>(null)
	const handleClick = (letter: string) => {
		const url = `https://search.lma.gov.uk/captains-registers-pdfs/captains-registers-u.pdf`
		setActive(letter)
		if (typeof window !== 'undefined') window.open(url, '_blank', 'noopener,noreferrer')
	}
	return (
		<Section heading={'Index'}>
			<div className="w-full p-4 mx-auto space-y-4 bg-slate-200 rounded">
				<div className={'text-center font-bold'}>Indexes to Lloyd's Captains Registers</div>
				<div className={'font-normal'}>
					This page contains links to indexes and transcriptions of archives held at The London Archives. The indexes to the Lloyd's
					Captains Registers were compiled by a volunteer project, which has made a significant contribution to the development of the
					collection. This page will be updated as new indexes and transcripts become available.
				</div>
				<div className={'font-normal'}>
					The following letters for the series covering 1869 (retrospective to 1851 for masters and mates still sailing in 1869) -1911 have
					been indexed
				</div>
				<div className="grid grid-cols-7 sm:grid-cols-8 md:grid-cols-13 gap-2">
					{letters.map((l) => (
						<Button
							key={l}
							variant={active === l ? 'outline' : 'default'}
							size="sm"
							className="w-full"
							aria-pressed={active === l}
							onClick={() => handleClick(l)}>
							{l}
						</Button>
					))}
				</div>
			</div>
		</Section>
	)
}

export default Indexes
