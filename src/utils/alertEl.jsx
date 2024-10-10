import React from "react";

// eslint-disable-next-line react/prop-types
const AlertEl = ({ children }) => (
  <div
    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
    role="alert"
  >
    {children}
  </div>
);

export default AlertEl;
