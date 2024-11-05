import Menuitems from './MenuItems';
import { useLocation } from 'react-router';
import { Box, List } from '@mui/material';
import { useNavigate } from 'react-router';
import NavItem from './NavItem';
import NavGroup from './NavGroup/NavGroup';
import { useUserContext } from '../../../context/UserContext'; // Import the context hook

const SidebarItems = () => {
  const { pathname } = useLocation();
  const { clearUser, user } = useUserContext(); // Access clearUser and user from context
  const navigate = useNavigate();

  const role = user?.role?.toLowerCase(); // Get the role from the context

  // Filter menu items based on the user's role
  const filteredMenuItems = Menuitems.filter(item => {
    // Handle subheaders
    if (item.navlabel) {
      // Always show "Home" subheader
      if (item.subheader === 'Home') return true;

      // Only show other subheaders if the user's role matches the allowed roles
      if (item.roles && item.roles.includes(role)) return true;

      return false; // Hide subheaders that are not relevant to the user's role
    }

    // Handle normal menu items
    if (item.roles && item.roles.includes(role)) {
      return true; // Show menu item if the role matches
    }

    return false; // Hide menu item if the role doesn't match
  });

  // Handle Logout Logic
  const handleLogout = () => {
    clearUser();
    navigate('/signin');
  };

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {filteredMenuItems.map((item) => {
          // {/******** SubHeader **********/}
          if (item.navlabel) {
            return <NavGroup item={item} key={item.subheader} />;

            // {/******** Normal Menu Item **********/}
          } else {
            if (item.action === 'logout') {
              return (
                <NavItem
                  key={item.id}
                  item={item}
                  pathDirect={pathname}
                  onClick={handleLogout} // Trigger handleLogout when "Logout" is clicked
                />
              );
            }
            return (
              <NavItem
                key={item.id}
                item={item}
                pathDirect={pathname}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};

export default SidebarItems;
