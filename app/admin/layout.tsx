"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  TrendingUp,
  Settings,
  Search,
  Bell,
  ChevronDown,
  Menu,
  X
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const navSections = [
  {
    title: "MAIN MENU",
    items: [
      { icon: Home, label: "Dashboard", href: "/admin", badge: null },
      { icon: Package, label: "Products", href: "/admin/products", badge: "125" },
      { icon: ShoppingCart, label: "Orders", href: "/admin/orders", badge: "23" },
      { icon: Users, label: "Customers", href: "/admin/customers", badge: null },
    ],
  },
  // {
  //   title: "ANALYTICS",
  //   items: [
  //     { icon: BarChart3, label: "Reports", href: "/admin/reports", badge: null },
  //     { icon: TrendingUp, label: "Analytics", href: "/admin/analytics", badge: null },
  //   ],
  // },
  // {
  //   title: "SETTINGS",
  //   items: [
  //     { icon: Settings, label: "Settings", href: "/admin/settings", badge: null },
  //   ],
  // },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#667eea] to-[#764ba2]">
      {/* Sidebar */}
<aside
  className={`fixed left-0 top-0 z-40 h-screen w-70 bg-linear-to-b from-[#1a202c] to-[#2d3748] shadow-2xl transition-transform duration-300
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
>
        {/* Logo */}
        <div className="flex items-center gap-3.5 border-b border-white/10 px-6 py-7">
          <div className="flex h-10.5 w-10.5 items-center justify-center rounded-[10px] bg-linear-to-br from-[#667eea] to-[#764ba2] text-lg font-bold text-white shadow-lg shadow-[#667eea]/40">
            E
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Enterprise</span>
        </div>

        {/* Navigation */}
        <nav className="overflow-y-auto pb-6" style={{ height: "calc(100vh - 90px)" }}>
          {navSections.map((section, idx) => (
            <div key={idx} className="px-4 pb-3 pt-6">
              <div className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/50">
                {section.title}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative mb-1 flex items-center gap-3 rounded-[10px] px-4 py-3 text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-linear-to-br from-[#667eea] to-[#764ba2] text-white shadow-lg shadow-[#667eea]/40"
                        : "text-white/70 hover:translate-x-1 hover:bg-white/8 hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-[70%] w-0.75 -translate-y-1/2 rounded-r-sm bg-white" />
                    )}
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`ml-auto rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-[#667eea]/20 text-[#667eea]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
<div
  className={`min-h-screen transition-all duration-300 ${
    sidebarOpen ? "ml-70" : "ml-0"
  }`}
>
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-black/6 bg-white/95 px-10 py-5 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between">
            {/* Left Side */}
            <div className="flex flex-1 items-center gap-6">
                <button
  onClick={() => setSidebarOpen(!sidebarOpen)}
  className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
>
  {sidebarOpen ? (
    <X className="h-5 w-5 text-gray-600" />
  ) : (
    <Menu className="h-5 w-5 text-gray-600" />
  )}
</button>

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Link href="#" className="transition-colors hover:text-[#667eea]">
                  Home
                </Link>
                <span>/</span>
                <span className="font-semibold text-gray-900">Dashboard</span>
              </div>

              {/* Search */}
              <div className="relative w-95">
                <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders, customers, products..."
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm transition-all focus:border-[#667eea] focus:outline-none focus:ring-3 focus:ring-[#667eea]/10"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Notification Button */}
              <button className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
              </button>

              {/* User Section */}
              <button className="flex items-center gap-3 rounded-xl bg-white px-3 py-2 shadow-sm transition-all hover:shadow-md">
                <div className="flex h-9.5 w-9.5 items-center justify-center rounded-[10px] bg-linear-to-br from-[#667eea] to-[#764ba2] text-sm font-semibold text-white">
                  JD
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900">John Doe</div>
                  <div className="text-xs text-gray-600">Administrator</div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-10">{children}</main>
      </div>
    </div>
  );
}