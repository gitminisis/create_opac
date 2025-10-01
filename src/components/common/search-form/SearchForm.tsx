import { Input } from '@/components/ui/input'
import useConstants from '@/hooks/useConstants'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import React from 'react'
import { Button } from '../../ui/button'
export interface SearchFormProps extends React.HTMLAttributes<HTMLFormElement> {
	inputName?: string
	inputStyle?: string
	action: string
}
const SearchForm = ({ className, inputName, inputStyle, action, ...props }: SearchFormProps) => {
	const { message } = useConstants()

	return (
		<form method="POST" action={action} className={'flex w-full max-w-[600px] m-0'} {...props}>
			<div className="w-full relative">
				<Input
					required
					name={inputName || 'KEYWORD_CLUSTER'}
					className={cn(
						'w-full rounded-none pl-4 border-2 py-3 bg-transparent border-opac-secondary text-white rounded-l-md ring-inset',
						inputStyle
					)}
					placeholder={message.searchPlaceholder}
					type="search"
				/>
			</div>
			<Button style={{ borderRadius: '0px 5px 5px 0' }} variant={'default'} className="right-0 top-0 h-full bg-primary" type="submit">
				<span className="block">
					<Search className="w-4 h-4" />
				</span>
			</Button>
		</form>
	)
}

export default SearchForm
