import { useState, useEffect } from 'react';

const useLocation = () => {
  const [query, setQuery] = useState(new URLSearchParams(window.location.search));

  useEffect(() => {
    const handleUrlChange = () => {
      setQuery(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('pushstate', handleUrlChange);
    window.addEventListener('replacestate', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('pushstate', handleUrlChange);
      window.removeEventListener('replacestate', handleUrlChange);
    };
  }, []);

  return query;
};

export default useLocation;
