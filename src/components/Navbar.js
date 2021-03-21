import React from 'react';
import { FaBars, FaOpencart } from 'react-icons/fa';

const Navbar = ({lists, toggleLists}) => {
    return <nav>
      <div className='nav-header'>
        <div className='logo-container'>
          <FaOpencart className='logo-icon' />
        </div>
        {
          lists.length > 0 && (
            <button className='nav-toggle' onClick={toggleLists}>
              <FaBars />
            </button>
          )
        }
      </div>
    </nav>
};

export default Navbar;