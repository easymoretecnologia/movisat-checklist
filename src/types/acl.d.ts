export interface ACLProps {
    action: string
    subject: string
}
  
export interface LayoutProps {
    children: React.ReactNode
    acl?: ACLProps
}