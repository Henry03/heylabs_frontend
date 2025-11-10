"use client"

import { SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "./components/site-header";
import { SidebarData } from "./layout.interface";
import { ChartArea, KeyRound, ScanText, User } from "lucide-react";
import { AppSidebar } from "./components/app-sidebar";
import { usePathname } from "next/navigation";

function usePageTitle(data: SidebarData) {
    const pathname = usePathname();

    const allItems = [
        ...data.manages.map(item => ({
        title: item.name,
        url: item.url
        })),
        ...data.services.flatMap(service =>
        service.items?.map(item => ({
            title: item.title,
            url: item.url
        })) ?? []
        ),
    ];

    const found = allItems.find(item => item.url === pathname);

    return found?.title ?? "Untitled";
}

export default function ClientPage ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const data: SidebarData = {
        services: [
            {
                name: "OCR",
                url: "",
                icon: ScanText,
                isActive: true,
                items: [
                    {
                        title: "KTP",
                        url: "/console/ocr/ktp",
                        roles: ["admin", "user"]
                    }
                ]
            }
        ],
        manages: [
            {
                name: "Usage",
                url: "/console/usage",
                icon: ChartArea,
                roles: ["admin", "user"]
            },
            {
                name: "API Keys",
                url: "/console/apikeys",
                icon: KeyRound,
                roles: ["admin", "user"]
            },
            {
                name: "Users",
                url: "/console/users",
                icon: User,
                roles: ["admin"]
            }
        ],
    }

    return(
        <>
            <AppSidebar variant="inset" data={data}/>
            <SidebarInset>
              <SiteHeader title={usePageTitle(data)}/>
              {children}
            </SidebarInset>
        </>
    )
}