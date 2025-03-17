import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import useScreenDimensions from '@/hooks/useScreenDimensions'
import {
	deleteTDRBookmark,
	generateBookmarkId,
	generateTDRIframeURL,
	getTDRAccessToken,
	getTDRBookmark,
	TDRFile,
} from '@/lib/tdr'
import { useEffect, useState } from 'react'

type TDRLinkingProps = { onAssetsSelect: (files: TDRFile[]) => void }

const TDRLinking = ({ onAssetsSelect }: TDRLinkingProps) => {
	const { height, width } = useScreenDimensions()
	const [accessToken, setAccessToken] = useState<string | undefined>()
	const [open, setOpen] = useState(false)
	const [id, setId] = useState<string | undefined>()

	useEffect(() => {
		if (open && !id) {
			const bookmarkId = generateBookmarkId()
			setId(bookmarkId)
		}

		if (!open) {
			reset()

			if (id && accessToken) {
				deleteTDRBookmark(accessToken, id)
					.then((res) => {})
					.catch((err) => console.error(err))
			}
		}
	}, [accessToken, id, open])

	const reset = () => {
		setId(undefined)
	}

	const handleAssetsSelect = async () => {
		const authRes = await getTDRAccessToken()
		if (authRes && id) {
			const { access_token } = authRes
			setAccessToken(access_token)

			const bookmarkedItems = await getTDRBookmark(access_token, id)

			if (bookmarkedItems) {
				onAssetsSelect(bookmarkedItems)
			} else {
				throw new Error('No files from TDR')
			}

			setOpen(false)
		} else {
			throw new Error('Missing Access Token')
		}
	}

	return (
		<>
			<Dialog
				open={open}
				onOpenChange={async (state) => {
					setOpen(state)
				}}>
				<DialogTrigger asChild>
					<Button
						onClick={() => {
							if (!open) {
								setOpen(true)
							}
						}}>
						Browse from TDR
					</Button>
				</DialogTrigger>
				<DialogContent className=" max-w-full w-fit h-fit">
					<DialogHeader>
						<DialogTitle>Search from TDR Portal</DialogTitle>
					</DialogHeader>
					{id && (
						<iframe
							width={width * 0.75}
							height={height * 0.75}
							title="TDR Portal"
							src={generateTDRIframeURL(id)}
						/>
					)}

					<DialogFooter>
						<Button onClick={handleAssetsSelect}>Confirm</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default TDRLinking
