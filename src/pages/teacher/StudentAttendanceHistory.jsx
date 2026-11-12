
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  History,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Search,
} from "lucide-react";

import { getTeacherClasses } from "../../services/teacherClassService.js";
import { getTeacherAttendanceHistory } from "../../services/teacherAttendanceService.js";
import { useNavigate } from "react-router-dom";

const getLocalDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const AttendanceHistory = () => {
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(getLocalDate());
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  // Load classes and sections assigned to the logged-in teacher.
  const {
    data: classes = [],
    isLoading: classesLoading,
    isError: classesError,
    refetch: refetchClasses,
  } = useQuery({
    queryKey: ["teacher-classes"],
    queryFn: getTeacherClasses,
  });

  // Find the currently selected class.
  const selectedClass = useMemo(() => {
    return classes.find(
      (item) => String(item._id) === selectedClassId
    );
  }, [classes, selectedClassId]);
  // console.log("Selected Class:", selectedClass);

  // Get sections belonging to the selected class.
  const sections = selectedClass?.sections ?? [];

  // Load saved attendance only when a section and date are selected.
  const {
    data: history,
    isLoading: historyLoading,
    isFetching: historyFetching,
    isError: historyError,
    error: historyErrorDetails,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: [
      "teacher-attendance-history",
      selectedSectionId,
      attendanceDate,
    ],
    queryFn: () =>
      getTeacherAttendanceHistory({
        section_id: selectedSectionId,
        date: attendanceDate,
      }),
    enabled: Boolean(selectedSectionId && attendanceDate),
    retry: 1,
  });

  // console.log("Attendance History:", history);

  const records = history?.records ?? [];

  const filteredRecords = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return records;

    return records.filter((record) => {
      const name = [
        record.first_name,
        record.last_name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        name.includes(search) ||
        String(record.student_code ?? "")
          .toLowerCase()
          .includes(search) ||
        String(record.roll_number ?? "")
          .toLowerCase()
          .includes(search)
      );
    });
  }, [records, searchTerm]);

  const summary = history?.summary ?? {
    present: 0,
    absent: 0,
    late: 0,
  };

  const total = history?.total ?? 0;

  const handleClassChange = (event) => {
    setSelectedClassId(event.target.value);
    setSelectedSectionId("");
  };

  const handleSectionChange = (event) => {
    setSelectedSectionId(event.target.value);
  };

  const handleResetFilters = () => {
    setSelectedClassId("");
    setSelectedSectionId("");
    setAttendanceDate(getLocalDate());
    setSearchTerm("");
  };

  const formatStatus = (status) => {
    if (status === "present") return "Present";
    if (status === "absent") return "Absent";
    if (status === "late") return "Late";

    return status || "Unknown";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "present":
        return "badge-success";
      case "absent":
        return "badge-error";
      case "late":
        return "badge-warning";
      default:
        return "badge-ghost";
    }
  };

  if (classesLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (classesError) {
    return (
      <div className="alert alert-error">
        <span>Failed to load your assigned classes.</span>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => refetchClasses()}
        >
          Retry
        </button>
      </div>
    );
  }

  const handleBack = () => {

    navigate("/dashboard");

  };

  return (
    <div className="space-y-2 p-4 md:p-6">
      <div>
        <button
          onClick={handleBack}
          className="text-sm font-medium text-base-content/50 hover:text-primary hover:cursor-pointer"
        >
          ← Dashboard
        </button>

      </div>
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold md:text-3xl">
            <History className="h-7 w-7" />
            Attendance History
          </h1>
          <p className="mt-2 text-base-content/60">
            Review previously recorded student attendance.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline"
          onClick={() => refetchHistory()}
          disabled={
            !selectedSectionId ||
            !attendanceDate ||
            historyFetching
          }
        >
          <RefreshCw
            className={`h-4 w-4 ${historyFetching ? "animate-spin" : ""
              }`}
          />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title mb-2">
            <CalendarDays className="h-5 w-5" />
            Filter Attendance
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Class
              </legend>

              <select
                className="select select-bordered w-full"
                value={selectedClassId}
                onChange={handleClassChange}
              >
                <option value="">Select class</option>

                {classes.map((item) => (
                  <option
                    key={item._id}
                    value={item._id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Section
              </legend>

              <select
                className="select select-bordered w-full"
                value={selectedSectionId}
                onChange={handleSectionChange}
                disabled={!selectedClassId}
              >
                <option value="">Select section</option>

                {sections.map((section) => (
                  <option
                    key={section._id}
                    value={section._id}
                  >
                    {section.name}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Attendance Date
              </legend>

              <input
                type="date"
                className="input input-bordered w-full"
                value={attendanceDate}
                max={getLocalDate()}
                onChange={(event) =>
                  setAttendanceDate(event.target.value)
                }
              />
            </fieldset>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => refetchHistory()}
              disabled={
                !selectedSectionId ||
                !attendanceDate ||
                historyFetching
              }
            >
              <Search className="h-4 w-4" />
              View History
            </button>

            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* No selection */}
      {!selectedSectionId && (
        <div className="alert">
          <CalendarDays className="h-5 w-5" />
          <span>
            Select a class, section, and date to view saved
            attendance records.
          </span>
        </div>
      )}

      {/* History results */}
      {selectedSectionId && (
        <>
          {historyLoading && (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          )}

          {historyError && !historyLoading && (
            <div className="alert alert-error">
              <XCircle className="h-5 w-5" />
              <div>
                <p className="font-semibold">
                  Failed to load attendance history.
                </p>
                <p className="text-sm">
                  {historyErrorDetails?.response?.data?.message ||
                    historyErrorDetails?.message ||
                    "Please try again."}
                </p>
              </div>

              <button
                type="button"
                className="btn btn-sm"
                onClick={() => refetchHistory()}
              >
                Retry
              </button>
            </div>
          )}

          {history && !historyLoading && !historyError && (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="stat rounded-box bg-base-100 shadow">
                  <div className="stat-figure text-primary">
                    <Users className="h-8 w-8" />
                  </div>
                  <div className="stat-title">
                    Recorded Students
                  </div>
                  <div className="stat-value text-primary">
                    {total}
                  </div>
                </div>

                <div className="stat rounded-box bg-base-100 shadow">
                  <div className="stat-figure text-success">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <div className="stat-title">Present</div>
                  <div className="stat-value text-success">
                    {summary.present}
                  </div>
                </div>

                <div className="stat rounded-box bg-base-100 shadow">
                  <div className="stat-figure text-error">
                    <XCircle className="h-8 w-8" />
                  </div>
                  <div className="stat-title">Absent</div>
                  <div className="stat-value text-error">
                    {summary.absent}
                  </div>
                </div>

                <div className="stat rounded-box bg-base-100 shadow">
                  <div className="stat-figure text-warning">
                    <Clock className="h-8 w-8" />
                  </div>
                  <div className="stat-title">Late</div>
                  <div className="stat-value text-warning">
                    {summary.late}
                  </div>
                </div>
              </div>

              {/* Attendance table */}
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <h2 className="card-title">
                        Student Attendance Records
                      </h2>
                      <p className="text-sm text-base-content/60">
                        {selectedClass?.name} /{" "}
                        {sections.find(
                          (item) =>
                            String(item._id) === selectedSectionId
                        )?.name}{" "}
                        · {attendanceDate}
                      </p>
                    </div>

                    <label className="input input-bordered flex items-center gap-2">
                      <Search className="h-4 w-4 opacity-60" />
                      <input
                        type="search"
                        className="grow"
                        placeholder="Search student..."
                        value={searchTerm}
                        onChange={(event) =>
                          setSearchTerm(event.target.value)
                        }
                      />
                    </label>
                  </div>

                  {records.length === 0 ? (
                    <div className="py-12 text-center">
                      <History className="mx-auto mb-3 h-12 w-12 opacity-40" />
                      <h3 className="font-semibold">
                        No attendance records found
                      </h3>
                      <p className="mt-1 text-sm text-base-content/60">
                        No saved records were found for this
                        section on the selected date.
                      </p>
                    </div>
                  ) : filteredRecords.length === 0 ? (
                    <div className="py-8 text-center text-base-content/60">
                      No students match your search.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="table table-zebra">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Roll Number</th>
                            <th>Attendance Status</th>
                          </tr>
                        </thead>

                        <tbody>
                          {filteredRecords.map((record, index) => (
                            <tr key={record._id}>
                              <td>{index + 1}</td>
                              <td>
                                {record.student_code || "—"}
                              </td>
                              <td className="font-medium">
                                {[
                                  record.first_name,
                                  record.last_name,
                                ]
                                  .filter(Boolean)
                                  .join(" ") || "—"}
                              </td>
                              <td>
                                {record.roll_number || "—"}
                              </td>
                              <td>
                                <span
                                  className={`badge ${getStatusClass(
                                    record.status
                                  )}`}
                                >
                                  {formatStatus(record.status)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="mt-3 text-sm text-base-content/60">
                    Showing {filteredRecords.length} of{" "}
                    {records.length} recorded students
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AttendanceHistory;
