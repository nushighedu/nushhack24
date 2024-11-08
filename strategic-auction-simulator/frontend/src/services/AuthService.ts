
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth';
import firebaseApp from '../config/firebaseConfig';

class AuthService {
    private auth = getAuth(firebaseApp);

    async register(email: string, password: string, username: string) {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                this.auth,
                email,
                password
            );

            // Optional: Update profile with username
            if (userCredential.user) {
                await this.updateUserProfile(userCredential.user, {displayName: username});
            }

            return userCredential.user;
        } catch (error: any) {
            console.error('Registration Error', error);
            throw new Error(error.message);
        }
    }

    async login(email: string, password: string) {
        try {
            const userCredential = await signInWithEmailAndPassword(
                this.auth,
                email,
                password
            );

            // Get ID token for backend authentication
            const idToken = await userCredential.user.getIdToken();
            localStorage.setItem('authToken', idToken);

            return userCredential.user;
        } catch (error: any) {
            console.error('Login Error', error);
            throw new Error(error.message);
        }
    }

    async logout() {
        try {
            await signOut(this.auth);
            localStorage.removeItem('authToken');
        } catch (error: any) {
            console.error('Logout Error', error);
            throw new Error(error.message);
        }
    }

    private async updateUserProfile(user: User, profile: { displayName?: string }) {
        try {
            // Firebase method to update user profile
            // await updateProfile(user, profile);
        } catch (error) {
            console.error('Profile Update Error', error);
        }
    }

    getCurrentUser(): User | null {
        return this.auth.currentUser;
    }

    async getIdToken(): Promise<string | null> {
        try {
            const currentUser = this.auth.currentUser;
            return currentUser ? await currentUser.getIdToken() : null;
        } catch (error) {
            console.error('Get ID Token Error', error);
            return null;
        }
    }

    // Add listener for auth state changes
    onAuthStateChanged(callback: (user: User | null) => void) {
        return this.auth.onAuthStateChanged(callback);
    }

};

const authService = new AuthService();
export default authService;