import React from 'react';

export const StatNumber = (props) => {
  return (
    <div>
        <h3>{props.number}</h3>
        <span className="individTitleForStats">{props.name}</span>
    </div>
  );
};

export const StatNumberPercent = (props) => {
    return (
      <div>
          <h4>{props.number}%</h4>
          <span className="individTitleForStats">{props.name}</span>
      </div>
    );
  };
