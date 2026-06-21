import { useRef, useMemo, useState, type RefObject } from "react";
import { ScrollBoxRenderable } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { getFilteredCommands } from "./filter-commands";
import type { Command } from "./types";

type UseCommandMenuReturn = {
  showCommandMenu: boolean;
  commandQuery: string;
  selectedIndex: number;
  scrollRef: RefObject<ScrollBoxRenderable | null>;
  handleContentChange: (text: string) => void;
  resolveCommand: (index: number) => Command | undefined;
  setSelectedIndex: (index: number) => void;
};

export function useCommandMenu(): UseCommandMenuReturn {
  const [textValue, setTextValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const scrollRef = useRef<ScrollBoxRenderable>(null);

  const commandQuery =
    showCommandMenu && textValue.startsWith("/") ? textValue.slice(1) : "";

  const filteredCommands = useMemo(
    () => getFilteredCommands(commandQuery),
    [commandQuery],
  );

  const close = () => {
    setShowCommandMenu(false);
  };

  // Any time user changes a single character in the "terminal"
  const handleContentChange = (text: string) => {
    setTextValue(text);
    setSelectedIndex(0);

    const scrollbox = scrollRef.current;
    if (scrollbox) {
      scrollbox.scrollTo(0);
    }

    const prefix = text.startsWith("/") ? text.slice(1) : null;
    if (prefix !== null && !prefix.includes(" ")) {
      setShowCommandMenu(true);
    } else {
      setShowCommandMenu(false);
    }
  };

  // Resolve a command at a specific index (return the command, caller handles execution)
  const resolveCommand = (index: number): Command | undefined => {
    const command = filteredCommands[index];

    if (command) {
      close();
    }
    return command;
  };

  // Arrow keys move selection;
  useKeyboard((key) => {
    if (!showCommandMenu) return;

    if (key.name === "escape") {
      key.preventDefault();
      setShowCommandMenu(false);
    } else if (key.name === "up") {
      key.preventDefault();

      // If it's already at top of the list, return
      if (selectedIndex === 0) {
        return;
      }

      // Update the index
      setSelectedIndex((i: number) => {
        // New index must be at least "0", can't be smaller than 0th index. Extra protection layer.
        const newIndex = Math.max(0, i - 1);

        // current "scrollbar view"
        const sb = scrollRef.current;

        // If scrollbar exists and newIndex is smaller than top of the scrollable list
        if (sb && newIndex < sb.scrollTop) {
          // Move one step upwards
          sb.scrollTo(newIndex);
        }

        return newIndex;
      });
    } else if (key.name === "down") {
      key.preventDefault();

      setSelectedIndex((i: number) => {
        if (filteredCommands.length === 0) {
          return 0;
        }

        const newIndex = Math.min(filteredCommands.length - 1, i + 1);
        const sb = scrollRef.current;
        if (sb) {
          //1: calculate the scrollable field's viewport height?
          const viewportHeight = sb.viewport.height;

          //2: calculate the visible end
          const visibleEnd = sb.scrollTop + viewportHeight - 1;

          if (newIndex > visibleEnd) {
            sb.scrollTo(newIndex - viewportHeight + 1);
          }
        }

        return newIndex;
      });
    }
  });

  return {
    showCommandMenu,
    commandQuery,
    selectedIndex,
    scrollRef,
    handleContentChange,
    resolveCommand,
    setSelectedIndex,
  };
}

// If the "scrollTop" === 0: it's the beginning of the "scrollable" list
// If the "scrollTop" === 3: there are 3 hidden items above the list
// For the "down" button the "new index" should be at max, the latest element
