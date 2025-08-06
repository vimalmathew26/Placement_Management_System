'use client';
import {
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  Link, 
  Button
} from "@heroui/react";
import React from 'react';
import { FaHandshake, FaHome, FaPowerOff } from "react-icons/fa";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useRoleBasedNavigation } from '@/app/hooks/useRoleBasedNavigation';

const NavBar = () => {
    const router = useRouter();
    const { navigateToHome } = useRoleBasedNavigation();

    const handleLogout = () => {
        Cookies.remove('access_token', { path: '/' });
        router.push('/');
    };

    return (
        <Navbar maxWidth="full" className="fixed shadow-lg bg-secondary shadow-lg">
          <NavbarBrand className="gap-2">
            <FaHandshake size={30} color="white" />
            <p className="font-bold text-white text-3xl text-shadow-md gap-2">PMS</p>
          </NavbarBrand>
          <NavbarContent className="flex gap-4" justify="center">
            <NavbarItem>
              <Button
                className="text-white flex items-center gap-2" 
                variant="light"
                onPress={navigateToHome}
              >
                <FaHome />
                Home
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button 
                className="text-white" 
                variant="light"
                onPress={handleLogout}
              >
                <FaPowerOff />
                Logout
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Link className="text-white" href="/about">
                About
              </Link>
            </NavbarItem>
          </NavbarContent>
        </Navbar>
    );
};

export default NavBar;

