import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/providers/EasyloadAuthProvider'
import { Search, Upload, Webcam } from 'lucide-react'
import AssetSearch from './AssetSearch'
import AssetUpload from './AssetUpload'
import ScreenRecorder from './ScreenRecorder'

const MainContent = () => {
	const { authToken, loading, error } = useAuth()

	if (!authToken && loading) return 'Loading...'
	if (error) return 'Unable to login'
	if (!authToken) return ''

	return (
		<Card className="w-full  mx-auto">
			<CardContent className="p-6">
				<Tabs defaultValue="search" className="space-y-6">
					<TabsList className="grid w-full grid-cols-2 rounded-lg bg-muted p-1 h-14">
						<TabsTrigger
							value="search"
							className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow">
							<Search className="h-5 w-5" />
						</TabsTrigger>
						<TabsTrigger
							value="upload"
							className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow">
							<Upload className="h-5 w-5" />
						</TabsTrigger>
						{/* <TabsTrigger
							value="camera"
							className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow">
							<Camera className="h-5 w-5" />
						</TabsTrigger> */}
						{/* <TabsTrigger
							value="screen"
							className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow">
							<Monitor className="h-5 w-5" />
						</TabsTrigger>
						<TabsTrigger
							value="capture"
							className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow">
							<Webcam className="h-5 w-5" />
						</TabsTrigger> */}
					</TabsList>

					<TabsContent value="search" className="p-4 bg-background rounded-lg">
						<AssetSearch />
					</TabsContent>

					<TabsContent value="upload" className="p-4">
						<div className="text-center p-8 border-2 border-dashed rounded-lg">
							<AssetUpload />
						</div>
					</TabsContent>

					{/* <TabsContent value="camera" className="p-4">
						<div className="text-center p-8 border-2 border-dashed rounded-lg">
							<Camera className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
							<h3 className="font-medium mb-2">Camera Access</h3>
							<p className="text-sm text-muted-foreground mb-4">
								Allow access to your camera to take photos
							</p>
							<Button>Enable Camera</Button>
						</div>
					</TabsContent> */}

					<TabsContent value="screen" className="p-4">
						<ScreenRecorder />
					</TabsContent>

					<TabsContent value="capture" className="p-4">
						<div className="text-center p-8 border-2 border-dashed rounded-lg">
							<Webcam className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
							<h3 className="font-medium mb-2">Screen Capture</h3>
							<p className="text-sm text-muted-foreground mb-4">Take a screenshot of your screen</p>
							<Button>Capture Screenshot</Button>
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	)
}

export default MainContent
