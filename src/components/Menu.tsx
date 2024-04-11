import React from 'react';

interface MenuProps {
  onSelectColor: (color: string) => void;
}

const Menu: React.FC<MenuProps> = ({ onSelectColor }) => {
  const colors = ['red', 'blue', 'green', 'yellow'];

  return (
    <div>
      {colors.map((color) => (
        <button key={color} onClick={() => onSelectColor(color)}>
          {color}
        </button>
      ))}
    </div>
  );
};

export default Menu;