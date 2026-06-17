export function Header() {
  return (
    <box alignItems="center" justifyContent="center">
      <box
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        gap={0.5}
      >
        <ascii-font font="tiny" text="Cool" color="grey" />
        <ascii-font font="tiny" text="Code" />
      </box>
    </box>
  );
}
