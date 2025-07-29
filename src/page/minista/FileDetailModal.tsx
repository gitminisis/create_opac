import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { axios } from '@/lib/axios'
import { AssetDetailResponse, FileItem } from '@/types/tdr'
import { useQuery } from '@tanstack/react-query'
import { ErrorState } from './components/ErrorState'
import { FileMetadataSection } from './components/FileMetadataSection'
import { FileThumbnail } from './components/FileThumbnail'
import { IntegrationLinksSection } from './components/IntegrationLinksSection'
import { LoadingState } from './components/LoadingState'
import { ModalFooter } from './components/ModalFooter'
import { ModalHeader } from './components/ModalHeader'

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
				Authorization: `Bearer ${token}`,
			},
		})

		return response.data
	}

	// Use React Query to fetch asset details when modal is open
	const {
		isLoading,
		error: queryError,
		data: assetDetail,
	} = useQuery<AssetDetailResponse>({
		queryKey: ['assetDetail', file.id],
		queryFn: fetchAssetDetail,
		enabled: isOpen && !!file.id,
		staleTime: 5 * 60 * 1000, // 5 minutes
	})

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
				<ModalHeader fileName={file.name} onClose={onClose} />

				{/* Scrollable Content Area */}
				<ScrollArea className="flex-1 overflow-auto">
					{isLoading ? (
						<LoadingState />
					) : queryError ? (
						<ErrorState />
					) : (
						<Tabs defaultValue="details" className="w-full">
							<div className="px-6 pt-4"></div>

							<TabsContent value="details" className="mt-0">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 pt-4">
									<div>
										<FileThumbnail file={file} />
										<IntegrationLinksSection file={file} assetDetail={assetDetail} />
									</div>

									<FileMetadataSection file={file} assetDetail={assetDetail} />
								</div>
							</TabsContent>

							<TabsContent value="links" className="mt-0"></TabsContent>
						</Tabs>
					)}
				</ScrollArea>

				<ModalFooter onClose={onClose} />
			</div>
		</div>
	)
}
