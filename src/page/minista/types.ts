// Types for the Minista component

export interface AuthResponse {
	access_token: string
	token_type: string
	expires_in: number
	userName: string
	roleId: string
	roleName: string
	organizationUuid: string
	multiTenant: string
	'.issued': string
	'.expires': string
	logo: string | null
	avatar: string | null
}

export interface AssetSearchResponse {
	FiltersOptions: null
	PageItems: Array<AssetItem>
}

export interface AssetItem {
	Thumbnail: string
	PackageUuid: string
	Uuid: string
	Hidden: boolean
	OrganizationUuid: string
	OriginalName: string | null
	Name: string
	Title: string | null
	Description: string | null
	Content: string
	MimeType: string
	AipStorage: string
	OriginalPath: string
	BlobContainer: string
	BlobReference: string
	BlobUri: string
	MbSize: number
	BytesSize: number
	PackageName: string
	IngestDate: string
	IngestDateTimeString: string
	CurrentStage: string
	CurrentStatus: string
	MetsPath: string
	PremisFilePath: string
	Extension: string
	RelativePath: string
	FormatRegistryName: string | null
	FormatName: string
	FormatVersion: string | null
	FormatUuid: string
	FormatKey: string | null
	FormatType: string
	ChecksumInfo: string
	FileDetails: Array<{
		Name: string
		Value: string
		Message: string | null
		Outcome: number
	}>
}

export interface FileItem {
	id: string
	name: string
	category: string
	size: string
	date: string
	thumbnail: string
	description: string
	originalData?: AssetItem
}
