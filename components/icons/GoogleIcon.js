import React from 'react';

export const GoogleIcon = ({children, ...props}) => {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M15.0039 3C8.37491 3 3 8.373 3 15C3 21.627 8.37491 27 15.0039 27C25.0139 27 27.2691 17.707 26.3301 13H25H22.7324H15V17H22.7383C21.8487 20.4483 18.726 23 15 23C10.582 23 7 19.418 7 15C7 10.582 10.582 7 15 7C17.009 7 18.8391 7.74575 20.2441 8.96875L23.0859 6.12891C20.9519 4.18491 18.1169 3 15.0039 3Z"
        fill="#FF4D4F"
      />
    </svg>
  );
};
