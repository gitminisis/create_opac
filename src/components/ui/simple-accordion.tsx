'use client'

import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Button } from './button'

export interface AccordionItem {
	title: string
	content: JSX.Element
}

export interface AccordionProps {
	items: AccordionItem[]
}

export default function Accordion({ items }: AccordionProps) {
	const [openIndex, setOpenIndex] = useState<number | null>(null)

	const toggleItem = (index: number) => {
		setOpenIndex(openIndex === index ? null : index)
	}

	return (
		<div className="w-full  mx-auto space-y-2">
			{items.map((item, index) => (
				<div key={index} className="border rounded-md">
					<Button
						className="flex justify-between items-center w-full p-4 text-left bg-primary text-white"
						onClick={() => toggleItem(index)}
						aria-expanded={openIndex === index}
						aria-controls={`accordion-content-${index}`}>
						<span className="font-medium">{item.title}</span>
						<ChevronDown className={cn('w-5 h-5 transition-transform duration-200', openIndex === index && 'transform rotate-180')} />
					</Button>
					{openIndex === index && (
						<div id={`accordion-content-${index}`} className="p-4 pt-0">
							{item.content}
						</div>
					)}
				</div>
			))}
		</div>
	)
}
