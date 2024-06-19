export type SchemaValueType = Record<string, Object> | undefined | Array<Object>

export type SchemaType = {
	$schema?: string
	type: string
	title: string
	items?: SchemaType
	properties?: Record<string, SchemaType>
	value?: SchemaValueType
}
