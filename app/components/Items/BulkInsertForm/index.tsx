import { FC } from "react";
import { Form } from "@remix-run/react";
const BulkInsertForm: FC = () => {
  return (
    <div>
      <Form method="post" encType="multipart/form-data">
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs text-center font-bold mb-2"
          htmlFor="file_input"
        >
          Upload file
        </label>
        <input
          className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
          id="file_input"
          name="bulkInsertFile"
          type="file"
          accept="text/csv"
        />
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          >
            登録
          </button>
        </div>
      </Form>
    </div>
  );
};

export default BulkInsertForm;
