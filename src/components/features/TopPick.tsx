import Marquee from '@/components/ui/marquee'
import useConstants from '@/hooks/useConstants'
import { cn } from '@/lib/utils'
import { PageSectionProps } from '@/page/Home'
import { Archive } from 'lucide-react'
import Section from '../common/Section'

const ReviewCard = ({
	title,
	subTitle,
	description,
	onClick,
}: {
	title: string
	subTitle: string
	description: string
	expression: string
	database: string
	onClick: () => void
}) => {
	return (
		<figure
			className={cn(
				'relative w-min cursor-pointer overflow-hidden rounded-xl border p-4 hover:shadow-md'
			)}
			onClick={onClick}>
			<div className="flex flex-row items-center gap-2">
				<Archive className="w-8 h-8" />
				<div className="flex flex-col">
					<figcaption className="text-sm font-bold text-primary w-[45ch] line-clamp-1">
						{title}
					</figcaption>
					<p className="text-xs font-medium ">{subTitle}</p>
				</div>
			</div>
			<blockquote className="mt-2 line-clamp-3">{description}</blockquote>
		</figure>
	)
}

const TopPick = ({ page, previewData, previewMode }: PageSectionProps) => {
	const sourceData = useConstants()[page as 'home']

	const data = previewMode && previewData ? (previewData as typeof sourceData) : sourceData
	const { message } = useConstants()
	return (
		<Section heading={message.topPick}>
			<div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg border  ">
				<Marquee reverse pauseOnHover className="[--duration:25s]">
					{data.topPicks.map((item) => (
						<ReviewCard
							onClick={() => {
								window.location.href = `${window.location.protocol}//${window.location.hostname}/scripts/mwimain.dll/144/${item.database}/WEB_UNION_DETAIL?sessionsearch&exp=${item.expression}`
							}}
							key={item.title}
							{...item}
						/>
					))}
				</Marquee>
				<div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent dark:from-transparent"></div>
				<div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-transparent dark:from-transparent"></div>
			</div>
		</Section>
	)
}

export default TopPick
