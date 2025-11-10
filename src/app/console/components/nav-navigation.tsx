"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { SidebarSection } from "../layout.interface"
import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import Cookies from 'js-cookie';

interface JwtPayload {
  role: string
}

export function NavNavigation({
  title,
  items,
}: {
  title: string,
  items: SidebarSection[]
}) {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null)

  const filteredItems = items
    .map(item => {
      const filteredSubItems = item.items?.filter(sub => sub.roles?.includes(role ?? "")) ?? []
      const canShow = item.roles?.includes(role ?? "") || filteredSubItems.length > 0

      return canShow ? { ...item, items: filteredSubItems } : null
    })
    .filter(Boolean) as SidebarSection[]

  useEffect(() => {
    const token = Cookies.get('token');

    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token)
        setRole(decoded.role)
      } catch (err) {
        console.error("Invalid JWT:", err)
      }
    }
  }, [])

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {filteredItems.map((item) => (
          <Collapsible key={item.url} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton isActive={pathname == item.url} className="flex w-full items-center justify-between px-2 py-0.5 rounded-md hover:bg-muted group transition">
                  {
                    item.items?.length ? (
                      <>
                        <SidebarMenuButton>
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </SidebarMenuButton>
                        <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                      </>
                    ) :
                    <SidebarMenuButton>
                      <Link href={item.url ?? "#"} className="flex items-center gap-2 w-full">
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  }
                </SidebarMenuButton>
              </CollapsibleTrigger>
              {
                item.items?.length ? (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild isActive={pathname == subItem.url}>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                ) : null
              }
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
