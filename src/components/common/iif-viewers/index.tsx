// src/components/UniversalViewerEmbed.tsx
import React, { useEffect, useRef, useId } from 'react';
import "universalviewer/dist/esm/index.css";
import UV from 'universalviewer';
type UniversalViewerEmbedProps = {
  /** IIIF manifest URL */
  manifestUrl: string;
  /** Tailwind classes for outer wrapper */
  className?: string;
  /** Tailwind height for the viewer container */
  heightClass?: string; // e.g., "h-[700px]"
};

/**
 * Minimal Universal Viewer v4 embed (UMD) for React + TS + Tailwind.
 * No npm package required — loads from CDN and calls UV.init(...)
 */
const UniversalViewerEmbed: React.FC<UniversalViewerEmbedProps> = ({
  manifestUrl,
  className = '',
  heightClass = 'h-[700px]',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const uvContainerId = useId().replace(/:/g, '-'); // ensure valid id

//   // Ensure UV v4 CSS is present once
//   useEffect(() => {
//     const CSS_ID = 'uv-v4-css';
//     if (!document.getElementById(CSS_ID)) {
//       const link = document.createElement('link');
//       link.id = CSS_ID;
//       link.rel = 'stylesheet';
//       link.href = 'https://cdn.jsdelivr.net/npm/universalviewer@4/dist/uv.css';
//       document.head.appendChild(link);
//     }
//   }, []);

  // Initialize Universal Viewer using the npm package
  useEffect(() => {
    if (!manifestUrl || !containerRef.current) return;

    let cancelled = false;

    const initViewer = () => {
      try {
        // Clean container (re-init for new manifest)
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        if (cancelled) return;

        // Initialize UV using the imported package
        UV.init(uvContainerId, {
          manifest: manifestUrl,
          embedded: true, // recommended for embedded contexts
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error initializing Universal Viewer:', e);
      }
    };

    initViewer();

    return () => {
      cancelled = true;
    };
  }, [manifestUrl, uvContainerId]);

  return (
    <div className={`w-full ${className}`}>
      {/* simple skeleton while UV loads */}
      <div className={`relative w-full ${heightClass} rounded-lg border border-gray-200 bg-white`}>
        <div
          id={uvContainerId}
          ref={containerRef}
          className="absolute inset-0"
          aria-label="Universal Viewer"
          role="region"
        />
      </div>
    </div>
  );
};

export default UniversalViewerEmbed;
