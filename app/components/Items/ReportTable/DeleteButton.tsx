import { FC } from "react";
import { Form } from "@remix-run/react";
import { TrashIcon } from "@heroicons/react/outline";
import { useLocation } from "react-router-dom";
type Props = {
  reportId: string;
};
const DeleteButton: FC<Props> = ({ reportId }) => {
  const location = useLocation();
  return (
    <Form action="/api/report/delete" method="post">
      <input type="hidden" name="reportId" value={reportId} />
      <input
        type={"hidden"}
        name="location"
        value={String(location.pathname)}
      />
      <button type="submit" className="w-4">
        <TrashIcon />
      </button>
    </Form>
  );
};

export default DeleteButton;
