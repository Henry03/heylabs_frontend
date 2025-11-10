"use client"

import * as React from "react"
import {
  IconDotsVertical,
  IconInnerShadowTop,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react"

import { NavNavigation } from "@/app/console/components/nav-navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { ChartArea, Grid2X2, HomeIcon, Info, KeyRound, Mail, Moon, ScanText, Sun } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { capitalizeFirstLetter } from "@/lib/utils"
import Link from "next/link"
import { SidebarData } from "../layout.interface"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  data: SidebarData
}

export function AppSidebar({ data, ...props }: AppSidebarProps) {

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/" className="flex items-center">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-xl font-semibold">HeyaLabs</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator/>
      <SidebarContent className="gap-0">
        <NavNavigation title="Service" items={data.services} />
        <NavNavigation title="Manage" items={data.manages} />
      </SidebarContent>
      {/* <SidebarFooter>
        <SidebarMenu className="gap-3">
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full flex justify-between">
                  <span>{capitalizeFirstLetter(theme)} Theme</span>
                  <div>
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] top-2 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  </div>
                </Button>
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
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Button className="w-full">
              <Link href={'/auth/login'}>
                Login
              </Link>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter> */}
    </Sidebar>
  )
}
