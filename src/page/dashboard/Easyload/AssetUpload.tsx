import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import 'filepond/dist/filepond.min.css'

import { FilePondErrorDescription, FilePondFile } from 'filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import React, { useRef, useState } from 'react'
import { FilePond, registerPlugin } from 'react-filepond'
import { DeleteAsset, UploadAssetChunk, CommitAssetUpload, sliceChunks } from '@/lib/easyload'

// Register the plugin
registerPlugin(FilePondPluginImagePreview)

const AssetUpload: React.FC = () => {
	const [files, setFiles] = useState<File[]>([])

	const filePondRef = useRef<FilePond>(null)
	const handleProcessFile = (
		error: FilePondErrorDescription | null,
		file: FilePondFile
	): void => {
		if (error) {
			console.error('Error uploading file:', error)
			return
		}
	}

	return (
		<FilePond
			files={files}
			onupdatefiles={(fileItems) => {
				setFiles(fileItems.map((fileItem) => fileItem.file as File))
			}}
			allowMultiple={true}
			maxFiles={5}
			server={{
				revert: async (uniqueFieldId, load, error) => {
					const deleteResult = await DeleteAsset(uniqueFieldId)
					if (deleteResult.success) load()
					else error(deleteResult.message || `Error reverting file id ${uniqueFieldId}`)
				},
				process: async (
					fieldName,
					file,
					metadata,
					load,
					error,
					progress,
					abort,
					transfer,
					options
				) => {
					const chunks = sliceChunks(file, options.chunkSize)
					const blockIds = new Array<string>()

					for (let index = 0; index < chunks.length; index++) {
						const fileChunk = chunks[index]
						const uploadResult = await UploadAssetChunk(
							fileChunk,
							`${index + 1}`,
							metadata.fileId,
							file.name,
							index * options.chunkSize,
							file.size
						)

						if (!uploadResult.success) {
							error(
								uploadResult.message ||
									`Error uploading chunk ${index + 1} of ${file.name}`
							)
						} else {
							const blockId = uploadResult.data as string
							blockIds.push(blockId)
							transfer(blockId)
						}
					}

					if (blockIds.length === chunks.length) {
						const commitResult = await CommitAssetUpload(
							metadata.fileId,
							file.name,
							file.type,
							blockIds
						)

						console.log({ commitResult })
						if (commitResult.success) load(commitResult.data as string)
						else error(commitResult.message || `Error commiting upload of ${file.name}`)
					}

					return {
						options,
					}
				},
			}}
			name="files"
			labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
			onprocessfile={handleProcessFile}
			ref={filePondRef}
			allowReorder={true}
			maxParallelUploads={5}
			chunkUploads
			chunkForce
			chunkSize={512 * 1024}
			instantUpload={false}
			forceRevert
			onaddfile={(error, file) => {
				if (error) return
				const metadata = file.getMetadata()
				if (!metadata.fileId) {
					file.setMetadata('fileId', crypto.randomUUID())
				}
			}}
		/>
	)
}

export default AssetUpload
