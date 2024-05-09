type TextInputProps = Partial<React.InputHTMLAttributes<HTMLInputElement>> & {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
};

export default function TextInput({
  label,
  name,
  value,
  onChange,
  ...props
}: TextInputProps) {
  return (
    <label htmlFor={name} className="flex flex-col gap-1">
      <span className="font-bold">{label}</span>
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        className="p-2 rounded"
        {...props}
      />
    </label>
  );
}
