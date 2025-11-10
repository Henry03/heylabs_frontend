export interface SidebarSectionItem {
  title: string
  url: string
  roles?: string[]
}

export interface SidebarSection {
  name: string
  url?: string
  icon: React.ComponentType<any>
  isActive?: boolean
  items?: SidebarSectionItem[]
  roles?: string[]
}

export interface SidebarData {
  services: SidebarSection[]
  manages: SidebarSection[]
}
