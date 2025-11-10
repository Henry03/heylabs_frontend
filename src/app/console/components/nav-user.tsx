"use client"

import {
  LogOut,
  Moon,
  Sun,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { capitalizeFirstLetter, getUserAvatar } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
    balance: Number
  }
}) {
  const avatar = getUserAvatar(user.name);
  const router = useRouter();
  const { setTheme, theme } = useTheme()

  const logout = () => {
    Cookies.remove("token")
    router.push('/auth/login')
    toast.success('Logout successfully')
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className={`rounded-lg`} style={{backgroundColor: avatar.color}}>{avatar.initials}</AvatarFallback>
              </Avatar>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            // side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className={`rounded-lg`} style={{backgroundColor: avatar.color}}>{avatar.initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-3 py-2 text-sm flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Balance</span>
                <span className="font-medium">
                  Rp {user.balance.toLocaleString("id-ID")}
                </span>
              </div>
              {/* <Button size={"sm"} variant={"outline"} className="w-full">
                Top Up
              </Button> */}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <DropdownMenuItem className="w-full flex justify-between">
                  <span>{capitalizeFirstLetter(theme)} Theme</span>
                  <div>
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] top-2 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  </div>
                </DropdownMenuItem>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
