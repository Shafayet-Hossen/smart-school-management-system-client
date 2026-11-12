import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getTeacherExamSchedule } from "../../../services/teacherExamService";

const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const TeacherExamSchedule = () => {
    const [search, setSearch] = useState("");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["teacher-exam-schedule"],
        queryFn: () => getTeacherExamSchedule(),
    });

    const schedules =
        data?.schedules ??
        data?.data?.schedules ??
        data?.data ??
        [];

    const filteredSchedules = Array.isArray(schedules)
        ? schedules.filter((item) => {
              const searchableText = [
                  item.exam_name,
                  item.subject_name,
                  item.class_name,
                  item.class_code,
                  item.section_name,
              ]
                  .filter(Boolean)
                  .join(" ")
                  .toLowerCase();

              return searchableText.includes(search.toLowerCase());
          })
        : [];

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="alert alert-error">
                {error?.response?.data?.message ||
                    "Unable to load examination schedule."}
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold">Exam Schedule</h2>
                    <p className="text-sm text-base-content/60">
                        Examination schedules assigned to you.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handlePrint}
                    className="btn btn-primary btn-sm print:hidden"
                >
                    Print Schedule
                </button>
            </div>

            <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search exam, subject, class or section..."
                className="input input-bordered w-full max-w-md"
            />

            <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Examination</th>
                            <th>Class</th>
                            <th>Section</th>
                            <th>Subject</th>
                            <th>Exam Date</th>
                            <th>Total Marks</th>
                            <th>Pass Marks</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredSchedules.length > 0 ? (
                            filteredSchedules.map((item, index) => (
                                <tr key={`${item.exam_id}-${item.section_id}-${item.subject_id}-${index}`}>
                                    <td>{index + 1}</td>
                                    <td className="font-medium">
                                        {item.exam_name || "—"}
                                    </td>
                                    <td>
                                        {item.class_name ||
                                            item.class_code ||
                                            "—"}
                                    </td>
                                    <td>{item.section_name || "—"}</td>
                                    <td>{item.subject_name || "—"}</td>
                                    <td>{formatDate(item.exam_date)}</td>
                                    <td>{item.total_marks ?? "—"}</td>
                                    <td>{item.pass_marks ?? "—"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="py-10 text-center text-base-content/50">
                                    No examination schedules found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeacherExamSchedule;