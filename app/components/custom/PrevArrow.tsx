import React from 'react';

function PrevArrow(props: any) {
  const {className, style, onClick} = props;
  return (
    <div
      className={className}
      style={{...style, display: "block", background: "grey", borderRadius: '50%'}}
      onClick={onClick}
    />
  );
}

export default PrevArrow;
