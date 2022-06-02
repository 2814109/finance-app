import { FC, ChangeEvent } from "react";
import { Form } from "@remix-run/react";
import InputItem from "~/components/Items/Form/InputItem";
const Login: FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-100 flex-auto">
        <div className="flex justify-center mt-20">
          <div className="w-9/12 border bg-white">
            <div className="my-16 text-center">
              <h2 className="text-4xl font-bold">ログイン</h2>
              <Form action="/form/login" method="post" className="mt-12">
                <div className="mb-3">
                  <InputItem
                    className="text-xl w-7/12 p-3 border rounded"
                    required
                    value=""
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {}}
                    type="email"
                    placeholder="sample@example.com"
                    name="email"
                  />
                </div>
                <div className="mb-5">
                  <InputItem
                    required
                    value=""
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {}}
                    type="password"
                    placeholder="パスワード"
                    name="password"
                    className="text-xl w-7/12 p-3 border rounded"
                  />
                </div>
                <button
                  type="submit"
                  className="mb-3 text-xl w-4/12 bg-blue-800 text-white py-2 rounded hover:opacity-75"
                >
                  ログイン
                </button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
