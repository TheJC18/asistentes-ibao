import { useState } from "react";
import { User, UseUserModalReturn } from "@/types";

export function useUserModal(): UseUserModalReturn {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'view' | 'edit' | 'create' | 'family'>('view');
  const [user, setUser] = useState<Partial<User>>({});

  const handleOpen = (mode: 'view' | 'edit' | 'create' | 'family', userData: Partial<User> = {}) => {
    setMode(mode);
    setUser(userData);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (field: string, value: any) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };

  return {
    open,
    mode,
    user: { ...user, onChange: handleChange } as User & { onChange: (field: string, value: any) => void },
    handleOpen,
    handleClose,
    setUser,
  };
}
