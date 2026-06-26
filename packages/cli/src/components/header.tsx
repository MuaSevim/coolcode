import { TextAttributes } from "@opentui/core";

type HeaderProps = {
  primary: string;
};

export function Header({ primary }: HeaderProps) {
  return (
    <box alignItems="center" justifyContent="center" width="100%" paddingY={1}>
      <box
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        gap={1}
      >
        {/* Using the standard ASCII typography block from your original structure */}
        <ascii-font font="tiny" text="Cool" color={primary} />
        <ascii-font font="tiny" text="Code" color="#C9D1D9" />
      </box>

      {/* A clean, dim metadata baseline directly under the text to frame the work area */}
      <box marginTop={1} flexDirection="row" gap={2}>
        <text fg="#8B949E" attributes={TextAttributes.DIM}>
          v1.0.0
        </text>
        <text fg="#8B949E" attributes={TextAttributes.DIM}>
          │
        </text>
        <text fg="#238636">online</text>
      </box>
    </box>
  );
}
