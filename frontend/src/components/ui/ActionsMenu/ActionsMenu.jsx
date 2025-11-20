import React, { useState, useEffect, useRef } from 'react';
import './ActionsMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const ActionsMenu = ({ onModify, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const menuRef = useRef(null);

  const handleToggle = () => {
    if (!isOpen) {
      const rect = menuRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 120) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="actions-menu-container" ref={menuRef}>
      <button className="icon-button-table" onClick={handleToggle}>
        <FontAwesomeIcon icon={faEllipsisH} />
      </button>
      {isOpen && (
        <div className={`actions-menu ${openUpward ? 'upward' : ''}`}>
          <ul>
            <li>
              <button onClick={onModify}>
                <FontAwesomeIcon icon={faEdit} />
                Modificar
              </button>
            </li>
            <li>
              <button className="delete" onClick={onDelete}>
                <FontAwesomeIcon icon={faTrash} />
                Eliminar
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActionsMenu;
