import AdminFormLayout from '@/components/common/admin/form/AdminFormLayout'
import CheckboxWithLabel from '@/components/common/admin/input/CheckboxWithLabel'
import FormField from '@/components/common/admin/input/FormField'
import SectionActions, { NewElementForm } from '@/components/common/admin/layout/SectionActions'
import SectionHeader from '@/components/common/admin/layout/SectionHeader'
import SectionWrapper from '@/components/common/admin/layout/SectionWrapper'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import enValues from '@/constants/en/fields.json'
import frValues from '@/constants/fr/fields.json'
import { useAdminForm } from '@/hooks/useAdminForm'
import { cn } from '@/lib/utils'
import fields from '@/schema/fields.json'
import { SchemaType } from '@/types/schema'
import {
	Command,
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandItem,
} from '@/components/ui/command'
import { ChevronsUpDown, Check } from 'lucide-react'
import React from 'react'
import { FormEvent } from 'react'

type NewFormType = HTMLFormControlsCollection & {
	label: HTMLInputElement
	name: HTMLInputElement
}

const Fields = () => {
	return (
		<AdminFormLayout
			enData={enValues}
			frData={frValues}
			schema={fields as SchemaType}
			enFilepath={'constants/en/fields.json'}
			frFilepath={'constants/fr/fields.json'}
			FormComponent={Form}
		/>
	)
}
const frameworks = [
	{
		value: 'sin',
		label: 'Sin',
	},
	{
		value: 'refd',
		label: 'Refd',
	},
	{
		value: 'refd_higher',
		label: 'Refd Higher',
	},
	{
		value: 'level_desc',
		label: 'Level Desc',
	},
	{
		value: 'accession_grp',
		label: 'Accession Grp',
	},
	{
		value: 'title',
		label: 'Title',
	},
	{
		value: 'desc_type',
		label: 'Desc Type',
	},
	{
		value: 'date_cr_inc',
		label: 'Creation',
	},
	{
		value: 'date_search',
		label: 'Date Search',
	},
	{
		value: 'notes',
		label: 'Notes',
	},
	{
		value: 'statusd',
		label: 'Statusd',
	},
	{
		value: 'webd',
		label: 'Webd',
	},
	{
		value: 'indexprov_grp',
		label: 'Indexprov Grp',
	},
	{
		value: 'd_box_no',
		label: 'D Box No',
	},
	{
		value: 'place_of_pub',
		label: 'Place Of Pub',
	},
	{
		value: 'edition',
		label: 'Edition',
	},
	{
		value: 'specific_mat',
		label: 'Specific Mat',
	},
	{
		value: 'modified_hist',
		label: 'Modified Hist',
	},
	{
		value: 'tree_id',
		label: 'Tree Id',
	},
	{
		value: 'parent_tree_id',
		label: 'Parent Tree Id',
	},
	{
		value: 'input_by',
		label: 'Input By',
	},
	{
		value: 'entry_date',
		label: 'Entry Date',
	},
	{
		value: 'd_restrict_grp',
		label: 'D Restrict Grp',
	},
	{
		value: 'original_refd',
		label: 'Original Refd',
	},
	{
		value: 'repository',
		label: 'Repository',
	},
]

const Form = ({ lang }: { lang: 'en' | 'fr' }) => {
	const fieldsValue = lang === 'en' ? enValues : frValues
	const { handleChange, handleRemove, handleAdd } = useAdminForm()

	return (
		<div className="flex gap-4 flex-col">
			{/* <FieldList /> */}
			{fieldsValue.map((db, dbIndex) => (
				<div>
					<SectionHeader
						heading={`${db.database} Fields`}
						subHeading="Configure the fields for your web interface"
					/>

					<SectionActions
						handleAddNewItem={(event: FormEvent<NewElementForm<NewFormType>>) => {
							const { label, name } = event.currentTarget.elements

							handleAdd(
								[`${dbIndex}`, 'items', String(fieldsValue[dbIndex].items.length)],
								{
									name: name.value,
									label: label.value,
									summary: true,
									grid: true,
									detail: true,
								}
							)
						}}
						newItemForm={
							<>
								<FormField
									name="name"
									type="text"
									field={'Field mnemonic'}
									value={''}
								/>
								<FormField
									name="label"
									type="text"
									field={'Field label'}
									value={''}
								/>
							</>
						}
						enableFeatureValue={true}
					/>

					<div className="flex flex-col gap-2">
						{db.items.map((item, itemIndex) => (
							<SectionWrapper
								title={item.name.toUpperCase()}
								key={JSON.stringify(item)}
								onRemove={() => {
									handleRemove([`${dbIndex}`, 'items'], itemIndex)
								}}>
								<FormField
									type="text"
									field={'Field mnemonic'}
									value={item.name.toUpperCase()}
									onChange={(e) =>
										handleChange(
											[`${dbIndex}`, 'items', `${itemIndex}`, 'name'],
											e
										)
									}
								/>

								<FormField
									type="text"
									field={'Field label'}
									value={item.label}
									onChange={(e) =>
										handleChange(
											[`${dbIndex}`, 'items', `${itemIndex}`, 'label'],
											e
										)
									}
								/>

								<div className="flex flex-row gap-4">
									<CheckboxWithLabel
										title={'Summary list report'}
										value={item.summary}
										onChange={(e) =>
											handleChange(
												[`${dbIndex}`, 'items', `${itemIndex}`, 'summary'],
												e
											)
										}
									/>

									<CheckboxWithLabel
										title={'Summary grid report'}
										value={item.grid}
										onChange={(e) =>
											handleChange(
												[`${dbIndex}`, 'items', `${itemIndex}`, 'grid'],
												e
											)
										}
									/>

									<CheckboxWithLabel
										title={'Detail report'}
										value={item.detail}
										onChange={(e) =>
											handleChange(
												[`${dbIndex}`, 'items', `${itemIndex}`, 'detail'],
												e
											)
										}
									/>
								</div>
							</SectionWrapper>
						))}
					</div>
				</div>
			))}
		</div>
	)
}
export default Fields
