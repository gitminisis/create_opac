import { ScrollArea } from '@/components/ui/scroll-area'
import { AssetDetailResponse, FileItem } from '@/types/tdr'

interface FileMetadataSectionProps {
	file: FileItem
	assetDetail?: AssetDetailResponse
}

interface MetadataField {
	label: string
	value: string | number | JSX.Element
	grid?: boolean
	break?: boolean
	scroll?: boolean
	conditional?: boolean
}

export function FileMetadataSection({ file, assetDetail }: FileMetadataSectionProps) {
	const metadataFields: MetadataField[] = [
		{
			label: 'UUID',
			value: assetDetail?.Uuid || file.originalData?.Uuid || file.id
		},
		{
			label: 'File Name',
			value: assetDetail?.Name || file.name
		},
		{
			label: 'Package Name',
			value: assetDetail?.PackageName || file.originalData?.PackageName || 'Unknown'
		},
		{
			label: 'Size (B)',
			value: assetDetail?.BytesSize || file.originalData?.BytesSize || 'Unknown',
			grid: true
		},
		{
			label: 'Size (MB)',
			value: assetDetail?.MbSize || file.originalData?.MbSize || file.size,
			grid: true
		},
		{
			label: 'Date Created',
			value: assetDetail?.IngestDateTimeString || file.originalData?.IngestDateTimeString || file.date,
			grid: true
		},
		{
			label: 'Created By',
			value: assetDetail?.CreatedBy || 'System',
			grid: true
		},
		{
			label: 'Date Last Modified',
			value: assetDetail?.IngestDateTimeString || file.originalData?.IngestDateTimeString || file.date,
			grid: true
		},
		{
			label: 'Last Modified By',
			value: assetDetail?.LastModifiedBy || assetDetail?.CurrentStatus || file.originalData?.CurrentStatus || 'Normalization',
			grid: true
		},
		{
			label: 'Date Last Accessed',
			value: new Date().toLocaleString()
		},
		{
			label: 'Format Type',
			value: assetDetail?.FormatType || file.originalData?.FormatType || 'document-pageDescription',
			grid: true
		},
		{
			label: 'Format ID',
			value: assetDetail?.FormatUuid || file.originalData?.FormatUuid || 'Unknown',
			grid: true
		},
		{
			label: 'Format Name',
			value: assetDetail?.FormatName || file.originalData?.FormatName || 'Portable Document Format'
		},
		{
			label: 'MIME Type',
			value: assetDetail?.MimeType || file.originalData?.MimeType || 'application/pdf'
		},
		{
			label: 'File Extension',
			value: assetDetail?.Extension || file.originalData?.Extension || '.pdf'
		},
		{
			label: 'Storage',
			value: assetDetail?.AipStorage || file.originalData?.AipStorage || 'TitanBlob'
		},
		{
			label: 'Blob Uri',
			value: assetDetail?.BlobUri || file.originalData?.BlobUri || 'https://boctestsotrage.blob.core.windows.net/...',
			break: true
		},
		{
			label: 'Blob Container',
			value: assetDetail?.BlobContainer || file.originalData?.BlobContainer || 'Unknown'
		},
		{
			label: 'Blob Reference',
			value: assetDetail?.BlobReference || file.originalData?.BlobReference || file.originalData?.RelativePath || 'Unknown'
		},
		{
			label: 'Description',
			value: assetDetail?.Description || assetDetail?.Content || file.description,
		},
		{
			label: 'OCR Content',
			value: assetDetail?.OcrContent || '',
			scroll: true,
			conditional: !!assetDetail?.OcrContent
		}
	];

	const renderField = (field: MetadataField, index: number) => {
		if (field.conditional === false) return <></>;

		const content = (
			<div key={index}>
				<h3 className="text-sm font-medium text-gray-500">{field.label}</h3>
				{field.scroll ? (
					<ScrollArea className="h-[200px]">
						<p className="text-sm text-gray-900">{field.value}</p>
					</ScrollArea>
				) : (
					<p className={`mt-1 text-sm text-gray-900 ${field.break ? 'break-all' : ''}`}>{field.value}</p>
				)}
			</div>
		);

		return content;
	};

	const renderGridFields = () => {
		const gridFields = metadataFields.filter(field => field.grid && (field.conditional !== false));
		const result = [];

		for (let i = 0; i < gridFields.length; i += 2) {
			const pair = [
				gridFields[i],
				i + 1 < gridFields.length ? gridFields[i + 1] : null
			];

			result.push(
				<div key={`grid-${i}`} className="grid grid-cols-2 gap-4">
					{pair[0] && renderField(pair[0], -i - 1000)}
					{pair[1] && renderField(pair[1], -i - 1001)}
				</div>
			);
		}

		return result;
	};

	return (
		<div className="space-y-4">
			{metadataFields
				.filter(field => !field.grid && (field.conditional !== false))
				.map((field, index) => renderField(field, index))}
			{renderGridFields()}
		</div>
	);
}
