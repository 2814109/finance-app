const errorMessage = (code: string): string => {
  switch (code) {
    case "auth/invalid-email":
      return "メールアドレスの形式が不正です";
    case "auth/user-disabled":
      return "ユーザが無効になっています";
    case "auth/user-not-found":
      return "ユーザが存在しません";
    case "auth/wrong-password":
      return "パスワードが間違っています";
    case "auth/too-many-requests":
      return "一定の回数以上パスワードの入力を間違えました";
    default:
      return `予期しないエラーです:${code}`;
  }
};

export default errorMessage;
