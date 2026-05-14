import React, { createContext, useState, useContext, ReactNode } from 'react';

type Role = 'customer' | 'staff' | 'owner';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  toggleRole: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  // Set default to 'owner' initially for easier testing of the new UI
  const [role, setRole] = useState<Role>('owner');

  const toggleRole = () => {
    setRole((prevRole) => {
      if (prevRole === 'customer') return 'staff';
      if (prevRole === 'staff') return 'owner';
      return 'customer';
    });
  };

  return (
    <RoleContext.Provider value={{ role, setRole, toggleRole }}>
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
