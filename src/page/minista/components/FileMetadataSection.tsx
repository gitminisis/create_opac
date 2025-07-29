import { ScrollArea } from '@/components/ui/scroll-area'
import { AssetDetailResponse, FileItem } from '@/types/tdr'

interface FileMetadataSectionProps {
	file: FileItem
	assetDetail?: AssetDetailResponse
}

export function FileMetadataSection({ file, assetDetail }: FileMetadataSectionProps) {
	return (
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
				<p className="mt-1 text-sm text-gray-900">
					{assetDetail?.PackageName || file.originalData?.PackageName || 'Unknown'}
				</p>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<div>
					<h3 className="text-sm font-medium text-gray-500">Size (B)</h3>
					<p className="mt-1 text-sm text-gray-900">
						{assetDetail?.BytesSize || file.originalData?.BytesSize || 'Unknown'}
					</p>
				</div>
				<div>
					<h3 className="text-sm font-medium text-gray-500">Size (MB)</h3>
					<p className="mt-1 text-sm text-gray-900">
						{assetDetail?.MbSize || file.originalData?.MbSize || file.size}
					</p>
				</div>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<div>
					<h3 className="text-sm font-medium text-gray-500">Date Created</h3>
					<p className="mt-1 text-sm text-gray-900">
						{assetDetail?.IngestDateTimeString || file.originalData?.IngestDateTimeString || file.date}
					</p>
				</div>
				<div>
					<h3 className="text-sm font-medium text-gray-500">Created By</h3>
					<p className="mt-1 text-sm text-gray-900">{assetDetail?.CreatedBy || 'System'}</p>
				</div>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<div>
					<h3 className="text-sm font-medium text-gray-500">Date Last Modified</h3>
					<p className="mt-1 text-sm text-gray-900">
						{assetDetail?.IngestDateTimeString || file.originalData?.IngestDateTimeString || file.date}
					</p>
				</div>
				<div>
					<h3 className="text-sm font-medium text-gray-500">Last Modified By</h3>
					<p className="mt-1 text-sm text-gray-900">
						{assetDetail?.LastModifiedBy ||
							assetDetail?.CurrentStatus ||
							file.originalData?.CurrentStatus ||
							'Normalization'}
					</p>
				</div>
			</div>
			<div>
				<h3 className="text-sm font-medium text-gray-500">Date Last Accessed</h3>
				<p className="mt-1 text-sm text-gray-900">{new Date().toLocaleString()}</p>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<div>
					<h3 className="text-sm font-medium text-gray-500">Format Type</h3>
					<p className="mt-1 text-sm text-gray-900">
						{assetDetail?.FormatType || file.originalData?.FormatType || 'document-pageDescription'}
					</p>
				</div>
				<div>
					<h3 className="text-sm font-medium text-gray-500">Format ID</h3>
					<p className="mt-1 text-sm text-gray-900">
						{assetDetail?.FormatUuid || file.originalData?.FormatUuid || 'Unknown'}
					</p>
				</div>
			</div>
			<div>
				<h3 className="text-sm font-medium text-gray-500">Format Name</h3>
				<p className="mt-1 text-sm text-gray-900">
					{assetDetail?.FormatName || file.originalData?.FormatName || 'Portable Document Format'}
				</p>
			</div>
			<div>
				<h3 className="text-sm font-medium text-gray-500">MIME Type</h3>
				<p className="mt-1 text-sm text-gray-900">
					{assetDetail?.MimeType || file.originalData?.MimeType || 'application/pdf'}
				</p>
			</div>
			<div>
				<h3 className="text-sm font-medium text-gray-500">File Extension</h3>
				<p className="mt-1 text-sm text-gray-900">
					{assetDetail?.Extension || file.originalData?.Extension || '.pdf'}
				</p>
			</div>
			<div>
				<h3 className="text-sm font-medium text-gray-500">Storage</h3>
				<p className="mt-1 text-sm text-gray-900">
					{assetDetail?.AipStorage || file.originalData?.AipStorage || 'TitanBlob'}
				</p>
			</div>
			<div>
				<h3 className="text-sm font-medium text-gray-500">Blob Uri</h3>
				<p className="mt-1 text-sm text-gray-900 break-all">
					{assetDetail?.BlobUri ||
						file.originalData?.BlobUri ||
						'https://boctestsotrage.blob.core.windows.net/...'}
				</p>
			</div>
			<div>
				<h3 className="text-sm font-medium text-gray-500">Blob Container</h3>
				<p className="mt-1 text-sm text-gray-900">
					{assetDetail?.BlobContainer || file.originalData?.BlobContainer || 'Unknown'}
				</p>
			</div>
			<div>
				<h3 className="text-sm font-medium text-gray-500">Blob Reference</h3>
				<p className="mt-1 text-sm text-gray-900">
					{assetDetail?.BlobReference ||
						file.originalData?.BlobReference ||
						file.originalData?.RelativePath ||
						'Unknown'}
				</p>
			</div>
			<div>
				<h3 className="text-sm font-medium text-gray-500">Description</h3>
				<ScrollArea className="h-[200px]">
					<p className="text-sm text-gray-900">
						{assetDetail?.Description || assetDetail?.Content || file.description}
					</p>
				</ScrollArea>
			</div>
		</div>
	)
}
