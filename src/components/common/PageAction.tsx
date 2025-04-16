import { cn } from '@/lib/utils'
import { Separator } from '../ui/separator'
import Breadcrumb from './Breadcrumb'
import { BreadcrumbItem } from './Breadcrumb'

interface PageActionProps extends React.HTMLAttributes<HTMLDivElement> {
	breadcrumbs: BreadcrumbItem[]
}

const PageAction = ({ children, breadcrumbs, className }: PageActionProps) => {
	return (
		<div>
			<div
				className={cn(
					'container flex flex-col items-start justify-between space-y-2 px-4 md:px-8 py-4 md:items-center md:space-y-0 md:h-16 md:flex-row',
					className
				)}>
				<Breadcrumb items={breadcrumbs} />

				<div className="w-full flex justify-start md:justify-end">{children}</div>
			</div>

			<Separator />
		</div>
	)
}

export default PageAction
