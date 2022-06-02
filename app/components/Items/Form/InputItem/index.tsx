import { ChangeEvent, FC } from "react";

type Props = {
  className: string;
  type: string;
  value: string | number;
  name: string;
  placeholder: string;
  required: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};
const InputItem: FC<Props> = ({
  className,
  onChange,
  type,
  value,
  name,
  placeholder = "",
  required = false,
}) => {
  return (
    <input
      id={name}
      onChange={onChange}
      type={type}
      value={value}
      name={name}
      className={className}
      placeholder={placeholder}
      required={required}
    />
  );
};
export default InputItem;
