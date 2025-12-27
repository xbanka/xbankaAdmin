import { HeaderProps } from "@/lib/types";
import React from "react";

const Header = ({text}: HeaderProps) => {
  return (
    <h1 className="text-[18px] font-[600] leading-[22px] text-[#111827]">
      {text}
    </h1>
  );
};

export default Header;
