import AdminFormLayout from '@/components/common/admin/form/AdminFormLayout'
import FormField from '@/components/common/admin/input/FormField'
import { BCForm, FCForm, TPForm } from '@/components/common/admin/input/types'
import SectionActions, { NewElementForm } from '@/components/common/admin/layout/SectionActions'
import SectionHeader from '@/components/common/admin/layout/SectionHeader'
import SectionWrapper from '@/components/common/admin/layout/SectionWrapper'
import { default as enValues } from '@/constants/en/home.json'
import { default as frValues } from '@/constants/fr/home.json'
import { useAdminForm } from '@/hooks/useAdminForm'
import { isSupportedImageExtension } from '@/lib/tdr'
import fields from '@/schema/home.json'
import { SchemaType } from '@/types/schema'
import { FormEvent } from 'react'

const AdminHome = () => {
	return (
		<AdminFormLayout
			enablePreview
			enData={enValues}
			frData={frValues}
			schema={fields as SchemaType}
			enFilepath={'constants/en/home.json'}
			frFilepath={'constants/fr/home.json'}
			FormComponent={Form}
		/>
	)
}

const Form = ({ lang }: { lang: 'en' | 'fr' }) => {
	const fieldsValue = lang === 'en' ? enValues : frValues
	const { handleChange, handleAdd, handleRemove } = useAdminForm()

	return (
		<div className="flex gap-4 flex-col">
			<FormField
				type="text"
				field={'Page heading'}
				value={fieldsValue.heading}
				onChange={(e) => handleChange(['heading'], e)}
			/>

			<FormField
				type="image"
				field={'Site banner'}
				value={fieldsValue.heroBanner}
				onChange={(e) => handleChange(['heroBanner'], e)}
				onTDRAssetsSelect={(files) => {
					if (files.length > 0) {
						const file = files[0]
						handleChange(
							['heroBanner'],
							isSupportedImageExtension(file.Extension) ? file.Access : file.Thumbnail
						)
					}
				}}
			/>

			<div className="mt-2">
				<SectionHeader heading="Featured Collections" />
				<SectionActions
					handleAddNewItem={(event: FormEvent<NewElementForm<FCForm>>) => {
						const { url, description, title, thumbnail } = event.currentTarget.elements

						handleAdd(
							['featuredCollection', `${fieldsValue.featuredCollection.length}`],
							{
								title: title.value,
								description: description.value,
								url: url.value,
								thumbnail: thumbnail.value,
							}
						)
					}}
					newItemForm={
						<>
							<FormField
								name="title"
								type="text"
								field={'Category title'}
								value={''}
							/>
							<FormField
								name="description"
								type="text"
								field={'Description'}
								value={''}
							/>
							<FormField
								name="url"
								type="text"
								field={'Search expression'}
								value={''}
							/>
							<FormField
								name="thumbnail"
								type="text"
								field={'Thumbnail'}
								value={''}
							/>
						</>
					}
					enableFeatureValue={fieldsValue.enableFeaturedCollection}
					onEnableFeatureChange={(e) => {
						handleChange(['enableFeaturedCollection'], e)
					}}
				/>

				{fieldsValue.enableFeaturedCollection && (
					<div className="flex flex-col gap-2">
						{fieldsValue.featuredCollection.map((item, index) => (
							<SectionWrapper
								title={item.title}
								defaultCollapseMode={index !== 0}
								key={JSON.stringify(item)}
								onRemove={() => {
									handleRemove(['featuredCollection'], index)
								}}>
								<FormField
									type="text"
									field={'Category title'}
									value={item.title}
									onChange={(e) =>
										handleChange(['featuredCollection', `${index}`, 'title'], e)
									}
								/>

								<FormField
									type="text"
									field={'Search expression'}
									value={item.url}
									onChange={(e) =>
										handleChange(['featuredCollection', `${index}`, 'url'], e)
									}
								/>

								<FormField
									type="image"
									field={'Thumbnail'}
									value={item.thumbnail}
									onChange={(e) =>
										handleChange(
											['featuredCollection', `${index}`, 'thumbnail'],
											e
										)
									}
									onTDRAssetsSelect={(files) => {
										if (files.length > 0) {
											const file = files[0]
											handleChange(
												['featuredCollection', `${index}`, 'thumbnail'],
												isSupportedImageExtension(file.Extension)
													? file.Access
													: file.Thumbnail
											)
										}
									}}
								/>
							</SectionWrapper>
						))}{' '}
					</div>
				)}
			</div>

			<div className="mt-2">
				<SectionHeader heading="Browse By Category" />
				<SectionActions
					handleAddNewItem={(event: FormEvent<NewElementForm<BCForm>>) => {
						const { url, title, thumbnail } = event.currentTarget.elements

						handleAdd(['categoriesItems', `${fieldsValue.categoriesItems.length}`], {
							title: title.value,
							url: url.value,
							thumbnail: thumbnail.value,
						})
					}}
					newItemForm={
						<>
							<FormField
								name="title"
								type="text"
								field={'Category title'}
								value={''}
							/>

							<FormField
								name="url"
								type="text"
								field={'Search expression'}
								value={''}
							/>
							<FormField
								name="thumbnail"
								type="text"
								field={'Thumbnail'}
								value={''}
							/>
						</>
					}
					enableFeatureValue={fieldsValue.enableCategoriesItems}
					onEnableFeatureChange={(e) => {
						handleChange(['enableCategoriesItems'], e)
					}}
				/>

				{fieldsValue.enableCategoriesItems && (
					<div className="flex flex-col gap-2">
						{fieldsValue.categoriesItems.map((item, index) => (
							<SectionWrapper
								title={item.title}
								defaultCollapseMode={index !== 0}
								key={JSON.stringify(item)}
								onRemove={() => {
									handleRemove(['categoriesItems'], index)
								}}>
								<FormField
									type="text"
									field={'Category title'}
									value={item.title}
									onChange={(e) =>
										handleChange(['categoriesItems', `${index}`, 'title'], e)
									}
								/>

								<FormField
									type="text"
									field={'Search expression'}
									value={item.url}
									onChange={(e) =>
										handleChange(['categoriesItems', `${index}`, 'url'], e)
									}
								/>

								<FormField
									type="image"
									field={'Thumbnail'}
									value={item.thumbnail}
									onChange={(e) =>
										handleChange(
											['categoriesItems', `${index}`, 'thumbnail'],
											e
										)
									}
									onTDRAssetsSelect={(files) => {
										if (files.length > 0) {
											const file = files[0]
											handleChange(
												['categoriesItems', `${index}`, 'thumbnail'],
												isSupportedImageExtension(file.Extension)
													? file.Access
													: file.Thumbnail
											)
										}
									}}
								/>
							</SectionWrapper>
						))}
					</div>
				)}
			</div>

			<div className="mt-2">
				<SectionHeader heading="Top Picks" />
				<SectionActions
					handleAddNewItem={(event: FormEvent<NewElementForm<TPForm>>) => {
						const { title, subTitle, description, expression, database } =
							event.currentTarget.elements

						handleAdd(['topPicks', `${fieldsValue.topPicks.length}`], {
							title: title.value,
							subTitle: subTitle.value,
							description: description.value,
							expression: expression.value,
							database: database.value,
						})
					}}
					newItemForm={
						<>
							<FormField name="title" type="text" field={'Title'} value={''} />
							<FormField name="subTitle" type="text" field={'Subtitle'} value={''} />
							<FormField
								name="description"
								type="text"
								field={'Description'}
								value={''}
							/>
							<FormField
								name="expression"
								type="text"
								field={'Expression'}
								value={''}
							/>
							<FormField name="database" type="text" field={'Database'} value={''} />
						</>
					}
					enableFeatureValue={fieldsValue.enableTopPicks}
					onEnableFeatureChange={(e) => {
						handleChange(['enableTopPicks'], e)
					}}
				/>

				{fieldsValue.enableTopPicks && (
					<div className="flex flex-col gap-2">
						{fieldsValue.topPicks.map((item, index) => (
							<SectionWrapper
								title={item.title}
								defaultCollapseMode={index !== 0}
								key={JSON.stringify(item)}
								onRemove={() => {
									handleRemove(['topPicks'], index)
								}}>
								<FormField
									type="text"
									field={'Title'}
									value={item.title}
									onChange={(e) =>
										handleChange(['topPicks', `${index}`, 'title'], e)
									}
								/>

								<FormField
									type="text"
									field={'Subtitle'}
									value={item.subTitle}
									onChange={(e) =>
										handleChange(['topPicks', `${index}`, 'subTitle'], e)
									}
								/>

								<FormField
									type="text"
									field={'Description'}
									value={item.description}
									onChange={(e) =>
										handleChange(['topPicks', `${index}`, 'description'], e)
									}
								/>

								<FormField
									type="text"
									field={'Expression'}
									value={item.expression}
									onChange={(e) =>
										handleChange(['topPicks', `${index}`, 'expression'], e)
									}
								/>

								<FormField
									type="text"
									field={'Database'}
									value={item.database}
									onChange={(e) =>
										handleChange(['topPicks', `${index}`, 'database'], e)
									}
								/>
							</SectionWrapper>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default AdminHome
