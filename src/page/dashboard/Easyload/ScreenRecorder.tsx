import React, { useState, useCallback, useRef } from 'react'
import { Video, StopCircle, Camera, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface RecordingData {
	url: string
	chunks: Blob[]
}

const ScreenRecorder: React.FC = () => {
	const [recording, setRecording] = useState<boolean>(false)
	const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
	const [recordingData, setRecordingData] = useState<RecordingData | null>(null)
	const [error, setError] = useState<string | null>(null)
	const liveVideoRef = useRef<HTMLVideoElement>(null)
	const [stream, setStream] = useState<MediaStream | null>(null)

	const startRecording = useCallback(async () => {
		try {
			const mediaStream = await navigator.mediaDevices.getDisplayMedia({
				video: true,
				audio: true,
			})

			// Set up live preview
			if (liveVideoRef.current) {
				liveVideoRef.current.srcObject = mediaStream
			}
			setStream(mediaStream)

			const recorder = new MediaRecorder(mediaStream)
			setMediaRecorder(recorder)

			const chunks: Blob[] = []
			recorder.ondataavailable = (e: BlobEvent) => {
				if (e.data.size > 0) {
					chunks.push(e.data)
				}
			}

			recorder.onstop = () => {
				const blob = new Blob(chunks, { type: 'video/webm' })
				const url = URL.createObjectURL(blob)
				setRecordingData({ url, chunks })

				// Stop all tracks
				mediaStream.getTracks().forEach((track) => track.stop())
				setStream(null)
				if (liveVideoRef.current) {
					liveVideoRef.current.srcObject = null
				}
			}

			recorder.start()
			setRecording(true)
			setError(null)
		} catch (err) {
			setError(
				'Failed to start recording. Please ensure you have granted the necessary permissions.'
			)
			console.error('Error starting screen recording:', err)
		}
	}, [])

	const stopRecording = useCallback(() => {
		if (mediaRecorder && recording) {
			mediaRecorder.stop()
			setRecording(false)
		}
	}, [mediaRecorder, recording])

	const downloadRecording = useCallback(() => {
		if (!recordingData?.chunks.length) return

		const blob = new Blob(recordingData.chunks, { type: 'video/webm' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		document.body.appendChild(a)
		a.style.display = 'none'
		a.href = url
		a.download = `screen-recording-${new Date().toISOString()}.webm`
		a.click()
		URL.revokeObjectURL(url)
		document.body.removeChild(a)
	}, [recordingData])

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader className="flex flex-col justify-center items-center">
				<Monitor className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
				<h3 className="font-medium mb-2">Screen Recording</h3>
				<p className="text-sm text-muted-foreground mb-4">Start recording your screen</p>
			</CardHeader>
			<CardContent className="space-y-4">
				{error && (
					<Alert variant="destructive">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<div className="flex justify-center">
					{!recording ? (
						<Button onClick={startRecording} className="gap-2" variant="default">
							<Camera className="w-4 h-4" />
							Start Recording
						</Button>
					) : (
						<Button onClick={stopRecording} className="gap-2" variant="destructive">
							<StopCircle className="w-4 h-4" />
							Stop Recording
						</Button>
					)}
				</div>

				{/* Live Preview */}
				{recording && (
					<div className="space-y-2">
						<p className="text-sm font-medium text-red-500">Recording in progress...</p>
						<video
							ref={liveVideoRef}
							autoPlay
							muted
							className="w-full rounded-md border border-red-500"
						/>
					</div>
				)}

				{/* Recorded Video */}
				{recordingData?.url && !recording && (
					<div className="space-y-4">
						<p className="text-sm font-medium">Recording completed:</p>
						<video
							src={recordingData.url}
							controls
							className="w-full rounded-md border"
						/>
						<Button
							onClick={downloadRecording}
							className="w-full gap-2"
							variant="secondary">
							<Video className="w-4 h-4" />
							Download Recording
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

export default ScreenRecorder
