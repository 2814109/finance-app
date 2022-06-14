import { FC } from "react";

type Props = {
  id: string;
  name: string;
  type: string;
  placeholder?: string;
};

const InputItem: FC<Props> = ({ id, name, placeholder, type }) => {
  return (
    <input
      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
      name={name}
      id={id}
      type={type}
      placeholder={placeholder}
    />
  );
};

export default InputItem;
