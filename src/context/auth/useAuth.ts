
import { useContext } from 'react';
import AuthContext from './AuthContext';

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
