// Web build only (Metro picks this over datePicker.js). The community date picker
// has no browser implementation, so the browser's own date input stands in.
// It reports back through the same onChange({ type: "set" }, date) signature
// the Add screen already listens for.
import React from "react";

const toInputValue = (date) => {
  if (!(date instanceof Date) || isNaN(date)) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export default function DateTimePicker({ value, onChange }) {
  return React.createElement("input", {
    type: "date",
    defaultValue: toInputValue(value),
    autoFocus: true,
    "aria-label": "Date you visited the attraction",
    style: {
      marginLeft: 30,
      marginTop: 12,
      padding: 10,
      fontSize: 15,
      width: 300,
      boxSizing: "border-box",
      borderRadius: 4,
      border: "1px solid grey",
      background: "white",
      fontFamily: "inherit",
    },
    onChange: (event) => {
      const v = event.target.value;
      if (!v || !onChange) return;
      const [y, m, d] = v.split("-").map(Number);
      onChange({ type: "set" }, new Date(y, m - 1, d));
    },
  });
}
