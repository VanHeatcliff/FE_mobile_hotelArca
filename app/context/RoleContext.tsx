import React, { createContext, useState, useContext, ReactNode } from 'react';
import { setToken } from '../services/api';

type Role = 'customer' | 'staff' | 'owner' | null;

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface RoleContextType {
  role: Role;
  user: UserData | null;
  token: string | null;
  setRole: (role: Role) => void;
  setAuth: (token: string, user: UserData) => void;
  toggleRole: () => void;
  logout: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<Role>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [tokenState, setTokenState] = useState<string | null>(null);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
  };

  const setAuth = (newToken: string, userData: UserData) => {
    setTokenState(newToken);
    setToken(newToken);
    setUser(userData);
    setRoleState(userData.role as Role);
  };

  const toggleRole = () => {
    setRoleState((prevRole) => {
      if (prevRole === 'customer') return 'staff';
      if (prevRole === 'staff') return 'owner';
      return 'customer';
    });
  };

  const logout = () => {
    setRoleState(null);
    setUser(null);
    setTokenState(null);
    setToken(null);
  };

  return (
    <RoleContext.Provider value={{ role, user, token: tokenState, setRole, setAuth, toggleRole, logout }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
