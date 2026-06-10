import { 
  LayoutDashboard, 
  ArrowDownToLine,
  ArrowUpRight,
  Boxes,
  RotateCcw,
  Settings,
  Users,
  History,
  ShoppingCart,
  Package,
  BookOpen,
  FileText
} from 'lucide-react';

export interface MenuItem {
  id: string;
  path: string;
  name: string;
  icon: any;
  isConfidential: boolean;
  category?: string;
  subItems?: { id: string; name: string; isConfidential?: boolean }[];
}

export const MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', path: '/', name: 'Dashboard', icon: LayoutDashboard, isConfidential: false, category: 'Main' },
  { id: 'quotations', path: '/quotations', name: 'Quotations & Proposals', icon: FileText, isConfidential: false, category: 'Sales Operations' },
  { id: 'performa_invoice', path: '/performa-invoice', name: 'Proforma Invoice', icon: ShoppingCart, isConfidential: false, category: 'Sales Operations' },
  { id: 'catalogue', path: '/catalogue', name: 'Products Catalogue', icon: Package, isConfidential: false, category: 'Sales Operations' },
  { id: 'price_books', path: '/price-books', name: 'Price Books', icon: BookOpen, isConfidential: false, category: 'Sales Operations' },
  { id: 'inbound', path: '/inbound', name: 'Inbound Control', icon: ArrowDownToLine, isConfidential: false, category: 'WMS Modules' },
  { id: 'outbound', path: '/outbound', name: 'Outbound Control', icon: ArrowUpRight, isConfidential: false, category: 'WMS Modules' },
  { id: 'inventory', path: '/inventory', name: 'Inventory Core', icon: Boxes, isConfidential: false, category: 'WMS Modules' },
  { id: 'returns', path: '/returns', name: 'Returns & QC', icon: RotateCcw, isConfidential: false, category: 'WMS Modules' },
  { id: 'settings', path: '/settings', name: 'WMS Settings', icon: Settings, isConfidential: true, category: 'System configuration' },
  { id: 'permissions', path: '/permissions', name: 'User Permissions', icon: Users, isConfidential: true, category: 'System configuration' },
  { id: 'access_logs', path: '/access-logs', name: 'Access Logs', icon: History, isConfidential: true, category: 'System configuration' },
];
