import { useEffect } from "react";

export function useDisableContextMenu() {
  useEffect(() => {
    console.warn(
      "%cWarning!",
      "color: red; font-size: 40px; font-weight: bold;",
      "Inspecting or modifying this site is disabled."
    );

    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    const handleKeyDown = (event) => {
      const isCmdOrCtrl = event.ctrlKey || event.metaKey;
      const isShift = event.shiftKey;
      const key = event.key.toUpperCase();

      if (
        event.key === "F12" ||
        (isCmdOrCtrl && isShift && (key === "I" || key === "J" || key === "C")) ||
        (isCmdOrCtrl && key === "U")
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}