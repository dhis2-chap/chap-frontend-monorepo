import React, { useRef, useState } from 'react';
import {
  Button,
  IconMore16,
  IconDelete16,
  FlyoutMenu,
  MenuItem,
  Popper,
  Layer
} from '@dhis2/ui';
import styles from './ActionMenu.module.css';

interface ActionMenuProps {
  onDelete?: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ onDelete }) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleDelete = () => {
    setIsOpen(false);
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div className={styles.actionMenuContainer}>
      <div ref={anchorRef}>
        <Button
          small
          icon={<IconMore16 />}
          onClick={toggleMenu}
        />
        {isOpen && (
          <Layer onBackdropClick={() => setIsOpen(false)}>
            <Popper
              placement="bottom-end"
              reference={anchorRef}
            >
              <FlyoutMenu>
                <MenuItem
                  label="Delete"
                  icon={<IconDelete16 />}
                  destructive
                  onClick={handleDelete}
                />
              </FlyoutMenu>
            </Popper>
          </Layer>
        )}
      </div>
    </div>
  );
};

export default ActionMenu;
