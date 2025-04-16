import 'yet-another-react-lightbox/styles.css'
import Lightbox from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Video from 'yet-another-react-lightbox/plugins/video'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/plugins/captions.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import { Slide } from 'yet-another-react-lightbox'
import Counter from 'yet-another-react-lightbox/plugins/counter'

export interface LightboxImageProps {
	open: boolean
	onOpen: (open: boolean) => void
	items: Slide[]
}

const LightboxImage = ({ items, onOpen, open }: LightboxImageProps) => {
	return (
		<Lightbox
			open={open}
			close={() => onOpen(false)}
			slides={items}
			plugins={[Captions, Fullscreen, Slideshow, Thumbnails, Video, Zoom, Counter]}
		/>
	)
}

export default LightboxImage
