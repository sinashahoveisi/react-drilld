import {FC} from 'react';

const Back: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height={20}
    width={20}
    className="spinner"
    viewBox="0 0 50 50"
    fill="currentColor"
    color="#000">
    <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
  </svg>
);

export default Back;
