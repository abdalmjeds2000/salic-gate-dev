import React from 'react';

function HeaderButton({ title, icon, onClick }) {

  return (
    <div className='header-item' onClick={onClick}>
      {icon}
      <span>{title}</span>
    </div>
  )
}

export default HeaderButton