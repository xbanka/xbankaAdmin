"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { PasswordFieldProps } from "@/lib/types/PasswordField";

const PasswordField = ({
  id,
  label,
  placeholder,
  icon: Icon,
  register,
  error,
  disabled,
}: PasswordFieldProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground" />}
        <Input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          disabled={disabled}
          className={`${Icon ? "pl-10 pr-10" : "px-3 pr-10"}`}
          {...register(id)}
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onMouseDown={(e) => e.preventDefault()}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-[10px] text-mainRed">{error.message}</p>}
    </div>
  );
};

export default PasswordField;