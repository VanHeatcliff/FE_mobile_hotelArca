import React, { createContext, useState, useContext, ReactNode } from 'react';

type Role = 'customer' | 'staff';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  toggleRole: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  // Set default to 'staff' initially for easier testing of the new UI
  const [role, setRole] = useState<Role>('staff');

  const toggleRole = () => {
    setRole((prevRole) => (prevRole === 'customer' ? 'staff' : 'customer'));
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
