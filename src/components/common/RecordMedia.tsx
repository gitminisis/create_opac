import React, { useState } from 'react'
import ImageCarousel, { DocumentProps, ImageProps, VideoProps } from '@/components/common/ImageCarousel'
import PDFViewer from '@/components/common/PDFViewer'
import { FileText, X } from 'lucide-react'

export interface RecordMediaProps {
  images: ImageProps[]
  videos: VideoProps[]
  documents?: DocumentProps[]
  noMediaText: string
}

const RecordMedia: React.FC<RecordMediaProps> = ({ images, videos, documents = [], noMediaText }) => {
  const [selectedDocument, setSelectedDocument] = useState<DocumentProps | null>(null)

  return (
    <>
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
                  onClick={() => setSelectedDocument(doc)}
                  className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="p-2 bg-blue-100 rounded">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Document {index + 1}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{doc.src}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PDF Viewer Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Document Viewer</h2>
              <button
                onClick={() => setSelectedDocument(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <PDFViewer fileUrl={selectedDocument.src} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RecordMedia
