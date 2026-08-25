import { useEffect, useState } from "react";
import api from "../../services/api.js";

const AttendanceDashboard = () => {
    const [summary, setSummary] = useState(null);
    const [classes, setClasses] = useState([]);
    const [daily, setDaily] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [lowAttendance, setLowAttendance] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadAttendanceDashboard();
    }, []);

    const loadAttendanceDashboard = async () => {
        try {
            console.log("attendance Dashboard")
            setLoading(true);
            setError("");

            // const [
            //     summaryResponse,
            //     classResponse,
            //     dailyResponse,
            //     subjectResponse,
            //     lowAttendanceResponse
            // ] = await Promise.all([
            //     api.get("/attendance-analytics/today"),
            //     api.get("/attendance-analytics/classes"),
            //     api.get("/attendance-analytics/daily"),
            //     api.get("/attendance-analytics/subjects"),
            //     api.get("/attendance-analytics/low-attendance?threshold=75")
            // ]);

            const summaryResponse = await api.get("/attendance-analytics/today")
            
            console.log("summaryResponse",summaryResponse.data)

            setSummary(summaryResponse.data.data);
            // setClasses(classResponse.data.data);
            // setDaily(dailyResponse.data.data);
            // setSubjects(subjectResponse.data.data);
            // setLowAttendance(
            //     lowAttendanceResponse.data.data
            // );

        } catch (error) {
            console.error(
                "Attendance dashboard error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load attendance dashboard"
            );

        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <span>{error}</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Dashboard content will go here */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                    <h1 className="text-3xl font-bold">
                        Attendance Dashboard
                    </h1>

                    <p className="text-base-content/60 mt-1">
                        Monitor attendance across your school
                    </p>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={loadAttendanceDashboard}
                >
                    Refresh
                </button>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                <div className="stat bg-base-100 shadow rounded-box">
                    <div className="stat-title">
                        Total
                    </div>

                    <div className="stat-value">
                        {summary?.total || 0}
                    </div>

                    <div className="stat-desc">
                        Attendance records today
                    </div>
                </div>


                <div className="stat bg-base-100 shadow rounded-box">
                    <div className="stat-title">
                        Present
                    </div>

                    <div className="stat-value text-success">
                        {summary?.present || 0}
                    </div>

                    <div className="stat-desc">
                        Students present
                    </div>
                </div>


                <div className="stat bg-base-100 shadow rounded-box">
                    <div className="stat-title">
                        Absent
                    </div>

                    <div className="stat-value text-error">
                        {summary?.absent || 0}
                    </div>

                    <div className="stat-desc">
                        Students absent
                    </div>
                </div>


                <div className="stat bg-base-100 shadow rounded-box">
                    <div className="stat-title">
                        Late
                    </div>

                    <div className="stat-value text-warning">
                        {summary?.late || 0}
                    </div>

                    <div className="stat-desc">
                        Students late
                    </div>
                </div>

            </div>

            <div className="card bg-base-100 shadow">

                <div className="card-body">

                    <div className="flex justify-between items-center">

                        <div>
                            <h2 className="card-title">
                                Overall Attendance
                            </h2>

                            <p className="text-base-content/60">
                                Today's attendance percentage
                            </p>
                        </div>

                        <div className="text-3xl font-bold">
                            {summary?.attendance_percentage || 0}%
                        </div>

                    </div>

                    <progress
                        className="progress progress-primary w-full"
                        value={
                            summary?.attendance_percentage || 0
                        }
                        max="100"
                    />

                </div>

            </div>

            <div className="card bg-base-100 shadow">

                <div className="card-body">

                    <div className="flex flex-col md:flex-row md:justify-between gap-2 mb-4">

                        <div>
                            <h2 className="card-title">
                                Low Attendance Students
                            </h2>

                            <p className="text-base-content/60">
                                Students with attendance below 75%
                            </p>
                        </div>

                        <div className="badge badge-warning">
                            {lowAttendance.length} Students
                        </div>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="table table-zebra">

                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Student ID</th>
                                    <th>Class</th>
                                    <th>Attendance</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>

                                {lowAttendance.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="text-center"
                                        >
                                            No students have low attendance.
                                        </td>
                                    </tr>

                                ) : (

                                    lowAttendance.map((student) => {

                                        const percentage =
                                            Number(
                                                student.attendance_percentage || 0
                                            );

                                        return (
                                            <tr
                                                key={student.student_id}
                                            >

                                                <td className="font-medium">
                                                    {student.student_name}
                                                </td>

                                                <td>
                                                    {student.student_id}
                                                </td>

                                                <td>
                                                    {student.class_id}
                                                </td>

                                                <td>
                                                    {percentage.toFixed(2)}%
                                                </td>

                                                <td>

                                                    {percentage < 60 ? (

                                                        <span className="badge badge-error">
                                                            Critical
                                                        </span>

                                                    ) : (

                                                        <span className="badge badge-warning">
                                                            Warning
                                                        </span>

                                                    )}

                                                </td>

                                            </tr>
                                        );

                                    })

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

            <div className="card bg-base-100 shadow">

                <div className="card-body">

                    <h2 className="card-title">
                        Daily Attendance
                    </h2>

                    <p className="text-base-content/60 mb-4">
                        Attendance trend by date
                    </p>

                    <div className="overflow-x-auto">

                        <table className="table table-zebra">

                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Present</th>
                                    <th>Absent</th>
                                    <th>Late</th>
                                    <th>Percentage</th>
                                </tr>
                            </thead>

                            <tbody>

                                {daily.map((item) => (

                                    <tr key={item._id}>

                                        <td>
                                            {item._id}
                                        </td>

                                        <td>
                                            {item.total}
                                        </td>

                                        <td className="text-success">
                                            {item.present}
                                        </td>

                                        <td className="text-error">
                                            {item.absent}
                                        </td>

                                        <td className="text-warning">
                                            {item.late}
                                        </td>

                                        <td>
                                            {Number(
                                                item.attendance_percentage || 0
                                            ).toFixed(2)}
                                            %
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

            <div className="card bg-base-100 shadow">

                <div className="card-body">

                    <h2 className="card-title">
                        Subject-wise Attendance
                    </h2>

                    <p className="text-base-content/60 mb-4">
                        Attendance performance by subject
                    </p>

                    <div className="overflow-x-auto">

                        <table className="table table-zebra">

                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Total</th>
                                    <th>Present</th>
                                    <th>Absent</th>
                                    <th>Late</th>
                                    <th>Attendance</th>
                                </tr>
                            </thead>

                            <tbody>

                                {subjects.map((item) => (

                                    <tr key={item.subject_id}>

                                        <td className="font-medium">
                                            {item.subject_name ||
                                                item.subject_id}
                                        </td>

                                        <td>
                                            {item.total}
                                        </td>

                                        <td>
                                            {item.present}
                                        </td>

                                        <td>
                                            {item.absent}
                                        </td>

                                        <td>
                                            {item.late}
                                        </td>

                                        <td>
                                            {Number(
                                                item.attendance_percentage || 0
                                            ).toFixed(2)}
                                            %
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>



        </div>
    );
};

export default AttendanceDashboard;