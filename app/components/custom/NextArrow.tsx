import React from 'react';

function NextArrow(props: any) {
  const {className, style, onClick} = props;
  return (
    <div
      className={className}
      style={{...style, display: "block", background: "grey", marginRight: '25px', borderRadius: '50%'}}
      onClick={onClick}
    />
  );
}

export default NextArrow;
