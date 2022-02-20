import * as React from 'react';

export const Checkbox = ({
  children: label,
  name,
  defaultChecked = false,
  desc,
}: {
  children: React.ReactNode;
  defaultChecked?: boolean;
  name: string;
  desc?: string;
}) => {
  const [checked, setChecked] = React.useState(defaultChecked);
  React.useEffect(() => {
    void (async function () {
      const saved = await craft.storageApi.get(name);
      if (saved.data) {
        setChecked(saved.data === '1');
      }
    })();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    craft.storageApi.put(name, newValue ? '1' : '0');
    setChecked(newValue);
  };

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
