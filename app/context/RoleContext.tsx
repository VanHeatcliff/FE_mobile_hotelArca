import React, { createContext, useState, useContext, ReactNode } from 'react';

type Role = 'customer' | 'staff' | 'owner' | null;

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  toggleRole: () => void;
  logout: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>(null);

  const toggleRole = () => {
    setRole((prevRole) => {
      if (prevRole === 'customer') return 'staff';
      if (prevRole === 'staff') return 'owner';
      return 'customer';
    });
  };

  const logout = () => setRole(null);

  return (
    <RoleContext.Provider value={{ role, setRole, toggleRole, logout }}>
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
