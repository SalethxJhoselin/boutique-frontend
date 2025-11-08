import React, { useState } from 'react';
import { Layout, Menu, Avatar, Button } from 'antd';
import { DownOutlined, RightOutlined, LogoutOutlined } from '@ant-design/icons';
import { NavLink, useNavigate } from 'react-router-dom';
import SidebarLinks from './SidebarLinks';
import { useAuth } from '../../hooks/useAuth';

const { Sider } = Layout;

const Sidebar = () => { 
  const [openKeys, setOpenKeys] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const linksArray = SidebarLinks();

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find(key => !openKeys.includes(key));
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sider
      width={256}
      className={`bg-pink border-r rounded-3xl shadow-lg mt-16`}
      collapsedWidth={80}
      collapsible
      trigger={null}
    >
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col items-center justify-center space-y-2 mt-8 border-b pb-4">
          <Avatar size={48} src={null}>
            {user?.nombre?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <h2 className="text-blue text-sm font-bold text-center">{user?.nombre || 'Usuario'}</h2>
          <p className="text-xs text-gray-500">{user?.rol || 'Cliente'}</p>
        </div>
        <Menu
          mode="inline"
      className={`bg-pink`}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
        >
          {linksArray.map(({ icon, label, to, subMenu }) => (
            subMenu ? (
              <Menu.SubMenu
                key={label}
                icon={icon}
                title={label}
                expandIcon={({ isOpen }) => isOpen ? <DownOutlined /> : <RightOutlined />}
              >
                {subMenu.map(({ label, to }) => (
                  <Menu.Item key={to}>
                    <NavLink to={to}>{label}</NavLink>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            ) : (
              <Menu.Item key={to} icon={icon}>
                <NavLink to={to}>{label}</NavLink>
              </Menu.Item>
            )
          ))}
        </Menu>
        <div className="border-t p-4">
          <Button 
            type="primary" 
            danger 
            block 
            onClick={handleLogout}
            icon={<LogoutOutlined />}
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;
