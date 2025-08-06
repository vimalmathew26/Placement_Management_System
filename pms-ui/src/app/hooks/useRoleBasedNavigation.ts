import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

type UserRole = 'student' | 'faculty' | 'admin' | 'alumni';

interface TokenPayload {
  role: UserRole;
}

const ROLE_ROUTES = {
  student: '/students/dashboard',
  faculty: '/faculty/dashboard',
  admin: '/faculty/dashboard',
  alumni: '/alumni/dashboard'
};

export const useRoleBasedNavigation = () => {
  const router = useRouter();

  const navigateToHome = useCallback(() => {
    const token = Cookies.get('access_token');
    if (!token) {
      router.push('/');
      return;
    }

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const route = ROLE_ROUTES[decoded.role] || '/';
      router.push(route);
    } catch {
      router.push('/');
    }
  }, [router]);

  return { navigateToHome };
};