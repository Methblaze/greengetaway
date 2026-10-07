// Dates are shown in British format: "Wednesday 7 October 2026".
const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const formatDate = (date) =>
  date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export const formatShortDate = (date) => date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export const formatVisitDate = (date) => (sameDay(date, new Date()) ? `Today, ${formatShortDate(date)}` : formatDate(date));

// yyyy-mm-dd in local time, for the browser's date input.
export const toInputValue = (date) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const fromInputValue = (value) => {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
};
