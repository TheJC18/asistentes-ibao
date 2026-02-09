import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useAppDispatch, useAppSelector } from "./index";
import { FirebaseAuth } from "@/firebase/config";
import { checkOrCreateUser, getUserByUID } from "@/modules/auth/firebase/authQueries";
import { ROLES } from "@/core/constants/roles";
import {
  chekingCredentials,
  login,
  logout,
  setProfileCompleted,
  setRole,
} from "@/modules/auth/store/authSlice";

export const useCheckAuth = () => {
  const dispatch = useAppDispatch();
  const { status, uid } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(chekingCredentials());

    const unsubscribe = onAuthStateChanged(FirebaseAuth, async (firebaseUser) => {
      if (!firebaseUser) {
        dispatch(logout(undefined));
        return;
      }

      try {
        await checkOrCreateUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || "",
          photoURL: firebaseUser.photoURL || "/user_default.png",
          email: firebaseUser.email || "",
        });

        const userDataResult = await getUserByUID({ uid: firebaseUser.uid });

        if (userDataResult.ok && userDataResult.user) {
          const userData = userDataResult.user;

          dispatch(
            login({
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: firebaseUser.displayName || "",
              photoURL: firebaseUser.photoURL || "/user_default.png",
              birthdate: userData.birthdate || null,
              nationality: userData.nationality || null,
              isMember: userData.isMember || false,
              profileCompleted: userData.profileCompleted || false,
            })
          );

          dispatch(setRole({ role: userData.role || ROLES.USER }));
        } else {
          dispatch(
            login({
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: firebaseUser.displayName || "",
              photoURL: firebaseUser.photoURL || "/user_default.png",
            })
          );

          dispatch(setRole({ role: ROLES.USER }));
          dispatch(setProfileCompleted({ profileCompleted: false }));
        }
      } catch (error) {
        console.error("Auth state error:", error);
        dispatch(logout({ errorMessage: "Error verificando sesion" }));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return { status, uid };
};