import { FC } from "react";
import { Form } from "@remix-run/react";
import ArrowIcon from "./ArrowIcon";
import LabelItem from "./LabelItem";
import InputItem from "./InputItem";

const AccountForm: FC = () => {
  return (
    <Form className="w-full " method="post">
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <LabelItem htmlFor="grid-item" title="品目" />
          <InputItem
            id="grid-item"
            name="item"
            placeholder={"食費"}
            type="text"
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <LabelItem htmlFor="grid-price" title="金額" />
          <InputItem
            name="price"
            id="grid-price"
            type="number"
            placeholder="¥"
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0">
          <LabelItem htmlFor="grid-period" title="利用日" />
          <InputItem name="period" id="grid-period" type="datetime-local" />
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <LabelItem htmlFor="grid-type" title="種別" />
          <div className="relative">
            <select
              name="type"
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-type"
            >
              <option></option>
              <option>固定費</option>
              <option>変動費</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ArrowIcon />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        >
          登録
        </button>
      </div>
    </Form>
  );
};

export default AccountForm;
