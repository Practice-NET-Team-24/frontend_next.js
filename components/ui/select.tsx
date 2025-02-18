import * as React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  multiple?: boolean;
}

export const Select: React.FC<SelectProps> = ({ children, multiple, ...props }) => {
  return (
    <select {...props} multiple={multiple} className="border p-2 rounded-md w-full">
      {children}
    </select>
  );
};

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

export const SelectItem: React.FC<SelectItemProps> = ({ value, children }) => {
  return <option value={value}>{children}</option>;
};
