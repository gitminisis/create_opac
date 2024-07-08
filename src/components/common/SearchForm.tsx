import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { Search, SearchIcon } from 'lucide-react'
import useConstants from '@/hooks/useConstants'
import useJSONData from '@/hooks/useJSONData'
export interface SearchFormProps extends React.HTMLAttributes<HTMLFormElement> {
	inputName: string
	inputStyle?: string
}
const SearchForm = ({ className, inputName, inputStyle, ...props }: SearchFormProps) => {
	const { message, home } = useConstants()
	const { common } = useJSONData({ selector: '#xml_record' })
	const { searchURL: url } = home
	const { session } = common

	const getSearchURL = () => {
		if (session && session !== '') {
			return url.replace('/SCRIPTS/MWIMAIN.DLL', `${session}`)
		}
		return url
	}
	return (
		<form
			method="POST"
			action={getSearchURL()}
			className={cn('w-full mx-auto flex space-x-4 justify-center', className)}
			{...props}>
			<div className="w-3/4 relative">
				<Input
					required
					name={inputName}
					className={cn(
						'w-full rounded-none pl-4 border-2 py-3 bg-transparent border-opac-green text-white',
						inputStyle
					)}
					placeholder={message.searchPlaceholder}
					type="search"
				/>
				{/* <SearchIcon className="absolute w-4 h-5 left-2 my-auto  mx-0 right-0 top-0 bottom-0 text-white" /> */}
			</div>
			<Button
				variant={'default'}
				className="right-0 top-0 h-full bg-opac-green"
				type="submit">
				{/* <span className="hidden md:block"> {message.searchButton}</span> */}
				<span className=" block">
					<Search className="w-4 h-4" />
				</span>
			</Button>
		</form>
	)
}

export default SearchForm
