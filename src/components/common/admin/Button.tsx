import { ButtonProps, Button as DefaultButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'
type Props = ButtonProps & { children?: ReactNode; className?: string }

const Button = ({ children, className, ...rest }: Props) => {
	return (
		<DefaultButton className={cn('bg-white text-blue-950 hover:bg-gray-100 py-1 px-2', className)} {...rest}>
			{children}
		</DefaultButton>
	)
}

export default Button
