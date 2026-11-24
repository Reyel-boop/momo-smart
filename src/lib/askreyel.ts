/** AskReyel (the School Hub): one account for Momo, Tuon, Aral Reading and Aral Math. */
export const ASKREYEL_URL =
  process.env.ASKREYEL_URL ?? "https://school-hub-ten-orcin.vercel.app";
/** Opens Momo through AskReyel (AskReyel asks them to sign in first if needed). */
export const ASKREYEL_SIGN_IN = `${ASKREYEL_URL}/api/sso?to=momo`;
