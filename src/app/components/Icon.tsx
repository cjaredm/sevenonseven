import React, { forwardRef } from "react";
import { Icon as Iconfiy, IconProps as IconifyProps } from "@iconify/react";

export type IconProps = Omit<IconifyProps, "icon"> & {
  name: keyof typeof ICONS;
};

const Icon = forwardRef<React.ElementRef<typeof Iconfiy>, IconProps>(
  ({ name, ...props }: IconProps, ref) => {
    return (
      // @ts-ignore
      <Iconfiy ref={ref} icon={ICONS[name] ?? "raphael:question"} {...props} />
    );
  },
);
Icon.displayName = "Icon";

export default Icon;

// Icons from https://icon-sets.iconify.design/
export const ICONS = {
  trash: "heroicons:trash",
  continue: "carbon:continue-filled",
};
