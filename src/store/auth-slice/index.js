import { axiosInstance } from "@/lib/axios.js";
import toast from "react-hot-toast";
import { create } from "zustand";
import { auth } from "@/lib/firebase"; // Firebase setup
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";


// Create a Zustand store for auth state management
export const useAuthStore = create((set) => ({

  isAuthenticated: false,
  authUser: null,
  isSigningUp: false,
  isLogginIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: false,
  idToken:null,
  role:null,
  set: (data) => set({ ...data }),
  // Regular signup with email and password
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const token = await userCredential.user.getIdToken();

      set({idToken:token});
     
      const response = await axiosInstance.post(
        "/auth/signup",
        {
          uid: userCredential.user.uid,
          displayName:data.displayName ||userCredential.user.displayName,
          email: data.email,
          photoURL: userCredential.user.photoURL || data.photoURL || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
       if(response.data.user){
        set({
          authUser: response.data.user,
          role:response.data.user.role,
          isAuthenticated: true,
        });
       }
      toast.success("Account Created successfully");
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Regular login with email and password
  login: async (data) => {
    set({ isLogginIn: true });
    try {
      
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userCredential.user;
      const token = await userCredential.user.getIdToken();
      const response = await axiosInstance.post(
        "/auth/login",
        { uid: user.uid },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({idToken:token});
      set({
        authUser: response.data,
        isAuthenticated: true,
        role: response.data.role,
      });
      

      return true;
    } catch (error) {
      toast.error("Login failed! Check the credentials");
      return false;
    } finally {
      set({ isLogginIn: false });
    }
  },

  // Google login
  googleLogin: async () => {
    set({ isLogginIn: true });
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Get Firebase ID Token
      const token = await user.getIdToken();
      
      const res = await axiosInstance.post("/auth/login", { uid:user.uid },
        {
          headers: { Authorization: `Bearer ${token}` },
        });

      set({
        authUser: res.data,
        
        isAuthenticated: true,
      });
      toast.success("Login successful with Google");
      
      return true;
    } catch(error) {
      toast.error("Google Login failed:User not signed up",error);
      return false;
    } finally {
      set({ isLogginIn: false });
    }
  },

  // Google signup
  googleSignup: async () => {
    set({ isSigningUp: true });
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();
      
      // Send user details to the backend
      const res = await axiosInstance.post("/auth/signup", {
        uid:user.uid,
        displayName: user.displayName,
        email:user.email,
        photoURL: user.photoURL,
      },{
        headers: { Authorization: `Bearer ${token}` },
      });
      /* uid: user.uid,
        email: user.email,
        fullName: user.displayName,
        profilePic: user.photoURL, */
        console.log(res.data);
      set({
        authUser: res.data,
        
        isAuthenticated: true,
      });
      toast.success("Account Created successfully with Google");
      return true;
    } catch (error) {
      toast.error(error.message || "Google Signup failed");
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },
  setRole: async(data)=>{
    try {
      const { uid, role } = data; 
      const user = auth?.currentUser;
      const token = await user.getIdToken();
      const response = await axiosInstance.post('/auth/assign-role',{uid, role},{
        headers: {
          Authorization: `Bearer ${token}`,  // The idToken from signup
        },
      })
      return response;
    } catch (error) {
      throw new Error('Error assigning role',error);
    }
  },
   checkAuth: async () => {
    try {
      console.log("im reached checkauth in store");
      const user = await auth.currentUser
      if (user) {
        
        const token = await user.getIdToken();
        const res = await axiosInstance.get("/auth/check",{
          headers: {
            Authorization: `Bearer ${token}`,  // The idToken from signup
          },});
        set({ authUser: res.data, isAuthenticated: true });
        console.log("auth check successful in store")
        console.log(res);
      }
      console.log(auth.currentUser);
    } catch (error) {
      console.log("Erro in check auth,", error.response.data.message);
      set({ authUser: null, isAuthenticated: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Logout
  logout: async () => {
    try {
      await signOut(auth); // Firebase logout
      set({ authUser: null, isAuthenticated: false });
      toast.success("Logout successful");
    } catch (error) {
      toast.error(error.message || "Logout failed");  
    }
  },
}));
