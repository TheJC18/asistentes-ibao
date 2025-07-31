import { useState } from "react";

export function useUserModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("view");
  const [user, setUser] = useState({});

  const handleOpen = (mode, userData = {}) => {
    setMode(mode);
    setUser(userData);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (field, value) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };

  return {
    open,
    mode,
    user: { ...user, onChange: handleChange },
    handleOpen,
    handleClose,
    setUser,
  };
}
