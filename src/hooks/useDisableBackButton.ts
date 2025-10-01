import { useEffect } from "react";

export default function useDisableBackButton() {
  useEffect(() => {
    const blockBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", blockBack);
    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
      e.returnValue = "";
    });

    return () => {
      window.removeEventListener("popstate", blockBack);
      window.removeEventListener("beforeunload", blockBack);
    };
  }, []);
}
