import { FC } from "react";
import { Form } from "@remix-run/react";
import HeaderIconState from "~/state/HeaderIcon";
import { useRecoilValue } from "recoil";
const Header: FC = () => {
  const headerIconUrl = useRecoilValue(HeaderIconState);
  return (
    <div className="bg-black">
      <div className="flex justify-between  mx-5">
        <div className="flex">
          <img className="h-20 object-cover mr-5" src={headerIconUrl} />
          <ul className="flex items-center">
            <li className="mr-6">
              <a className="text-blue-500 hover:text-blue-800" href="#">
                Active
              </a>
            </li>
            <li className="mr-6">
              <a className="text-blue-500 hover:text-blue-800" href="#">
                Link
              </a>
            </li>
          </ul>
        </div>
        <div className="flex items-center">
          <Form method="post" action="/logout">
            <button
              type="submit"
              className="rounded bg-red-500 px-3 py-2 text-white hover:bg-red-300 active:bg-red-500"
            >
              Logout
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Header;
