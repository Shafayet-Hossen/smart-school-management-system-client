import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistration } from "../../context/RegistrationContext.jsx";
import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext";

function TeacherSchool() {
    const { loading, setLoading } = useAuth();
    const navigate = useNavigate();

    const {
        registrationData,
        updateField,
    } = useRegistration();

    const [search, setSearch] = useState("");
    const [schools, setSchools] = useState([]);

    const [selectedSchool, setSelectedSchool] = useState(
        registrationData.school_id
            ? {
                school_id: registrationData.school_id,
                name: registrationData.school_name || "",
                email: registrationData.school_email || "",
                eiin: registrationData.eiin || "",
                // address: registrationData.schoolAddress || "",
                // logo: registrationData.schoolLogo || "",
            }
            : null
    );

    const [error, setError] = useState("");
    const [searched, setSearched] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | Search Schools
    |--------------------------------------------------------------------------
    */

    const handleSearch = async () => {
        const value = search.trim();

        if (!value) {
            setError(
                "Please enter a school name, EIIN or school email."
            );

            setSchools([]);
            setSearched(false);

            return;
        }

        try {
            setLoading(true);
            setError("");
            setSearched(false);

            const response = await api.get(
                "/auth/schools/search",
                {
                    params: {
                        q: value,
                    },
                }
            );

            const result = response.data;
            console.log("teacherSchool:", result.data)

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                    "Unable to search schools."
                );
            }

            setSchools(result.data || []);
            setSearched(true);

        } catch (error) {
            console.error(
                "School search error:",
                error
            );

            setSchools([]);

            setError(
                error.response?.data?.message ||
                error.message ||
                "Unable to search schools."
            );

            setSearched(true);

        } finally {
            setLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Handle Search Input
    |--------------------------------------------------------------------------
    */

    const handleSearchChange = (event) => {
        setSearch(event.target.value);

        /*
         * Clear old search results when
         * the user starts typing again.
         */
        if (searched) {
            setSearched(false);
        }

        if (error) {
            setError("");
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Handle Enter Key
    |--------------------------------------------------------------------------
    */

    const handleSearchKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();

            handleSearch();
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Select School
    |--------------------------------------------------------------------------
    */

    const handleSelectSchool = (school) => {
        setSelectedSchool(school);
        setError("");

        /*
         * Store school information
         * inside RegistrationContext.
         */

        updateField(
            "school_id",
            school.school_id
        );

        updateField(
            "school_name",
            school.name || ""
        );

        updateField(
            "school_email",
            school.email || ""
        );

        updateField(
            "eiin",
            school.eiin || ""
        );

        // updateField(
        //     "schoolAddress",
        //     school.address || ""
        // );

        // updateField(
        //     "schoolLogo",
        //     school.logo || ""
        // );
    };

    /*
    |--------------------------------------------------------------------------
    | Continue
    |--------------------------------------------------------------------------
    */

    const handleContinue = () => {
        if (!selectedSchool) {
            setError(
                "Please select your school before continuing."
            );

            return;
        }

        navigate(
            "/register/teacher/account"
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Back
    |--------------------------------------------------------------------------
    */

    const handleBack = () => {
        navigate("/register/teacher");
    };

    return (
        <div className="min-h-screen bg-base-200 px-4 py-10 sm:py-16">

            <div className="mx-auto max-w-5xl">

                {/* =========================================================
                    HEADER
                ========================================================= */}

                <div className="text-center">

                    <button
                        type="button"
                        onClick={handleBack}
                        className="mb-8 text-sm font-medium text-base-content/50 transition hover:text-primary"
                    >
                        ← Back
                    </button>

                    {/* Logo */}

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl shadow-lg">
                        🏫
                    </div>

                    <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
                        Find Your School
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-base-content/60 sm:text-base">
                        Search for your school and select it
                        to continue your teacher registration.
                    </p>

                </div>


                {/* =========================================================
                    PROGRESS
                ========================================================= */}

                <div className="mx-auto mt-10 max-w-md">

                    <div className="flex items-center gap-3">

                        {/* Step 1 */}

                        <div className="h-2 flex-1 rounded-full bg-primary" />

                        {/* Step 2 */}

                        <div className="h-2 flex-1 rounded-full bg-primary" />

                        {/* Step 3 */}

                        <div className="h-2 flex-1 rounded-full bg-primary" />

                        {/* Step 4 */}

                        <div className="h-2 flex-1 rounded-full bg-base-300" />

                        {/* Step 5 */}

                        <div className="h-2 flex-1 rounded-full bg-base-300" />

                    </div>

                    <p className="mt-3 text-center text-xs text-base-content/50">
                        Step 3 of 5
                    </p>

                </div>


                {/* =========================================================
                    MAIN SEARCH CARD
                ========================================================= */}

                <div className="mt-10 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">

                    <div>

                        <h2 className="text-xl font-bold">
                            Search for your school
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-base-content/60">
                            Search using the school name,
                            EIIN number, or school email.
                        </p>

                    </div>


                    {/* =====================================================
                        SEARCH INPUT
                    ===================================================== */}

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                        <input
                            type="text"
                            value={search}
                            onChange={
                                handleSearchChange
                            }
                            onKeyDown={
                                handleSearchKeyDown
                            }
                            placeholder="School name, EIIN or email"
                            className="input input-bordered h-12 w-full rounded-xl"
                            disabled={loading}
                        />

                        <button
                            type="button"
                            onClick={handleSearch}
                            disabled={
                                loading ||
                                !search.trim()
                            }
                            className="btn btn-primary h-12 rounded-xl sm:px-8"
                        >

                            {loading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm" />

                                    Searching...
                                </>
                            ) : (
                                <>
                                    🔍 Search
                                </>
                            )}

                        </button>

                    </div>


                    {/* =====================================================
                        ERROR
                    ===================================================== */}

                    {error && (
                        <div className="alert alert-error mt-5">

                            <span className="text-sm">
                                {error}
                            </span>

                        </div>
                    )}


                    {/* =====================================================
                        SEARCH RESULTS
                    ===================================================== */}

                    {searched && schools.length > 0 && (

                        <div className="mt-8">

                            <div className="mb-4">

                                <h3 className="font-semibold">
                                    Schools found
                                </h3>

                                <p className="mt-1 text-xs text-base-content/50">
                                    Select the school you
                                    currently work for.
                                </p>

                            </div>


                            <div className="space-y-3">

                                {schools.map(
                                    (school) => {

                                        const isSelected =
                                            selectedSchool?._id ===
                                            school._id;

                                        return (
                                            <button
                                                key={
                                                    school._id
                                                }
                                                type="button"
                                                onClick={() =>
                                                    handleSelectSchool(
                                                        school
                                                    )
                                                }
                                                className={`w-full rounded-2xl border p-5 text-left transition-all duration-200 ${isSelected
                                                        ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/20"
                                                        : "border-base-300 bg-base-100 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                                                    }`}
                                            >

                                                <div className="flex items-start gap-4">

                                                    {/* School Logo */}

                                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/10">

                                                        {school.logo ? (
                                                            <img
                                                                src={
                                                                    school.logo
                                                                }
                                                                alt={
                                                                    school.name
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-2xl">
                                                                🏫
                                                            </span>
                                                        )}

                                                    </div>


                                                    {/* School Information */}

                                                    <div className="min-w-0 flex-1">

                                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                                                            <h4 className="text-base font-bold sm:text-lg">
                                                                {
                                                                    school.name
                                                                }
                                                            </h4>

                                                            {isSelected && (
                                                                <span className="badge badge-primary shrink-0">
                                                                    ✓ Selected
                                                                </span>
                                                            )}

                                                        </div>


                                                        {/* EIIN */}

                                                        {school.eiin && (
                                                            <p className="mt-2 text-sm text-base-content/60">
                                                                <span className="font-medium">
                                                                    EIIN:
                                                                </span>{" "}
                                                                {
                                                                    school.eiin
                                                                }
                                                            </p>
                                                        )}


                                                        {/* Address */}

                                                        {school.address && (
                                                            <p className="mt-1 text-sm text-base-content/60">
                                                                📍{" "}
                                                                {
                                                                    school.address
                                                                }
                                                            </p>
                                                        )}


                                                        {/* Email */}

                                                        {school.email && (
                                                            <p className="mt-1 truncate text-sm text-base-content/50">
                                                                ✉️{" "}
                                                                {
                                                                    school.email
                                                                }
                                                            </p>
                                                        )}

                                                    </div>

                                                </div>

                                            </button>
                                        );
                                    }
                                )}

                            </div>

                        </div>
                    )}


                    {/* =====================================================
                        NO RESULTS
                    ===================================================== */}

                    {searched &&
                        schools.length === 0 &&
                        !error && (

                            <div className="mt-8 rounded-2xl border border-dashed border-base-300 p-8 text-center">

                                <div className="text-4xl">
                                    🔍
                                </div>

                                <h3 className="mt-4 font-semibold">
                                    No school found
                                </h3>

                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/50">
                                    We couldn't find a school
                                    matching your search.
                                    Check the school name or
                                    EIIN and try again.
                                </p>

                            </div>
                        )}

                </div>


                {/* =========================================================
                    SELECTED SCHOOL
                ========================================================= */}

                {selectedSchool && (

                    <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5">

                        <div className="flex items-start gap-4">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-xl text-primary-content">
                                🏫
                            </div>

                            <div className="min-w-0 flex-1">

                                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                                    Selected School
                                </p>

                                <h3 className="mt-1 text-lg font-bold">
                                    {
                                        selectedSchool.name
                                    }
                                </h3>

                                {selectedSchool.eiin && (
                                    <p className="mt-1 text-sm text-base-content/60">
                                        EIIN:{" "}
                                        {
                                            selectedSchool.eiin
                                        }
                                    </p>
                                )}

                                {selectedSchool.address && (
                                    <p className="mt-1 text-sm text-base-content/60">
                                        📍{" "}
                                        {
                                            selectedSchool.address
                                        }
                                    </p>
                                )}

                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedSchool(
                                        null
                                    );

                                    updateField(
                                        "school_id",
                                        ""
                                    );

                                    updateField(
                                        "school_name",
                                        ""
                                    );

                                    updateField(
                                        "school_email",
                                        ""
                                    );

                                    updateField(
                                        "eiin",
                                        ""
                                    );

                                    // updateField(
                                    //     "address",
                                    //     ""
                                    // );

                                    // updateField(
                                    //     "schoolLogo",
                                    //     ""
                                    // );
                                }}
                                className="btn btn-ghost btn-sm"
                            >
                                Change
                            </button>

                        </div>

                    </div>
                )}


                {/* =========================================================
                    CONTINUE
                ========================================================= */}

                <div className="mx-auto mt-8 max-w-md">

                    <button
                        type="button"
                        disabled={!selectedSchool}
                        onClick={handleContinue}
                        className="btn btn-primary w-full rounded-xl"
                    >
                        Continue
                    </button>

                    {!selectedSchool && (
                        <p className="mt-3 text-center text-xs text-base-content/40">
                            Select your school to continue.
                        </p>
                    )}

                </div>


                {/* =========================================================
                    INFORMATION
                ========================================================= */}

                <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-base-300 bg-base-100 p-5">

                    <div className="flex gap-3">

                        <div className="text-lg">
                            🔐
                        </div>

                        <div>

                            <h3 className="text-sm font-semibold">
                                Your access is not granted yet
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-base-content/50">
                                Selecting a school only identifies
                                the school you want to join. After
                                you complete registration, your
                                request will be sent to the school's
                                administrator for approval.
                            </p>

                        </div>

                    </div>

                </div>


                {/* =========================================================
                    DEBUG - REMOVE IN PRODUCTION
                ========================================================= */}

                {/* {import.meta.env.DEV && (
                    <pre className="mt-8 overflow-auto rounded-xl bg-neutral p-4 text-xs text-neutral-content">
                        {JSON.stringify(
                            registrationData,
                            null,
                            2
                        )}
                    </pre>
                )} */}

            </div>

        </div>
    );
}

export default TeacherSchool;