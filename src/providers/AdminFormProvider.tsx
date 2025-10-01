// AdminFormProvider.tsx
import { addJsonValue, updateJsonValue } from '@/lib/admin'
import { axios } from '@/lib/axios'
import { SchemaType, SchemaValueType } from '@/types/schema'
import React, { createContext, useCallback, useState } from 'react'
import { useLoadingOverlay } from './LoadingOverlayProvider'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

type AdminFormContextType = {
	formData: SchemaValueType
	handleChange: (path: string[], newValue: SchemaValueType) => void
	handleAdd: (path: string[], newValue: SchemaValueType) => void
	handleRemove: (path: string[], index: number) => void
	handleFormSave: () => void
	schema: SchemaType
	duplicateItem: (path: string[], index: number) => void
	isSubmitting: boolean
	progress: string | null
}

const AdminFormContext = createContext<AdminFormContextType | undefined>(undefined)

type AdminFormProviderProps = {
	children: React.ReactNode
	schema: SchemaType
	data: SchemaValueType
	filepath: string
}

export const AdminFormProvider: React.FC<AdminFormProviderProps> = ({ children, schema: defaultSchema, data, filepath }) => {
	const [formData, setFormData] = useState<SchemaValueType>(data)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [progress, setProgress] = useState<string | null>(null)

	const [schema] = useState<SchemaType>(defaultSchema)

	const { showLoading, hideLoading } = useLoadingOverlay()

	const { toast } = useToast()

	const updateData = useCallback(
		(data: SchemaValueType) => {
			setIsSubmitting(true)
			showLoading()
			
			// Show a loading toast
			toast({
				title: 'Saving changes',
				description: (
					<div className="flex items-center gap-2">
						<Loader2 className="h-4 w-4 animate-spin" />
						<span>Processing changes...</span>
					</div>
				),
				duration: 60000, // Long duration as we'll dismiss it manually
			})
			
			setProgress('Processing changes...')
			
			axios
				.post('/update', {
					path: filepath,
					content: JSON.stringify(data),
				})
				.then((res) => {
					const { status, message, buildMessage } = res.data
					
					if (status === 'success') {
						toast({
							title: 'Success',
							description: buildMessage || message,
							variant: 'default',
							duration: 5000,
						})
					} else if (status === 'partial') {
						toast({
							title: 'Partial Success',
							description: buildMessage || message,
							variant: 'default',
							duration: 5000,
						})
					} else {
						toast({
							title: 'Error',
							description: buildMessage || message || 'An unknown error occurred',
							variant: 'destructive',
							duration: 5000,
						})
					}
					
					setProgress(null)
					setIsSubmitting(false)
					hideLoading()
				})
				.catch((error) => {
					toast({
						title: 'Error',
						description: 'Failed to update data',
						variant: 'destructive',
						duration: 5000,
					})
					console.error('Update error:', error)
					setProgress(null)
					setIsSubmitting(false)
					hideLoading()
				})
		},
		[filepath, hideLoading, showLoading, toast]
	)

	const handleFormSave = useCallback(() => {
		updateData(formData)
	}, [formData, updateData])

	const handleChange = useCallback((path: string[], newValue: SchemaValueType) => {
		setFormData((prevData) => updateJsonValue(prevData, path, newValue))
	}, [])

	const handleAdd = useCallback((path: string[], newValue: SchemaValueType) => {
		setFormData((prevData) => {
			const newData = addJsonValue(prevData, path, newValue)
			updateData(newData)
			return newData
		})
	}, [updateData])

	const handleItemDuplicate = useCallback((path: string[], index: number) => {
		setFormData((prevData) => {
			let targetArray = prevData
			path.forEach((e) => {
				if (targetArray && typeof targetArray === 'object' && !Array.isArray(targetArray) && targetArray !== null) {
					targetArray = targetArray[e] as SchemaValueType
				}
			})

			// Perform the duplication
			if (Array.isArray(targetArray) && index >= 0 && index < targetArray.length) {
				const newArray = [...targetArray]
				newArray.splice(index, 0, targetArray[index])
				const newData = updateJsonValue(prevData, path, newArray)
				updateData(newData)
				return newData
			}

			return prevData
		})

		handleFormSave()
	}, [handleFormSave, updateData])

	const handleRemove = useCallback((path: string[], index: number) => {
		setFormData((prevData) => {
			let targetArray = prevData

			// Traverse through the path to get to the target array
			path.forEach((key) => {
				if (targetArray && typeof targetArray === 'object' && targetArray !== null) {
					targetArray = targetArray[key as keyof typeof targetArray] as SchemaValueType
				}
			})

			// Check if the target is an array and the index is valid
			if (Array.isArray(targetArray) && index >= 0 && index < targetArray.length) {
				// Remove the item from the array
				const newArray = [...targetArray]
				newArray.splice(index, 1)

				// Update the formData with the new array
				const newData = updateJsonValue(prevData, path, newArray)
				updateData(newData)
				return newData
			}

			// Return previous data if the removal operation is invalid
			return prevData
		})
	}, [updateData])

	const contextValue = {
		formData,
		schema,
		handleChange,
		handleFormSave,
		duplicateItem: handleItemDuplicate,
		handleAdd,
		handleRemove,
		isSubmitting,
		progress
	}

	return <AdminFormContext.Provider value={contextValue}>{children}</AdminFormContext.Provider>
}

export { AdminFormContext }
