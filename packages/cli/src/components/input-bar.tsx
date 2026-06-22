import { useRef, useCallback, useEffect } from "react";
import { TextareaRenderable } from "@opentui/core";
import { useKeyboard, useRenderer } from "@opentui/react";
import { EmptyBorder } from "./border";
import { StatusBar } from "./status-bar";
import type { KeyBinding } from "@opentui/core";
import { CommandMenu } from "./command-menu";
import type { Command } from "./command-menu/types";
import { useCommandMenu } from "./command-menu/use-command-menu";
import { useToast } from "../providers/toast";
import { useKeyboardLayer } from "../providers/keyboard-layer";

type Props = {
  onSubmit: (value: string) => void;
  onCommand?: (command: string) => void;
  disabled?: boolean;
};

// Defining the key bindings. This is how it's done in OpenTUI + React + TypeScript at least
export const TEXTAREA_KEY_BINDINGS: KeyBinding[] = [
  { name: "return", action: "submit" },
  { name: "enter", action: "submit" },
  { name: "return", shift: true, action: "newline" },
  { name: "enter", shift: true, action: "newline" },
  { name: "enter", shift: true, action: "newline" },
];

export function InputBar({ onSubmit, onCommand, disabled = false }: Props) {
  // useRef is an alternative way of connecting/linking an element to the DOM
  // You need to explicitly define link the connection between the variable and the element tho
  const textareaRef = useRef<TextareaRenderable>(null);
  const onSubmitRef = useRef<() => void>(() => {});
  const renderer = useRenderer();
  const toast = useToast();
  const { isTopLayer, setResponder } = useKeyboardLayer();

  const {
    showCommandMenu,
    commandQuery,
    selectedIndex,
    scrollRef,
    handleContentChange,
    resolveCommand,
    setSelectedIndex,
  } = useCommandMenu();

  const handleCommand = useCallback(
    (command: Command | undefined) => {
      const textArea = textareaRef.current;

      if (!textArea || !command) return;

      // reset the ui
      textArea.setText("");

      if (command.action) {
        command.action({
          exit: () => renderer.destroy(),
          toast,
        });
      } else {
        textArea.insertText(command.value + " ");
      }
    },
    [renderer, toast],
  );

  const handleCommandExecute = useCallback(
    (index: number) => {
      const command = resolveCommand(index);
      handleCommand(command);
    },
    [handleCommand, resolveCommand],
  );

  const handleTextareaContentChange = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    handleContentChange(textarea.plainText);
  }, []);

  // Wiring up the textarea submit handler so it always reads the latest state
  useEffect(() => {
    const textArea = textareaRef.current;
    if (!textArea) return;

    textArea.onSubmit = () => {
      onSubmitRef.current();
    };
  }, []);

  const handleSubmit = useCallback(() => {
    if (disabled) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const text = textarea.plainText.trim();
    if (text.length === 0) return;

    onSubmit(text);
  }, [disabled, onSubmit]);

  onSubmitRef.current = () => {
    if (disabled) return;

    if (showCommandMenu) {
      const command = resolveCommand(selectedIndex);
      handleCommand(command);
      return;
    }

    handleSubmit();
  };

  // Registering the base layer responder
  useEffect(() => {
    setResponder("base", () => {
      if (disabled) return false;

      const textarea = textareaRef.current;

      if (textarea && textarea.plainText.length > 0) {
        textarea.setText("");
        return true;
      }

      return false;
    });

    return () => setResponder("base", null);
  }, [disabled, setResponder]);

  return (
    <box width="100%" alignItems="center">
      <box
        border={["left"]}
        borderColor={disabled ? "#30363D" : "#F85149"}
        customBorderChars={{ ...EmptyBorder, vertical: "│" }}
        width="100%"
      >
        <box
          position="relative"
          justifyContent="center"
          paddingX={2}
          paddingY={1}
          backgroundColor="#0D1117"
          width="100%"
          gap={1}
        >
          {showCommandMenu && (
            <box
              position="absolute"
              bottom="100%"
              left={0}
              width="100%"
              backgroundColor="#161B22"
              zIndex={10}
            >
              <CommandMenu
                query={commandQuery}
                selectedIndex={selectedIndex}
                scrollRef={scrollRef}
                onSelect={setSelectedIndex}
                onExecute={handleCommandExecute}
              />
            </box>
          )}

          <textarea
            ref={textareaRef}
            focused={!disabled}
            placeholder="Ask anything..."
            onContentChange={handleTextareaContentChange}
            keyBindings={TEXTAREA_KEY_BINDINGS}
          />
          <StatusBar />
        </box>
      </box>
    </box>
  );
}
