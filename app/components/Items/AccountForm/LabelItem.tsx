import { FC } from "react";

type Props = {
  htmlFor: string;
  title: string;
};
const LabelItem: FC<Props> = ({ htmlFor, title }) => {
  return (
    <label
      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
      htmlFor={htmlFor}
    >
      {title}
    </label>
  );
};

export default LabelItem;
