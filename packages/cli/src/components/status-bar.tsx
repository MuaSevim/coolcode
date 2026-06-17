import { TextAttributes } from "@opentui/core";

export function StatusBar() {
  return (
    <box flexDirection="row" gap={1}>
      <text fg="cyan">Build...</text>
      <text attributes={TextAttributes.DIM} fg="gray">
        &#8250;
      </text>
      <text>opus-4-6</text>
    </box>
  );
}

export function InputBar({ onSubmit, disabled = false }: Props) {
  return (
    <box width="100%" alignItems="center">
      <text fg="cyan">Input...</text>
      <text attributes={TextAttributes.DIM} fg="gray">
        &#8250;
      </text>
      <text>src/index.ts</text>
    </box>
  );
}
