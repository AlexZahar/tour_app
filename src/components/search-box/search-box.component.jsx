import React from "react";
import "./search-box.style.scss";

export const SearchBox = ({ placeholder, handleSearch }) => (
  <input
    className="search"
    type="search"
    placeholder="Search tour"
    onChange={handleSearch}
  />
);
