import { EmptyBorder } from "./border";
import { StatusBar } from "./status-bar";
import type { KeyBinding } from "@opentui/core";

type Props = {
  onSubmit: (value: string) => void;
  disabled?: boolean;
};

// Defining the key bindings. This is how it's done in OpenTUI + React + TypeScript at least
export const TEXTAREA_KEY_BINDINGS: KeyBinding[] = [
  { name: "return", action: "submit" },
  { name: "enter", action: "submit" },
  { name: "return", shift: true, action: "newline" },
  { name: "enter", shift: true, action: "newline" },
];

export function InputBar({ onSubmit, disabled = false }: Props) {
  return (
    <box width="100%" alignItems="center">
      <box
        border={["left"]}
        borderColor="cyan"
        customBorderChars={{ ...EmptyBorder, vertical: "│" }}
        width="100%"
      >
        <box
          position="relative"
          justifyContent="center"
          paddingX={2}
          paddingY={1}
          backgroundColor="#1A1A24"
          width="100%"
          gap={1}
        >
          <textarea
            focused={!disabled}
            placeholder="Ask anything..."
            keyBindings={TEXTAREA_KEY_BINDINGS}
          />
          <StatusBar />
        </box>
      </box>
    </box>
  );
}
