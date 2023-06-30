import { User } from 'firebase/auth';
import { auth } from '../firebase/firebase-config';

export function getCurrentUser(): User | null {
  return auth.currentUser;
}
