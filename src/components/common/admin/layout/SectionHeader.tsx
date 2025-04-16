import { ReactNode } from 'react'

type Props = {
	heading: string
	subHeading?: string
	action?: ReactNode
}

const SectionHeader = ({ heading, subHeading, action }: Props) => {
	return (
		<div className="bg-[#3f4d5e] text-white font-bold px-4 py-2 w-full  rounded-t-md flex justify-between">
			<div>
				{heading}{' '}
				{subHeading && (
					<>
						- <span className="font-normal">{subHeading}</span>
					</>
				)}
			</div>
			{action && <div>{action}</div>}
		</div>
	)
}

export default SectionHeader
