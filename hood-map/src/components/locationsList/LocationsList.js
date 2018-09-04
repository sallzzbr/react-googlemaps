import React, { Component } from 'react';

const LocationsList=(props)=> {

  return (
    <ul className="list-group">
    {
      props.items.map(function(item, index) {
        return <li
                className="list-group-item"
                key={index}
                onClick={()=>props.onItemClick(item)}
                >
                {item.title}
                </li>
      })
     }
    </ul>
  )
}

export default LocationsList;
