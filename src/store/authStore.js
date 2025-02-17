import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      token: localStorage.getItem('access_token'),
      adminId: null,
      setToken: (token) => {
        localStorage.setItem('access_token', token);
        set({ token });
      },
      logout: () => {
        localStorage.removeItem('access_token');
        set({ token: null, adminId: null });
      },
      addAdminId: (id) => set({ adminId: id }),
      isTokenValid: () => {
        const token = localStorage.getItem('access_token');
        if (!token) return false;
        
        try {
          const tokenParts = token.split('.');
          const payload = JSON.parse(atob(tokenParts[1]));
          const expirationTime = payload.exp * 1000; // Converter para milissegundos
          
          return Date.now() < expirationTime;
        } catch (error) {
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;