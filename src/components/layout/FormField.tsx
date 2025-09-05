import { LucideIcon } from 'lucide-react';
import React from 'react'
import { FieldError } from 'react-hook-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  icon?: LucideIcon;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  error?: FieldError;
}

const FormField = ({
  id,
  label,
  type = "text",
  placeholder,
  icon: Icon,
  register,
  error,
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-4 h-4 w-4 text-foreground" />}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`pl-10 h-12 border-gray-200 focus:border-[var(--abstractCyan)]`}
          {...register(id)}
        />
      </div>
      {error && <p className="text-[10px] text-mainRed">{error.message}</p>}
    </div>
  )
}

export default FormField
