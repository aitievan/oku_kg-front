"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function ProfileLayout({ children }) {
  const { push } = useRouter();
  const token = Cookies.get("token");
  const role = Cookies.get("role");

  useEffect(() => {
    console.log(token)
    if (!token && !role) {
      console.log('no token: ', token)
      push("/login");
    }
  }, [token, role]);
  return <div>{children}</div>;
}
