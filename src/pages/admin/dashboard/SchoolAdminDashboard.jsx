import { useQuery } from "@tanstack/react-query";
import {
    Users,
    GraduationCap,
    UserCheck,
    CalendarCheck,
    Wallet,
    AlertCircle,
    RefreshCw,
    UserPlus,
    BookOpen,
    ClipboardList,
    FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getSchoolAdminDashboard } from "../../../services/schoolAdminDashboardService";

import DashboardStatCard from "../../../components/school-admin/DashboardStatCard";
import EnrollmentChart from "../../../components/school-admin/EnrollmentChart";
import AttendanceChart from "../../../components/school-admin/AttendanceChart";
import FeeCollectionChart from "../../../components/school-admin/FeeCollectionChart";
import FeeStatusChart from "../../../components/school-admin/FeeStatusChart";
import ClassDistributionChart from "../../../components/school-admin/ClassDistributionChart";
import RecentActivities from "../../../components/school-admin/RecentActivities";

const formatCurrency = (value) =>
    `৳${Number(value || 0).toLocaleString("en-BD")}`;

const SchoolAdminDashboard = () => {
    const {
        data,
        isLoading,
        isError,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["school-admin-dashboard"],
        queryFn: getSchoolAdminDashboard,
    });

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    if (isError || !data?.success) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
                <AlertCircle size={40} className="text-error" />

                <h2 className="text-lg font-bold">
                    Unable to load dashboard
                </h2>

                <p className="text-sm text-base-content/60">
                    Please check your connection and try again.
                </p>

                <button
                    onClick={() => refetch()}
                    className="btn btn-primary btn-sm"
                >
                    Try again
                </button>
            </div>
        );
    }

    const {
        summary = {},
        enrollment = [],
        attendance = [],
        fee_collection = [],
        fee_status = [],
        class_distribution = [],
        recent_activities = [],
    } = data;

    const quickActions = [
        {
            title: "Add Student",
            description: "Register a new student",
            icon: UserPlus,
            path: "/school-admin/add-students",
            color: "text-primary bg-primary/10",
        },
        {
            title: "Add Teacher",
            description: "Register a new teacher",
            icon: GraduationCap,
            path: "/school-admin/add-teachers",
            color: "text-success bg-success/10",
        },
        {
            title: "Manage Fees",
            description: "View and collect fees",
            icon: Wallet,
            path: "/school-admin/fees-dashboard",
            color: "text-warning bg-warning/10",
        },
        {
            title: "Examinations",
            description: "Manage examinations",
            icon: ClipboardList,
            path: "/school-admin/examinations",
            color: "text-info bg-info/10",
        },
        {
            title: "Attendance",
            description: "Monitor attendance",
            icon: CalendarCheck,
            path: "/school-admin/attendance",
            color: "text-secondary bg-secondary/10",
        },
        {
            title: "Reports",
            description: "View school reports",
            icon: FileText,
            path: "/reports",
            color: "text-error bg-error/10",
        },
    ];

    return (
        <div className="min-h-screen space-y-6 bg-base-200/40 p-4 md:p-6 lg:p-8">

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <p className="text-sm font-medium text-primary">
                        SCHOOL ADMINISTRATION
                    </p>

                    <h1 className="mt-1 text-2xl font-bold md:text-3xl">
                        Dashboard Overview
                    </h1>

                    <p className="mt-1 text-sm text-base-content/50">
                        Monitor your school's performance and daily operations.
                    </p>
                </div>

                <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="btn btn-outline btn-sm"
                >
                    <RefreshCw
                        size={16}
                        className={isFetching ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
                <DashboardStatCard
                    title="Total Students"
                    value={summary.total_students ?? 0}
                    subtitle="Currently enrolled"
                    icon={Users}
                    color="primary"
                    trend={summary.student_trend}
                />

                <DashboardStatCard
                    title="Total Teachers"
                    value={summary.total_teachers ?? 0}
                    subtitle="Active teaching staff"
                    icon={GraduationCap}
                    color="success"
                    trend={summary.teacher_trend}
                />

                <DashboardStatCard
                    title="Total Classes"
                    value={summary.total_classes ?? 0}
                    subtitle="Available classes"
                    icon={BookOpen}
                    color="info"
                />

                <DashboardStatCard
                    title="Attendance Rate"
                    value={`${summary.attendance_rate ?? 0}%`}
                    subtitle="Today's attendance"
                    icon={UserCheck}
                    color="success"
                    trend={summary.attendance_trend}
                />

                <DashboardStatCard
                    title="Fee Collection"
                    value={formatCurrency(summary.fee_collected)}
                    subtitle="Collected this month"
                    icon={Wallet}
                    color="warning"
                    trend={summary.fee_trend}
                />

                <DashboardStatCard
                    title="Outstanding Dues"
                    value={formatCurrency(summary.outstanding_dues)}
                    subtitle="Remaining fee balance"
                    icon={AlertCircle}
                    color="error"
                />
            </div>

            {/* Main charts */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <EnrollmentChart data={enrollment} />
                <AttendanceChart data={attendance} />
            </div>

            {/* Financial charts */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <FeeCollectionChart data={fee_collection} />
                </div>

                <FeeStatusChart data={fee_status} />
            </div>

            {/* Class distribution and activities */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <ClassDistributionChart data={class_distribution} />
                <RecentActivities activities={recent_activities} />
            </div>

            {/* Quick actions */}
            <div className="card border border-base-200 bg-base-100 shadow-sm">
                <div className="card-body">
                    <div className="mb-2">
                        <h2 className="text-lg font-bold">
                            Quick Actions
                        </h2>

                        <p className="text-sm text-base-content/50">
                            Quickly access common administrative tasks.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {quickActions.map((action) => {
                            const Icon = action.icon;

                            return (
                                <Link
                                    key={action.title}
                                    to={action.path}
                                    className="flex items-center gap-3 rounded-xl border border-base-200 p-4 transition hover:border-primary/40 hover:bg-base-200/50"
                                >
                                    <div className={`rounded-xl p-3 ${action.color}`}>
                                        <Icon size={22} />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold">
                                            {action.title}
                                        </h3>

                                        <p className="text-xs text-base-content/50">
                                            {action.description}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchoolAdminDashboard;