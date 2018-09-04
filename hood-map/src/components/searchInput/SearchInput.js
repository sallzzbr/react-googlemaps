import React, { Component } from 'react';

const SearchInput=(props)=> {

  return (
    <form>
      <fieldset className="form-group">
        <input type="text"
        className="form-control form-control-lg"
        placeholder="Search"
        onChange={props.onChange}
        value={props.value}
        />
      </fieldset>
    </form>
  )
}

export default SearchInput;
