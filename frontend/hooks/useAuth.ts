import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  balance: number;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleStorage = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          setUser({
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role,
            balance: decoded.balance || 0,
          });
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    // Initial load
    handleStorage();
    // Listen to storage changes (multi-tab support)
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Ajout d'une fonction pour rafraîchir l'utilisateur (ex: après une partie)
  const refreshUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({
          id: decoded.id,
          username: decoded.username,
          email: decoded.email,
          role: decoded.role,
          balance: decoded.balance || 0,
        });
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };
  return { user, logout, refreshUser };
} 