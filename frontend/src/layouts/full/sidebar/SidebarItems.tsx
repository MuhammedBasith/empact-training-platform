import React from 'react';
import Menuitems from './MenuItems';
import { useLocation } from 'react-router';
import { Box, List } from '@mui/material';
import { useNavigate } from 'react-router';
import NavItem from './NavItem';
import NavGroup from './NavGroup/NavGroup';
import { useUserContext } from '../../../context/UserContext'; // Import the context hook

const SidebarItems = () => {
  const { pathname } = useLocation();
  const { clearUser } = useUserContext(); // Access clearUser from context
  const pathDirect = pathname;
  const navigate = useNavigate()

  // Handle Logout Logic
  const handleLogout = () => {
    clearUser();
    navigate('/signin');
  };

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {Menuitems.map((item) => {
          // {/******** SubHeader **********/}
          if (item.subheader) {
            return <NavGroup item={item} key={item.subheader} />;

            // {/******** Normal Menu Item **********/}
          } else {
            if (item.action === 'logout') {
              return (
                <NavItem
                  key={item.id}
                  item={item}
                  pathDirect={pathDirect}
                  onClick={handleLogout} // Trigger handleLogout when "Logout" is clicked
                />
              );
            }
            return (
              <NavItem
                key={item.id}
                item={item}
                pathDirect={pathDirect}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};

export default SidebarItems;
