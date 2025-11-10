"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance, { setTriggerEndpoints } from "@/lib/axiosInstance";

interface User {
  email: string;
  name: string;
  balance: number;
  avatar: string
}

interface JwtPayload {
  role?: string;
  exp?: number;
}

export function SiteHeader({title}: {
  title: string
}) {
  const [user, setUser] = useState<User>({
    email: "",
    name: "",
    balance: 0,
    avatar: ""
  })
  const router = useRouter();

  const fetchProfile = () => {
    axiosInstance.get('/v1/profile')
      .then(response => {
        setUser(response.data.data)
      })
      .catch(error => {
        router.push('/auth/login')
      })
  }

  const loadEndpoints = async () => {
    try {
      const res = await axiosInstance.get("/v1/endpoint");
      const endpoints = res.data.data.map((e: any) => e.path);
      setTriggerEndpoints(endpoints);
      console.log("✅ Loaded trigger endpoints:", endpoints);
    } catch (err) {
      console.warn("⚠️ Failed to load trigger endpoints:", err);
    }
  };
  
  useEffect(() => {
    fetchProfile();
    loadEndpoints();
    const handleProfileRefresh = () => {
      console.log('🔄 Triggered profile refresh');
      fetchProfile();
    };

    globalThis.addEventListener('api:triggerRefreshProfile', handleProfileRefresh);

    return () => {
      globalThis.removeEventListener('api:triggerRefreshProfile', handleProfileRefresh);
    };
  }, []);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <NavUser user={user}/>
        </div>
      </div>
    </header>
  )
}
