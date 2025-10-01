"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { axios } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { Copy, Database, Download, ExternalLink, Eye, Image, Loader2, Shield } from "lucide-react"
import { FileItem } from "./types"

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

interface FileDetailModalProps {
    file: FileItem
    isOpen: boolean
    onClose: () => void
}

export default function FileDetailModal({ file, isOpen, onClose }: FileDetailModalProps) {

    const fetchAssetDetail = async () => {
        const token = sessionStorage.getItem('auth_token')
        if (!token) {
            throw new Error('Authentication token not found')
        }

        const response = await axios.get<AssetDetailResponse>(`/tdr/api/Asset/${file.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return response.data
    }

    // Use React Query to fetch asset details when modal is open
    const { isLoading, error: queryError, data: assetDetail } = useQuery<AssetDetailResponse>({
        queryKey: ['assetDetail', file.id],
        queryFn: fetchAssetDetail,
        enabled: isOpen && !!file.id,
        staleTime: 5 * 60 * 1000 // 5 minutes
    })



    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Fixed Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">{file.name}</h2>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5"
                        >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </Button>
                </div>

                {/* Scrollable Content Area */}
                <ScrollArea className="flex-1 overflow-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="flex flex-col items-center space-y-2">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                <p className="text-sm text-gray-500">Loading asset details...</p>
                            </div>
                        </div>
                    ) : queryError ? (
                        <div className="flex flex-col items-center justify-center p-8">
                            <div className="text-red-500 mb-2">
                                <ExternalLink className="w-8 h-8" />
                            </div>
                            <p className="text-gray-500">Failed to load asset details</p>
                        </div>
                    ) : (
                        <Tabs defaultValue="details" className="w-full">
                            <div className="px-6 pt-4">

                            </div>

                            <TabsContent value="details" className="mt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 pt-4">
                                    <div>   <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                                        <img
                                            src={file.thumbnail}
                                            alt={file.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div><div className="p-6 pt-4">
                                            <h3 className="text-lg font-medium mb-4">Integration Links</h3>
                                            <div className="space-y-4">
                                                {/* Access Link */}
                                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2 bg-blue-100 rounded-full">
                                                            <Eye className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">Access Link</p>
                                                            <p className="text-xs text-gray-500 truncate max-w-[300px]">
                                                                https://titantdrapi.minisisinc.com/api/Asset/{assetDetail?.Uuid || file.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="p-2 h-auto" onClick={() => navigator.clipboard.writeText(`https://titantdrapi.minisisinc.com/api/Asset/${assetDetail?.Uuid || file.id}`)}>
                                                        <Copy className="w-4 h-4" />
                                                    </Button>
                                                </div>

                                                {/* Thumbnail Link */}
                                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2 bg-amber-100 rounded-full">
                                                            <Image className="w-4 h-4 text-amber-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">Thumbnail Link</p>
                                                            <p className="text-xs text-gray-500 truncate max-w-[300px]">
                                                                {assetDetail?.ThumbnailLink || `https://titantdrapi.minisisinc.com/api/links/thumbnails/${assetDetail?.Uuid || file.id}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="p-2 h-auto" onClick={() => navigator.clipboard.writeText(assetDetail?.ThumbnailLink || `https://titantdrapi.minisisinc.com/api/links/thumbnails/${assetDetail?.Uuid || file.id}`)}>
                                                        <Copy className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                {/* Preservation Link */}
                                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2 bg-green-100 rounded-full">
                                                            <Shield className="w-4 h-4 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">Preservation Link</p>
                                                            <p className="text-xs text-gray-500 truncate max-w-[300px]">
                                                                {assetDetail?.PreservationLink || `https://titantdrapi.minisisinc.com/api/links/preservation/${assetDetail?.Uuid || file.id}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="p-2 h-auto" onClick={() => navigator.clipboard.writeText(assetDetail?.PreservationLink || `https://titantdrapi.minisisinc.com/api/links/preservation/${assetDetail?.Uuid || file.id}`)}>
                                                        <Copy className="w-4 h-4" />
                                                    </Button>
                                                </div>

                                                {/* Metadata Link */}
                                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2 bg-purple-100 rounded-full">
                                                            <Database className="w-4 h-4 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">Metadata Link</p>
                                                            <p className="text-xs text-gray-500 truncate max-w-[300px]">
                                                                {assetDetail?.ContentLink || `https://titantdrapi.minisisinc.com/api/links/metadata/${assetDetail?.Uuid || file.id}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="p-2 h-auto" onClick={() => navigator.clipboard.writeText(assetDetail?.ContentLink || `https://titantdrapi.minisisinc.com/api/links/metadata/${assetDetail?.Uuid || file.id}`)}>
                                                        <Copy className="w-4 h-4" />
                                                    </Button>
                                                </div>

                                                {/* External Link */}
                                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2 bg-red-100 rounded-full">
                                                            <ExternalLink className="w-4 h-4 text-red-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">External Link</p>
                                                            <p className="text-xs text-gray-500 truncate max-w-[300px]">
                                                                {assetDetail?.OtherLink || `https://titantdrapi.minisisinc.com/api/links/external/${assetDetail?.Uuid || file.id}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="p-2 h-auto" onClick={() => navigator.clipboard.writeText(assetDetail?.OtherLink || `https://titantdrapi.minisisinc.com/api/links/external/${assetDetail?.Uuid || file.id}`)}>
                                                        <Copy className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div></div>


                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">UUID</h3>
                                            <p className="mt-1 text-sm text-gray-900">{assetDetail?.Uuid || file.originalData?.Uuid || file.id}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">File Name</h3>
                                            <p className="mt-1 text-sm text-gray-900">{assetDetail?.Name || file.name}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Package Name</h3>
                                            <p className="mt-1 text-sm text-gray-900">{assetDetail?.PackageName || file.originalData?.PackageName || 'Unknown'}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Size (B)</h3>
                                                <p className="mt-1 text-sm text-gray-900">{assetDetail?.BytesSize || file.originalData?.BytesSize || 'Unknown'}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Size (MB)</h3>
                                                <p className="mt-1 text-sm text-gray-900">{assetDetail?.MbSize || file.originalData?.MbSize || file.size}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Date Created</h3>
                                                <p className="mt-1 text-sm text-gray-900">{assetDetail?.IngestDateTimeString || file.originalData?.IngestDateTimeString || file.date}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Created By</h3>
                                                <p className="mt-1 text-sm text-gray-900">{assetDetail?.CreatedBy || 'System'}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Date Last Modified</h3>
                                                <p className="mt-1 text-sm text-gray-900">{assetDetail?.IngestDateTimeString || file.originalData?.IngestDateTimeString || file.date}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Last Modified By</h3>
                                                <p className="mt-1 text-sm text-gray-900">{assetDetail?.LastModifiedBy || assetDetail?.CurrentStatus || file.originalData?.CurrentStatus || 'Normalization'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Date Last Accessed</h3>
                                            <p className="mt-1 text-sm text-gray-900">{new Date().toLocaleString()}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Format Type</h3>
                                                <p className="mt-1 text-sm text-gray-900">{assetDetail?.FormatType || file.originalData?.FormatType || 'document-pageDescription'}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Format ID</h3>
                                                <p className="mt-1 text-sm text-gray-900">{assetDetail?.FormatUuid || file.originalData?.FormatUuid || 'Unknown'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Format Name</h3>
                                            <p className="mt-1 text-sm text-gray-900">{assetDetail?.FormatName || file.originalData?.FormatName || 'Portable Document Format'}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">MIME Type</h3>
                                            <p className="mt-1 text-sm text-gray-900">{assetDetail?.MimeType || file.originalData?.MimeType || 'application/pdf'}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">File Extension</h3>
                                            <p className="mt-1 text-sm text-gray-900">{assetDetail?.Extension || file.originalData?.Extension || '.pdf'}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Storage</h3>
                                            <p className="mt-1 text-sm text-gray-900">{assetDetail?.AipStorage || file.originalData?.AipStorage || 'TitanBlob'}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Blob Uri</h3>
                                            <p className="mt-1 text-sm text-gray-900 break-all">{assetDetail?.BlobUri || file.originalData?.BlobUri || 'https://boctestsotrage.blob.core.windows.net/...'}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Blob Container</h3>
                                            <p className="mt-1 text-sm text-gray-900">{assetDetail?.BlobContainer || file.originalData?.BlobContainer || 'Unknown'}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Blob Reference</h3>
                                            <p className="mt-1 text-sm text-gray-900">{assetDetail?.BlobReference || file.originalData?.BlobReference || file.originalData?.RelativePath || 'Unknown'}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                            <ScrollArea className="h-[200px]">
                                                <p className="text-sm text-gray-900">{assetDetail?.Description || assetDetail?.Content || file.description}</p>
                                            </ScrollArea>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="links" className="mt-0">

                            </TabsContent>
                        </Tabs>
                    )}
                </ScrollArea>

                {/* Fixed Footer */}
                <div className="flex justify-end space-x-2 p-4 border-t mt-auto">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    <Button>
                        <Download className="w-4 h-4 mr-2" /> Download
                    </Button>
                </div>
            </div>
        </div>
    )
}
