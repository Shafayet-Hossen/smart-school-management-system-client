import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api.js";
import { useRegistration } from "../../context/RegistrationContext.jsx";
// import { useAuth } from "../../context/AuthContext.jsx";

function StudentAcademic() {
    const navigate = useNavigate();
    // const {loading, setLoading} = useAuth();
    const {
        registrationData,
        updateField,
    } = useRegistration();
    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);

    const [loadingClasses, setLoadingClasses] =
        useState(false);

    const [loadingSections, setLoadingSections] =
        useState(false);

    const [error, setError] = useState("");

    const [classId, setClassId] = useState(
        registrationData.class_id || ""
    );

    const [sectionId, setSectionId] = useState(
        registrationData.section_id || ""
    );

    const [rollNumber, setRollNumber] = useState(
        registrationData.roll_number || ""
    );


    /*
    |--------------------------------------------------------------------------
    | School ID
    |--------------------------------------------------------------------------
    */

    const schoolId =
        registrationData.school_id;


    /*
    |--------------------------------------------------------------------------
    | Check School
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!schoolId) {

            navigate(
                "/register/student/school",
                {
                    replace: true,
                }
            );

        }

    }, [schoolId, navigate]);


    /*
    |--------------------------------------------------------------------------
    | Load Classes
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!schoolId) {
            return;
        }

        const fetchClasses = async () => {

            setLoadingClasses(true);
            setError("");

            try {

                const response =
                    await api.get(
                        `/auth/schools/${schoolId}/classes`,

                    );

                /*
                |--------------------------------------------------------------------------
                | Expected response
                |--------------------------------------------------------------------------
                |
                | {
                |   success: true,
                |   classes: [...]
                | }
                |
                */

                const classList =
                    response.data?.classes || [];

                console.log("ClassList:", classList);

                setClasses(classList);

            } catch (error) {

                console.error(
                    "Failed to load classes:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load classes for this school."
                );

            } finally {

                setLoadingClasses(false);

            }

        };

        fetchClasses();

    }, [schoolId]);


    /*
    |--------------------------------------------------------------------------
    | Load Sections
    |--------------------------------------------------------------------------
    */

    useEffect(() => {



        const fetchSections = async () => {
            if (!classId) {
                setSections([]);
                return;
            }

            setLoadingSections(true);
            setError("");
            // console.log("useEffect ClassId", classId)
            try {

                const response =
                    await api.get(
                        `/auth/classes/${classId}/sections`,
                    );

                /*
                |--------------------------------------------------------------------------
                | Expected response
                |--------------------------------------------------------------------------
                |
                | {
                |   success: true,
                |   sections: [...]
                | }
                |
                */

                const sectionList =
                    response.data?.sections || [];

                console.log("sections:", sectionList)
                setSections(sectionList);

            } catch (error) {

                console.error(
                    "Failed to load sections:",
                    error
                );

                setSections([]);

                setError(
                    error.response?.data?.message ||
                    "Unable to load sections for this class."
                );

            } finally {

                setLoadingSections(false);

            }

        };

        fetchSections();

    }, [classId]);


    /*
    |--------------------------------------------------------------------------
    | Class Change
    |--------------------------------------------------------------------------
    */

    const handleClassChange = (event) => {

        const selectedClassId =
            event.target.value;

        setClassId(selectedClassId);

        console.log("ClassId: ", selectedClassId);

        /*
        |--------------------------------------------------------------------------
        | Reset section when class changes
        |--------------------------------------------------------------------------
        */

        setSectionId("");

        updateField(
            "section_id",
            ""
        );

        updateField(
            "section_name",
            ""
        );


        /*
        |--------------------------------------------------------------------------
        | Find selected class
        |--------------------------------------------------------------------------
        */

        const selectedClass =
            classes.find(
                (item) =>
                    String(item._id) ===
                    String(selectedClassId) ||
                    String(item.class_code) ===
                    String(selectedClassId)
            );


        if (selectedClass) {

            updateField(
                "class_code",
                selectedClass.class_code
                // ||
                // selectedClass.class_id
            );
            // updateField(
            //     "class_id",
            //     selectedClass._id ||
            //         selectedClass.class_id
            // );

            updateField(
                "class_name",
                selectedClass.name ||
                selectedClass.class_name
            );

        } else {

            updateField(
                "class_code",
                selectedClassId
            );

            updateField(
                "class_name",
                ""
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Section Change
    |--------------------------------------------------------------------------
    */

    const handleSectionChange = (event) => {

        const selectedSectionId =
            event.target.value;

        setSectionId(
            selectedSectionId
        );


        const selectedSection =
            sections.find(
                (item) =>
                    String(item.section_code) ===
                    String(selectedSectionId) ||
                    String(item.section_id) ===
                    String(selectedSectionId)
            );


        if (selectedSection) {

            updateField(
                "section_id",
                selectedSection._id ||
                selectedSection.section_id
            );

            updateField(
                "section_code",
                selectedSection.section_code ||
                selectedSection.section_id
            );

            updateField(
                "section_name",
                selectedSection.name ||
                selectedSection.section_name
            );

        } else {

            updateField(
                "section_id",
                selectedSectionId
            );

            updateField(
                "section_name",
                ""
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Roll Number
    |--------------------------------------------------------------------------
    */

    const handleRollChange = (event) => {

        const value =
            event.target.value;

        /*
        |--------------------------------------------------------------------------
        | Allow only numbers
        |--------------------------------------------------------------------------
        */

        if (
            value === "" ||
            /^[0-9]+$/.test(value)
        ) {

            setRollNumber(value);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = (event) => {

        event.preventDefault();

        setError("");


        /*
        |--------------------------------------------------------------------------
        | Validate Class
        |--------------------------------------------------------------------------
        */

        if (!classId) {

            setError(
                "Please select your class."
            );

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | Validate Section
        |--------------------------------------------------------------------------
        */

        if (!sectionId) {

            setError(
                "Please select your section."
            );

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | Validate Roll
        |--------------------------------------------------------------------------
        */

        if (!rollNumber.trim()) {

            setError(
                "Please enter your roll number."
            );

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | Save to Registration Context
        |--------------------------------------------------------------------------
        */

        updateField(
            "roll_number",
            rollNumber.trim()
        );


        updateField(
            "status",
            "academic_information_completed"
        );


        /*
        |--------------------------------------------------------------------------
        | Continue
        |--------------------------------------------------------------------------
        */

        navigate(
            "/register/student/account"
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Back
    |--------------------------------------------------------------------------
    */

    const handleBack = () => {

        navigate(
            "/register/student/school"
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (

        <div className="min-h-screen bg-base-200 px-4 py-10 sm:py-16">

            <div className="mx-auto max-w-3xl">


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


                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl text-primary-content shadow-lg">
                        🎓
                    </div>


                    <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
                        Academic Information
                    </h1>


                    <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-base-content/60 sm:text-base">
                        Tell us about your current class
                        and academic enrollment.
                    </p>

                </div>


                {/* =========================================================
                    PROGRESS
                ========================================================= */}

                <div className="mx-auto mt-10 max-w-md">

                    <div className="flex items-center gap-3">

                        <div className="h-2 flex-1 rounded-full bg-primary" />

                        <div className="h-2 flex-1 rounded-full bg-primary" />

                        <div className="h-2 flex-1 rounded-full bg-primary" />

                        <div className="h-2 flex-1 rounded-full bg-primary" />

                        <div className="h-2 flex-1 rounded-full bg-base-300" />

                    </div>


                    <p className="mt-3 text-center text-xs text-base-content/50">
                        Step 4 of 5
                    </p>

                </div>


                {/* =========================================================
                    SELECTED SCHOOL
                ========================================================= */}

                <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-5">

                    <div className="flex items-center gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-xl text-primary-content">
                            🏫
                        </div>


                        <div className="min-w-0 flex-1">

                            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                                Selected School
                            </p>


                            <h2 className="mt-1 truncate font-bold">
                                {
                                    registrationData.school_name ||
                                    "School selected"
                                }
                            </h2>


                            {registrationData.eiin && (

                                <p className="mt-1 text-xs text-base-content/50">

                                    EIIN:{" "}

                                    {
                                        registrationData.eiin
                                    }

                                </p>

                            )}

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/register/student/school"
                                )
                            }
                            className="btn btn-ghost btn-sm"
                        >
                            Change
                        </button>

                    </div>

                </div>


                {/* =========================================================
                    FORM
                ========================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8"
                >


                    {/* =====================================================
                        ERROR
                    ===================================================== */}

                    {error && (

                        <div className="alert alert-error mb-6">

                            <span className="text-sm">
                                {error}
                            </span>

                        </div>

                    )}


                    {/* =====================================================
                        CLASS
                    ===================================================== */}

                    <div>

                        <label
                            htmlFor="student-class"
                            className="label"
                        >

                            <span className="label-text font-semibold">
                                Class
                            </span>

                        </label>


                        <select
                            id="student-class"
                            value={classId}
                            onChange={handleClassChange}
                            disabled={
                                loadingClasses ||
                                !schoolId
                            }
                            className="select select-bordered h-12 w-full rounded-xl"
                        >

                            <option value="">
                                {
                                    loadingClasses
                                        ? "Loading classes..."
                                        : "Select your class"
                                }
                            </option>


                            {classes.map((item) => {

                                const id =
                                    item._id
                                // ||
                                // item.class_code;

                                const name =
                                    item.name ||
                                    item.class_name;

                                return (

                                    <option
                                        key={id}
                                        value={id}
                                    >
                                        {name}
                                    </option>

                                );

                            })}

                        </select>


                        <p className="mt-2 text-xs text-base-content/50">
                            Select the class in which you
                            are currently enrolled.
                        </p>

                    </div>


                    {/* =====================================================
                        SECTION
                    ===================================================== */}

                    <div className="mt-6">

                        <label
                            htmlFor="student-section"
                            className="label"
                        >

                            <span className="label-text font-semibold">
                                Section
                            </span>

                        </label>


                        <select
                            id="student-section"
                            value={sectionId}
                            onChange={
                                handleSectionChange
                            }
                            disabled={
                                !classId ||
                                loadingSections
                            }
                            className="select select-bordered h-12 w-full rounded-xl"
                        >

                            <option value="">

                                {
                                    !classId
                                        ? "Select class first"
                                        : loadingSections
                                            ? "Loading sections..."
                                            : "Select your section"
                                }

                            </option>


                            {sections.map((item) => {

                                const id =
                                    item._id ||
                                    item.section_id;

                                const name =
                                    item.name ||
                                    item.section_name;

                                return (

                                    <option
                                        key={id}
                                        value={id}
                                    >
                                        {name}
                                    </option>

                                );

                            })}

                        </select>


                        <p className="mt-2 text-xs text-base-content/50">
                            Select your current section.
                        </p>

                    </div>


                    {/* =====================================================
                        ROLL NUMBER
                    ===================================================== */}

                    <div className="mt-6">

                        <label
                            htmlFor="student-roll"
                            className="label"
                        >

                            <span className="label-text font-semibold">
                                Roll Number
                            </span>

                        </label>


                        <input
                            id="student-roll"
                            type="text"
                            inputMode="numeric"
                            value={rollNumber}
                            onChange={handleRollChange}
                            placeholder="Enter your roll number"
                            className="input input-bordered h-12 w-full rounded-xl"
                        />


                        <p className="mt-2 text-xs text-base-content/50">
                            Enter the roll number assigned
                            to you by your school.
                        </p>

                    </div>


                    {/* =====================================================
                        INFORMATION NOTE
                    ===================================================== */}

                    <div className="mt-6 rounded-2xl border border-base-300 bg-base-200/50 p-4">

                        <div className="flex gap-3">

                            <span className="text-lg">
                                ℹ️
                            </span>


                            <div>

                                <p className="text-sm font-semibold">
                                    Why do we need this?
                                </p>


                                <p className="mt-1 text-xs leading-5 text-base-content/50">
                                    Your academic information
                                    helps your school identify
                                    your correct class and
                                    section. The school can
                                    review this information
                                    before approving your
                                    registration request.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* =====================================================
                        BUTTON
                    ===================================================== */}

                    <button
                        type="submit"
                        disabled={
                            loadingClasses ||
                            loadingSections ||
                            !classId ||
                            !sectionId ||
                            !rollNumber.trim()
                        }
                        className="btn btn-primary mt-8 h-12 w-full rounded-xl"
                    >
                        Continue →
                    </button>

                </form>


                {/* =========================================================
                    FOOTER
                ========================================================= */}

                <p className="mx-auto mt-6 max-w-xl text-center text-xs leading-5 text-base-content/40">
                    You can review your academic
                    information before completing
                    your registration.
                </p>


                {/* =========================================================
                    DEBUG
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

export default StudentAcademic;