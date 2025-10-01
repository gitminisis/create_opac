import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import useConstants from '@/hooks/useConstants'
import { Search } from 'lucide-react'
import { ReactNode } from 'react'

export interface HomeSearchFormProps extends React.HTMLAttributes<HTMLFormElement> {
	inputName?: string
	inputStyle?: string
	action: string
	append?: ReactNode
	title?: string
}

export default function HomeSearchForm({ className, inputName, inputStyle, action, append, title = '', ...props }: HomeSearchFormProps) {
	const { message } = useConstants()

	return (
		<Card className="w-full max-w-3xl mx-auto rounded-md shadow-lg">
			<CardHeader>
				<CardTitle className="text-2xl font-bold text-left">{title}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2 flex flex-col items-end">
				<form method="POST" action={action} className="flex w-full space-x-2 mb-4 relative">
					<Input
						className="w-full h-14 pl-6 pr-36 text-lg border-2 border-gray-200 focus:border-primary "
						required
						name={inputName || 'KEYWORD_CLUSTER'}
						placeholder={message.searchPlaceholder}
						type="search"
					/>
					<Button className="absolute right-2 top-2 h-10 px-8 rounded-full bg-primary">
						<span className="block">
							<Search className="w-4 h-4 mr-2" />
						</span>
						Search
					</Button>
				</form>
				{append}
			</CardContent>
		</Card>
	)
}
