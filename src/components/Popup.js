import React from "react";

const Popup = ({ feature }) => {
  const { name, size, edible } = feature.properties;

  return (
    <React.Fragment>
      <div>
        <h3>{name}</h3>
        <p>{size}</p>
        <p>Is Edible: {edible}</p>
      </div>
    </React.Fragment>
  )
}

export default Popup;