"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/users/userSlice";

export default function SessionSync() {
  const { data: session } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (session?.user) {
      dispatch(
        setUser({
          id: session.user.id,
          name: session.user.name || undefined,
          email: session.user.email || undefined,
          role: session.user.role,
          permissions: session.user.permissions,
        })
      );
    } else if (session === null) {
      dispatch(setUser(null));
    }
  }, [session, dispatch]);

  return null;
}
