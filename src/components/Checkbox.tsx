import * as React from 'react';

export const Checkbox = ({
  children: label,
  onChange,
  checked,
  desc,
}: {
  children: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  desc?: string;
}) => {
  return (
    <label className="flex items-center">
      <input
        checked={checked}
        onChange={onChange}
        type="checkbox"
        className="
        rounded
        border-gray-300
        text-indigo-600
        shadow-sm
        focus:border-indigo-300
        focus:ring
        focus:ring-offset-0
        focus:ring-indigo-200
        focus:ring-opacity-50
          "
      />
      <div className="inline-flex flex-col ml-3">
        <span className=" capitalize">{label}</span>
        <span className="text-sm leading-4 text-gray-400">{desc}</span>
      </div>
    </label>
  );
};
