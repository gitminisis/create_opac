import { cn } from '@/lib/utils'
import React from 'react'

export interface RecordDetailProps extends React.HTMLAttributes<HTMLDivElement> {
	heading: string | React.ReactNode
	subHeading?: string | React.ReactNode
	description?: string | React.ReactNode
}

const RecordDetail = ({
	heading,
	subHeading,
	description,
	children,
	className,
	...props
}: RecordDetailProps) => {
	return (
		<div className={cn('grid gap-4', className)} {...props}>
			<h1 className="font-bold text-3xl lg:text-4xl">{heading}</h1>
			<h2 className="text-xl text-primary/80">{subHeading}</h2>
			{description && (
				<div>
					<p>{description}</p>
				</div>
			)}

			{/* Commentout the reviews for now */}
			{/*  
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-0.5'>
          <StarIcon className='w-5 h-5 fill-primary' />
          <StarIcon className='w-5 h-5 fill-primary' />
          <StarIcon className='w-5 h-5 fill-primary' />
          <StarIcon className='w-5 h-5 fill-primary' />
          <StarIcon className='w-5 h-5 fill-muted stroke-muted-foreground' />
        </div>
        <p className='text-gray-500'>(120 reviews)</p>
      </div> */}
			<div className="w-full">{children}</div>
		</div>
	)
}

export default RecordDetail
