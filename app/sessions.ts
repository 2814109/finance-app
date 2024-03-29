import { createCookieSessionStorage } from "@remix-run/node";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      //firebase token
      name: "__session",

      // all of these are optional
      // expires: new Date(Date.now() + 600),
      httpOnly: true,
      maxAge: 36000,
      path: "/",
      sameSite: "lax",
      secrets: [`${process.env.SESSION_SECRET}`],
      secure: true,
    },
  });

export { getSession, commitSession, destroySession };
