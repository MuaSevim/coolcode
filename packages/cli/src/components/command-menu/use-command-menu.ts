import { useRef, useMemo, useState, type RefObject } from "react";
import { ScrollBoxRenderable } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { getFilteredCommands } from "./filter-commands";
import type { Command } from "./types";

// Defining the return type of this use-command-menu "hook"

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

  // Keep this filteredCommands list unless the "commandQuery" changes.
  // Apart from that everything will be done while having this list.
  // Operations over this list.
  const filteredCommands = useMemo(
    () => getFilteredCommands(commandQuery),
    [commandQuery],
  );

  const handleContentChange = (text: string) => {
    setTextValue(text);
    setSelectedIndex(0);

    // Jump back to top of the list when user types a new character
    const scrollbox = scrollRef.current;
    if (scrollbox) {
      scrollbox.scrollTo(0);
    }

    const prefix = text.startsWith("/") ? text.slice(1) : "";
    if (prefix !== null && !prefix.includes(" ")) {
      setShowCommandMenu(true);
    } else {
      setShowCommandMenu(false);
    }

    // Resolve a command at a specific index (return the command, caller handles execution)
    const resolveCommand = (index: number): Command | undefined => {
      const command = filteredCommands[index];
      if (command) {
        setShowCommandMenu(false);
      } else {
        return command;
      }
    };

    // Arrow keys move selection;
    useKeyboard((key) => {
      if (!showCommandMenu) return;

      if (key.name === "escape") {
        key.preventDefault();
        setShowCommandMenu(false);
      } else if (key.name === "up") {
        key.preventDefault();
        if (selectedIndex === 0) return;
        setSelectedIndex((i: number) => {
          const newIndex = Math.max(0, i - 1);

          const sb = scrollRef.current; 
          if (sb && newIndex < sb.scrollTop) {
            sb.scrollTo(newIndex);
          } else if (key.name === "down") {
            key.preventDefault();
            setSelectedIndex((i: number) => {
              if (filteredCommands.length === 0) {
                return 0;
              }

              const newIndex = Math.min(filteredCommands.length - 1, i + 1);
              const sb = scrollRef.current;
              if(sb){
                
              }
            });
          }

          return i;
        });
      }
    });
  };
}

// If the "scrollTop" === 0: it's the beginning of the "scrollable" list
// If the "scrollTop" === 3: there are 3 hidden items above the list
