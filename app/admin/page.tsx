"use client";

import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  Download,
  Plus,
  Filter,
  Eye,
  MoreVertical,
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: "$128,420",
      change: "+18.2%",
      trend: "up",
      description: "+$12,340 from last month",
      color: "blue",
    },
    {
      icon: ShoppingBag,
      label: "Total Orders",
      value: "3,842",
      change: "+12.8%",
      trend: "up",
      description: "+438 orders this week",
      color: "green",
    },
    {
      icon: Users,
      label: "New Customers",
      value: "2,156",
      change: "+24.5%",
      trend: "up",
      description: "+342 new this month",
      color: "orange",
    },
    {
      icon: Package,
      label: "Active Products",
      value: "892",
      change: "-3.2%",
      trend: "down",
      description: "28 products out of stock",
      color: "purple",
    },
  ];

  const orders = [
    {
      id: "#ORD-2024-1847",
      customer: { name: "James Sullivan", email: "james.s@email.com", avatar: "JS" },
      date: "Dec 26, 2024",
      amount: "$2,847.00",
      status: "completed",
    },
    {
      id: "#ORD-2024-1846",
      customer: { name: "Emma Wilson", email: "emma.wilson@email.com", avatar: "EW" },
      date: "Dec 26, 2024",
      amount: "$1,234.50",
      status: "processing",
    },
    {
      id: "#ORD-2024-1845",
      customer: { name: "Michael Brown", email: "m.brown@email.com", avatar: "MB" },
      date: "Dec 25, 2024",
      amount: "$892.30",
      status: "completed",
    },
    {
      id: "#ORD-2024-1844",
      customer: { name: "Sarah Davis", email: "sarah.d@email.com", avatar: "SD" },
      date: "Dec 25, 2024",
      amount: "$3,421.75",
      status: "pending",
    },
    {
      id: "#ORD-2024-1843",
      customer: { name: "David Johnson", email: "david.j@email.com", avatar: "DJ" },
      date: "Dec 24, 2024",
      amount: "$567.90",
      status: "completed",
    },
  ];

  const colorClasses = {
    blue: "bg-gradient-to-br from-blue-500 to-[#667eea] text-white",
    green: "bg-gradient-to-br from-green-500 to-green-600 text-white",
    orange: "bg-gradient-to-br from-orange-500 to-orange-600 text-white",
    purple: "bg-gradient-to-br from-purple-500 to-purple-600 text-white",
  };

  const statusStyles = {
    completed: "bg-green-50 text-green-600",
    processing: "bg-blue-50 text-blue-600",
    pending: "bg-orange-50 text-orange-600",
  };

  const statusDots = {
    completed: "bg-green-600",
    processing: "bg-blue-600 animate-pulse",
    pending: "bg-orange-600",
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-[32px] font-bold text-white drop-shadow-sm">
            Dashboard Overview
          </h1>
          <p className="text-[15px] text-white/90">
            Track your business performance and metrics
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-xl bg-white/15 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/25 hover:shadow-lg">
            <Download className="h-4.5 w-4.5" />
            Export
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#667eea] transition-all hover:-translate-y-0.5 hover:shadow-xl">
            <Plus className="h-4.5 w-4.5" />
            Add New
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-black/4 bg-white p-7 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="absolute left-0 right-0 top-0 h-1 bg-linear-to-r from-[#667eea] to-[#764ba2] opacity-0 transition-opacity group-hover:opacity-100" />
              
              <div className="mb-5 flex items-start justify-between">
                <div
                  className={`relative flex h-14 w-14 items-center justify-center rounded-[14px] ${
                    colorClasses[stat.color as keyof typeof colorClasses]
                  } shadow-lg`}
                >
                  <Icon className="h-7 w-7" strokeWidth={2} />
                  <div className="absolute -inset-1 rounded-2xl border border-current opacity-30" />
                </div>
                <span
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-bold ${
                    stat.trend === "up"
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  <TrendIcon className="h-3.5 w-3.5" strokeWidth={3} />
                  {stat.change}
                </span>
              </div>

              <div className="mb-2 text-sm font-medium text-gray-600">{stat.label}</div>
              <div className="mb-2 text-4xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center gap-1 text-[13px] text-gray-400">
                <TrendingUp className="h-3.5 w-3.5" />
                {stat.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      {/* <div className="rounded-2xl border border-black/4 bg-white p-8 shadow-lg">
        <div className="mb-7 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Revenue Analytics</h2>
          <div className="flex gap-2">
            {["7 Days", "30 Days", "90 Days", "1 Year"].map((period, idx) => (
              <button
                key={period}
                className={`rounded-lg border px-4 py-2 text-[13px] font-semibold transition-all ${
                  idx === 1
                    ? "border-[#667eea] bg-[#667eea] text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-[#667eea] hover:text-[#667eea]"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <div className="flex h-[300px] items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 text-sm text-gray-400">
          Revenue Chart Placeholder - Integrate with Chart.js or Recharts
        </div>
      </div> */}

      {/* Recent Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-black/4 bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-[13px] font-semibold text-gray-600 transition-all hover:border-[#667eea] hover:text-[#667eea]">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-[13px] font-semibold text-gray-600 transition-all hover:border-[#667eea] hover:text-[#667eea]">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                  Order ID
                </th>
                <th className="px-8 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                  Customer
                </th>
                <th className="px-8 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                  Date
                </th>
                <th className="px-8 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                  Amount
                </th>
                <th className="px-8 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                  Status
                </th>
                <th className="px-8 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-100 transition-colors hover:bg-gray-50"
                >
                  <td className="px-8 py-5 font-mono text-[13px] font-semibold text-[#667eea]">
                    {order.id}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-linear-to-br from-[#667eea] to-[#764ba2] text-sm font-semibold text-white">
                        {order.customer.avatar}
                      </div>
                      <div>
                        <div className="mb-0.5 font-semibold text-gray-900">
                          {order.customer.name}
                        </div>
                        <div className="text-[13px] text-gray-600">
                          {order.customer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-700">{order.date}</td>
                  <td className="px-8 py-5 text-[15px] font-bold text-gray-900">
                    {order.amount}
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold ${
                        statusStyles[order.status as keyof typeof statusStyles]
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          statusDots[order.status as keyof typeof statusDots]
                        }`}
                      />
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex gap-2">
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-600 transition-all hover:bg-[#667eea] hover:text-white">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-600 transition-all hover:bg-[#667eea] hover:text-white">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}