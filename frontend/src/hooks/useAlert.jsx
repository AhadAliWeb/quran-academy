import { useState } from "react";

export const useAlert = () => {
    const [alert, setAlert] = useState(null);
  
    const showAlert = (message, theme = 'info', duration = 5000) => {
      setAlert({ message, theme, duration, id: Date.now() });
    };
  
    const clearAlert = () => setAlert(null);
  
    return { alert, showAlert, clearAlert };
  };