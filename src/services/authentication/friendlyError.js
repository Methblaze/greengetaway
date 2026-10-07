// The 2023 screens stored errors such as "FirebaseError: Firebase: Error
// (auth/invalid-email)." and never showed them. These say what happened and
// what to do next, without blaming the person typing.
const MESSAGES = {
  "auth/invalid-email": "That email address looks incomplete. Check it has an @ and a domain, like name@example.com.",
  "auth/missing-email": "Add your email address to continue.",
  "auth/missing-password": "Add your password to continue.",
  "auth/invalid-credential": "We couldn't log you in with that email and password. Check both and try again, or create an account.",
  "auth/wrong-password": "We couldn't log you in with that email and password. Check both and try again, or create an account.",
  "auth/user-not-found": "We couldn't log you in with that email and password. Check both and try again, or create an account.",
  "auth/email-already-in-use": "There's already an account with that email. Log in instead.",
  "auth/weak-password": "Choose a password with at least 6 characters.",
  "auth/too-many-requests": "Too many attempts in a row. Wait a few minutes, then try again.",
  "auth/network-request-failed": "The app can't reach the internet right now. Check your connection and try again.",
};

export const friendlyAuthError = (error) => {
  if (!error) return null;
  const text = String(error);
  if (/do not match/i.test(text)) return "The two passwords are different. Type the same password in both fields.";
  const code = (text.match(/auth\/[a-z-]+/) || [])[0];
  return MESSAGES[code] || "Something went wrong on our side. Try again in a moment.";
};
