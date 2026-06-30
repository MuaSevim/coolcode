import { useTheme } from "../providers/theme";
import { Header } from "../components/header";
import { InputBar } from "../components/input-bar";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function ThemedRoot({ children }: Props) {
  const { colors } = useTheme();

  return (
    // <box
    //   alignItems="center"
    //   justifyContent="center"
    //   backgroundColor={colors.background}
    //   flexGrow={1}
    //   width="100%"
    //   height="100%"
    //   gap={2}
    // >
    //   <Header primary={colors.primary}/>
    //   <box width="100%" maxWidth={78} paddingX={2}>
    //     <InputBar onSubmit={() => {}} />
    //   </box>
    // </box>
    <box
      backgroundColor={colors.background}
      width="100%"
      height="100%"
      flexGrow={1}
    >
      {children}
    </box>
  );
}
