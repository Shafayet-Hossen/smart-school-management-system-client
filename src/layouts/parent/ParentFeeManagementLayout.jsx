
import { NavLink, Outlet } from "react-router-dom";
import {
  Wallet,
  LayoutDashboard,
  Receipt,
  AlertCircle,
  History,
  FileText,
} from "lucide-react";

const feeNavigation = [
  {
    title: "Overview",
    path: "/parent/fees",
    icon: LayoutDashboard,
    end: true,
  },
  {
    title: "Fee Records",
    path: "/parent/fees/records",
    icon: Receipt,
  },
  {
    title: "Due Fees",
    path: "/parent/fees/due",
    icon: AlertCircle,
  },
  {
    title: "Payment History",
    path: "/parent/fees/payments",
    icon: History,
  },
  {
    title: "Receipts",
    path: "/parent/fees/receipts",
    icon: FileText,
  },
];

const ParentFeeManagementLayout = () => {
  return (
    <div className="w-full space-y-6 p-6">

      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <Wallet size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Fee Management
              </h1>

              <p className="text-sm text-base-content/60">
                Manage your children's school fees and payments.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Navigation */}
      <div className="border-b border-base-300">
        <nav className="flex gap-2 overflow-x-auto pb-1">
          {feeNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-2 rounded-t-lg border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-transparent text-base-content/60 hover:bg-base-200 hover:text-base-content"
                  }`
                }
              >
                <Icon size={17} />
                {item.title}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Page Content */}
      <div className="min-w-0">
        <Outlet />
      </div>

    </div>
  );
};

export default ParentFeeManagementLayout;
