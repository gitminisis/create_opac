import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { FormEvent, ReactNode, useState } from 'react'
import Switch from '../input/Switch'

export type NewElementForm<T extends HTMLFormControlsCollection> = HTMLFormElement & {
	readonly elements: T
}

type Props<T extends HTMLFormControlsCollection> = {
	enableFeatureValue: boolean
	onEnableFeatureChange?: (e: boolean) => void
	newItemForm?: ReactNode
	handleAddNewItem?: (e: FormEvent<NewElementForm<T>>) => void
}

const SectionActions = <T extends HTMLFormControlsCollection>({
	enableFeatureValue,
	onEnableFeatureChange,
	newItemForm,
	handleAddNewItem,
}: Props<T>) => {
	const [addNewForm, setAddNewForm] = useState(false)
	return (
		<div className="flex flex-row justify-between mt-2">
			<Switch
				title={'Enable feature'}
				value={enableFeatureValue}
				disabled={onEnableFeatureChange === undefined}
				onChange={onEnableFeatureChange}
			/>
			{newItemForm && (
				<Dialog onOpenChange={setAddNewForm} open={addNewForm}>
					<DialogContent className={'rounded'}>
						<DialogHeader>
							<DialogTitle>Add new item</DialogTitle>
						</DialogHeader>
						<form
							onSubmit={(e: FormEvent<NewElementForm<T>>) => {
								e.preventDefault()
								handleAddNewItem?.(e)
								setAddNewForm(false)
							}}>
							{newItemForm}

							<Button type="submit">Submit</Button>
						</form>
					</DialogContent>
				</Dialog>
			)}

			{newItemForm && (
				<Button
					disabled={!enableFeatureValue}
					variant="outline"
					onClick={() => {
						setAddNewForm(true)
					}}>
					<Plus className="text-primary h-4 w-4 mr-1" />
					Add new
				</Button>
			)}
		</div>
	)
}

export default SectionActions
