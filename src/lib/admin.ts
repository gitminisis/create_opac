import { SchemaValueType } from '@/types/schema'

export const TEXTAREA_LENGTH = 300

export const addJsonValue = (data: SchemaValueType, path: string[], newValue: SchemaValueType): SchemaValueType => {
	if (path.length === 0) return newValue

	const [firstKey, ...restPath] = path

	// If the data is an array, handle adding a value to the array at the specified index.
	if (Array.isArray(data)) {
		const index = parseInt(firstKey, 10)
		if (isNaN(index) || index < 0) {
			throw new Error('Invalid index')
		}
		let newData = [...data] as SchemaValueType[]
		newData.push(restPath.length === 0 ? newValue : addJsonValue(newData[newData.length - 1] as SchemaValueType, restPath, newValue))

		return newData as SchemaValueType
	}

	// If the data is an object, handle adding the value to the object.
	if (data && typeof data === 'object') {
		const dataObject = data as Record<string, SchemaValueType>
		return {
			...dataObject,
			[firstKey]: restPath.length === 0 ? newValue : addJsonValue(dataObject[firstKey], restPath, newValue),
		} as SchemaValueType
	}

	// If data is neither an array nor an object, treat it as adding a new value.
	return newValue
}

export const updateJsonValue = (data: SchemaValueType, path: string[], newValue: SchemaValueType): SchemaValueType => {
	if (path.length === 0) return newValue

	const [firstKey, ...restPath] = path

	if (Array.isArray(data)) {
		const index = parseInt(firstKey, 10)
		if (isNaN(index) || index < 0 || index >= data.length) {
			throw new Error('Invalid index')
		}
		return [
			...data.slice(0, index),
			updateJsonValue(data[index] as SchemaValueType, restPath, newValue),
			...data.slice(index + 1),
		] as SchemaValueType
	}

	if (data && typeof data === 'object') {
		const dataObject = data as Record<string, SchemaValueType>
		return {
			...dataObject,
			[firstKey]: updateJsonValue(dataObject[firstKey], restPath, newValue),
		} as SchemaValueType
	}

	// If `data` is neither an array nor an object, just return it
	return data
}
