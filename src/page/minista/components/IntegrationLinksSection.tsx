import { Database, ExternalLink, Eye, Image, Shield } from 'lucide-react'
import { AssetDetailResponse, FileItem } from '@/types/tdr'
import { IntegrationLinkItem } from './IntegrationLinkItem'

interface IntegrationLinksSectionProps {
	file: FileItem
	assetDetail?: AssetDetailResponse
}

export function IntegrationLinksSection({ file, assetDetail }: IntegrationLinksSectionProps) {
	const links = [
		{
			icon: <Eye className="w-4 h-4" />,
			title: 'Access Link',
			url: assetDetail?.AccessLink,
			iconBgColor: 'bg-blue-100',
			iconTextColor: 'text-blue-600',
		},
		{
			icon: <Image className="w-4 h-4" />,
			title: 'Thumbnail Link',
			url: assetDetail?.ThumbnailLink,
			iconBgColor: 'bg-amber-100',
			iconTextColor: 'text-amber-600',
		},
		{
			icon: <Shield className="w-4 h-4" />,
			title: 'Preservation Link',
			url:
				assetDetail?.PreservationLink,
			iconBgColor: 'bg-green-100',
			iconTextColor: 'text-green-600',
		},
		{
			icon: <Database className="w-4 h-4" />,
			title: 'Content Link',
			url: assetDetail?.ContentLink,
			iconBgColor: 'bg-purple-100',
			iconTextColor: 'text-purple-600',
		},
		{
			icon: <ExternalLink className="w-4 h-4" />,
			title: 'Original Link',
			url: assetDetail?.OriginalLink,
			iconBgColor: 'bg-red-100',
			iconTextColor: 'text-red-600',
		},
	]

	return (
		<div className="p-6 pt-4">
			<h3 className="text-lg font-medium mb-4">Integration Links</h3>
			<div className="space-y-4">
				{links.map((link, index) => (
					<IntegrationLinkItem
						key={index}
						icon={link.icon}
						title={link.title}
						url={link.url ?? ''}
						iconBgColor={link.iconBgColor}
						iconTextColor={link.iconTextColor}
					/>
				))}
			</div>
		</div>
	)
}
