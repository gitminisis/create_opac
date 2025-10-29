import React from 'react'
import ImageCarousel, { DocumentProps, ImageProps, VideoProps } from '@/components/common/ImageCarousel'
import { FileText, ExternalLink } from 'lucide-react'

export interface RecordMediaProps {
  images: ImageProps[]
  videos: VideoProps[]
  documents?: DocumentProps[]
  noMediaText: string
}

const RecordMedia: React.FC<RecordMediaProps> = ({ images, videos, documents = [], noMediaText }) => {
  const handleDocumentClick = (docUrl: string) => {
    window.open(docUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-w-[300px] w-full max-w-[500px] text-center mx-auto space-y-4">
      {/* Images and Videos */}
      {images && images.length > 0 ? (
        <ImageCarousel
          items={[...images, ...videos]}
          renderItems={(item) => {
            if (!(item as ImageProps).src) {
              return (
                <img
                  alt={'video thumbnail'}
                  src={
                    'https://d2uolguxr56s4e.cloudfront.net/img/kartrapages/video_player_placeholder.gif'
                  }
                  className="h-36 mx-auto cursor-pointer object-cover border-4 hover:border-primary"
                />
              )
            }

            const image = item as ImageProps
            return (
              <img
                alt={image.src}
                src={image.src}
                className="rounded h-36 mx-auto cursor-pointer object-cover border-4 hover:border-primary bg-gray-300"
              />
            )
          }}
        />
      ) : (
        <>
          <img
            alt={noMediaText}
            src={'https://placehold.co/250x250'}
            className="h-36 mx-auto cursor-pointer object-cover border-4 hover:border-primary"
          />
          <span>{noMediaText}</span>
        </>
      )}

      {/* Documents Section */}
      {documents && documents.length > 0 && (
        <div className="w-full">
          <h3 className="text-sm font-semibold mb-2 text-left">Documents</h3>
          <div className="space-y-2">
            {documents.map((doc, index) => (
              <button
                key={index}
                onClick={() => handleDocumentClick(doc.src)}
                className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors text-left group"
              >
                <div className="p-2 bg-blue-100 rounded group-hover:bg-blue-200 transition-colors">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {doc.caption ?? `Document ${index + 1}`}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{doc.src}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default RecordMedia