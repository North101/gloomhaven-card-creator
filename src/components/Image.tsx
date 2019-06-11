import React from 'react';

export const Image: React.FC<any> = (props) => {
  const { src, children, alt, ...attrs } = props;
  return <img src={window.location.origin + src} alt={alt} {...attrs}>{props.children}</img>
}