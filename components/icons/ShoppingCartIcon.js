import React from 'react';

export const ShoppingCartIcon = ({children, ...props}) => {
  return (
    <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M39.525 13.125C39.201 12.5636 38.7371 12.0958 38.1784 11.7672C37.6198 11.4386 36.9855 11.2604 36.3375 11.25H12.3375L11.25 7.01247C11.1401 6.60341 10.895 6.24361 10.5545 5.99166C10.214 5.73972 9.7983 5.61047 9.375 5.62497H5.625C5.12772 5.62497 4.65081 5.82251 4.29917 6.17414C3.94754 6.52577 3.75 7.00269 3.75 7.49997C3.75 7.99725 3.94754 8.47416 4.29917 8.82579C4.65081 9.17742 5.12772 9.37497 5.625 9.37497H7.95L13.125 28.6125C13.2349 29.0215 13.48 29.3813 13.8205 29.6333C14.1609 29.8852 14.5767 30.0145 15 30H31.875C32.2213 29.9989 32.5604 29.902 32.855 29.72C33.1495 29.538 33.3879 29.2779 33.5437 28.9687L39.6937 16.6687C39.9603 16.11 40.0844 15.494 40.055 14.8756C40.0255 14.2573 39.8434 13.6558 39.525 13.125ZM30.7125 26.25H16.425L13.3687 15H36.3375L30.7125 26.25Z"
        fill="#FF4B45"
      />
      <path
        d="M14.0625 39.375C15.6158 39.375 16.875 38.1158 16.875 36.5625C16.875 35.0092 15.6158 33.75 14.0625 33.75C12.5092 33.75 11.25 35.0092 11.25 36.5625C11.25 38.1158 12.5092 39.375 14.0625 39.375Z"
        fill="#FF4B45"
      />
      <path
        d="M32.8125 39.375C34.3658 39.375 35.625 38.1158 35.625 36.5625C35.625 35.0092 34.3658 33.75 32.8125 33.75C31.2592 33.75 30 35.0092 30 36.5625C30 38.1158 31.2592 39.375 32.8125 39.375Z"
        fill="#FF4B45"
      />
    </svg>
  );
};