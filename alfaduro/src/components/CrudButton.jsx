import React from 'react';

const CrudButton = ({ label, onClick, color = 'gray' }) => {
  const colorMap = {
    gray: 'bg-gray-200 hover:bg-gray-300 text-black',
    blue: 'bg-blue-500 hover:bg-blue-600 text-white',
    red: 'bg-red-500 hover:bg-red-600 text-white',
    green: 'bg-green-500 hover:bg-green-600 text-white',
  };

  return (
    <button
      onClick={onClick}
      className={`${colorMap[color]} px-3 py-1 rounded mr-2 transition`}
    >
      {label}
    </button>
  );
};

export default CrudButton;
