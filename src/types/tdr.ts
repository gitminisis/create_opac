interface ChecksumItem {
	Algorithm: number
	StringChecksumAlgorithm: string
	ComputeDateTimesString: string
	ComputeDateTime: string
	Checksum: string
	AssetPath: string
}

interface AgentIdentifier {
	ObjectIdentifierType: string
	IdentifierType: number
	ObjectType: number
	Name: string
	Uuid: string
	OrganizationUuid: string
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
	Hidden: boolean
}

interface Event {
	AgentIdentifiers: AgentIdentifier[]
	Message: string
	PremisEvent: number
	Outcome: number
	OutcomePath: string
	Created: string
	MetsEventString: string
	Identifier: string
	MetsEvent: number
	Stage: number
	Status: number
	DurationTicks: number
	DurationMs: number
	Progress: number
	StageString: string
	StatusString: string
	OutcomeString: string
	PremisEventString: string
	ObjectTypeString: string
	IdentifierTypeString: string
	TimeStampString: string
	CreatedString: string
	AssetUuid: string
	PackageUuid: string
	PackageName: string
	ObjectIdentifierType: string
	IdentifierType: number
	ObjectType: number
	Name: string
	Uuid: string
	OrganizationUuid: string
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
	Hidden: boolean
}

interface ProgressItem {
	Stage: number
	StageString: string
	Status: number
	StatusString: string
	TimeStamp: string
}

interface FileDetail {
	Name: string
	Value: string
	Message: string
	Outcome: number
}

interface AssetDetailResponse {
	OriginalLink: string
	PreservationLink: string
	AccessLink: string
	ThumbnailLink: string
	OtherLink: string
	OcrLink: string
	ContentLink: string
	PreservationPath: string
	AccessPath: string
	ThumbnailPath: string
	OtherPath: string
	ContentPath: string
	TechnicalMetadataPath: string
	CharacterizationPath: string
	OcrPath: string
	OcrContent: string
	PreservationFormatUuid: string
	AccessFormatUuid: string
	ThumbnailFormatUuid: string
	OtherFormatUuid: string
	CreatedDateTimeString: string
	CreatedBy: string
	LastModifiedDateTimeString: string
	LastModifiedBy: string
	LastAccessedDateTimeString: string
	MinisisSourceApplication: string
	Accession: string
	Creators: string[]
	Rights: string[]
	Security: string[]
	ManuallyNormalized: string
	Checksums: ChecksumItem[]
	EventsSummary: Record<string, any>
	Events: Event[]
	Progress: ProgressItem[]
	Thumbnail: string
	PackageUuid: string
	Uuid: string
	Hidden: boolean
	OrganizationUuid: string
	OriginalName: string
	Name: string
	Title: string
	Description: string
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
	FormatRegistryName: string
	FormatName: string
	FormatVersion: string
	FormatUuid: string
	FormatKey: string
	FormatType: string
	ChecksumInfo: string
	FileDetails: FileDetail[]
}

interface AuthResponse {
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

interface AssetSearchResponse {
	FiltersOptions: null
	PageItems: Array<AssetItem>
}

interface AssetItem {
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

interface FileItem {
	id: string
	name: string
	category: string
	size: string
	date: string
	thumbnail: string
	description: string
	originalData?: AssetItem
}

export type { AssetDetailResponse, FileItem }
