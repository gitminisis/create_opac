import { Calculator, Calendar, CreditCard, Settings, Smile, User } from 'lucide-react'

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from '@/components/ui/command'

export function InputWithSuggestions() {
	return (
		<Command className="rounded-lg border shadow-md max-w-[400px]">
			<CommandInput placeholder="Type a command or search..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Suggestions">
					<CommandItem>
						<Calendar className="mr-2 h-4 w-4" />
						<span>Calendar</span>
					</CommandItem>
					<CommandItem>
						<Smile className="mr-2 h-4 w-4" />
						<span>Search Emoji</span>
					</CommandItem>
					<CommandItem>
						<Calculator className="mr-2 h-4 w-4" />
						<span>Calculator</span>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</Command>
	)
}
