import React from 'react';

export const FacebookIcon = ({children, ...props}) => {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M20 0H2C0.895 0 0 0.895 0 2V20C0 21.105 0.895 22 2 22H12V13H9V10H12V8.389C12 5.339 13.486 4 16.021 4C17.235 4 17.877 4.09 18.181 4.131V7H16.452C15.376 7 15 7.568 15 8.718V10H18.154L17.726 13H15V22H20C21.105 22 22 21.105 22 20V2C22 0.895 21.104 0 20 0Z"
        fill="#1890FF"
      />
    </svg>
  );
};
