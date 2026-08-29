import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api.js";
import { useRegistration } from "../../context/RegistrationContext.jsx";
// import { useAuth } from "../../context/AuthContext.jsx";

function ParentAcademic() {
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
    /*
       |--------------------------------------------------------------------------
       | Child Information
       |--------------------------------------------------------------------------
       */

    const [childFirstName, setChildFirstName] =
        useState(
            registrationData.child_first_name || ""
        );

    const [childLastName, setChildLastName] =
        useState(
            registrationData.child_last_name || ""
        );

    const [studentId, setStudentId] =
        useState(
            registrationData.student_id || ""
        );


    /*
    |--------------------------------------------------------------------------
    | Academic Selection
    |--------------------------------------------------------------------------
    */

    // const [selectedClass, setSelectedClass] =
    //     useState(
    //         registrationData.class_id || ""
    //     );

    // const [selectedSection, setSelectedSection] =
    //     useState(
    //         registrationData.section_id || ""
    //     );

    const [classId, setClassId] = useState(
        registrationData.class_id || ""
    );

    const [sectionId, setSectionId] = useState(
        registrationData.section_id || ""
    );

    // const [rollNumber, setRollNumber] = useState(
    //     registrationData.roll_number || ""
    // );


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
                "/register/parent/school",
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



        const fetchClasses = async () => {

            if (!schoolId) {
                return;
            }

            setLoadingClasses(true);
            setError("");

            try {

                const response =
                    await api.get(
                        `/auth/schools/${schoolId}/classes`,

                    );

                const classList =
                    response.data?.classes || [];

                console.log("ClassList:", classList);

                setClasses(classList);

            } catch (error) {

                setClasses([]);

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

                return;
            }

            setSections([]);
            setLoadingSections(true);
            setError("");
            // console.log("useEffect ClassId", classId)
            try {

                const response =
                    await api.get(
                        `/auth/classes/${classId}/sections`,
                    );



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
            updateField(
                "class_id",
                selectedClass._id ||
                    selectedClass.class_id
            );

            updateField(
                "class_name",
                selectedClass.name ||
                selectedClass.class_name
            );

        } else {

            updateField(
                "class_id",
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

    // const handleRollChange = (event) => {

    //     const value =
    //         event.target.value;

    //     /*
    //     |--------------------------------------------------------------------------
    //     | Allow only numbers
    //     |--------------------------------------------------------------------------
    //     */

    //     if (
    //         value === "" ||
    //         /^[0-9]+$/.test(value)
    //     ) {

    //         setRollNumber(value);

    //     }

    // };


    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = (event) => {

        event.preventDefault();

        setError("");

        if (!childFirstName.trim()) {

            setError(
                "Child's first name is required."
            );

            return;

        }

        if (!studentId.trim()) {

            setError(
                "Student ID or roll number is required."
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | Validate Class
        |--------------------------------------------------------------------------
        */

        if (!classId) {

            setError(
                "Please select your Child class."
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
                "Please select your child section."
            );

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | Validate Roll
        |--------------------------------------------------------------------------
        */

        // if (!rollNumber.trim()) {

        //     setError(
        //         "Please enter your Child roll number."
        //     );

        //     return;
        // }


        /*
        |--------------------------------------------------------------------------
        | Save to Registration Context
        |--------------------------------------------------------------------------
        */
        updateField(
            "child_first_name",
            childFirstName.trim()
        );

        updateField(
            "child_last_name",
            childLastName.trim()
        );

        // updateField(
        //     "roll_number",
        //     rollNumber.trim()
        // );

        updateField(
            "student_id",
            studentId.trim()
        );

        updateField(
            "class_id",
            classId
        );

        updateField(
            "section_id",
            sectionId
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
            "/register/parent/account"
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Back
    |--------------------------------------------------------------------------
    */

    const handleBack = () => {

        navigate(
            "/register/parent/school"
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


                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl shadow-lg">
                        👨‍👩‍👧
                    </div>


                    <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
                        Child's Academic Information
                    </h1>


                    <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-base-content/60 sm:text-base">
                        Tell us which student you are the parent
                        or guardian of so we can send a connection
                        request to the selected school.
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
                                {registrationData.school_name ||
                                    "School selected"}
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
                                    "/register/parent/school"
                                )
                            }
                            className="btn btn-ghost btn-sm"
                        >
                            Change
                        </button>

                    </div>

                </div>


                {/* =========================================================
                    ERROR
                ========================================================= */}

                {error && (

                    <div className="alert alert-error mt-6">

                        <span className="text-sm">
                            {error}
                        </span>

                    </div>

                )}


                {/* =========================================================
                    FORM
                ========================================================= */}

                <div className="mt-6 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">


                    {/* =====================================================
                        CHILD NAME
                    ===================================================== */}

                    <div>

                        <p className="text-sm font-bold">
                            Child Information
                        </p>


                        <p className="mt-1 text-xs text-base-content/50">
                            Enter the name of the student you want
                            to connect with.
                        </p>

                    </div>


                    <div className="mt-5 grid gap-5 sm:grid-cols-2">


                        {/* First Name */}

                        <div>

                            <label
                                htmlFor="child-first-name"
                                className="label"
                            >

                                <span className="label-text font-semibold">
                                    Child's First Name
                                </span>

                            </label>


                            <input
                                id="child-first-name"
                                type="text"
                                value={childFirstName}
                                onChange={(event) =>
                                    setChildFirstName(
                                        event.target.value
                                    )
                                }
                                placeholder="First name"
                                className="input input-bordered h-12 w-full rounded-xl"
                            />

                        </div>


                        {/* Last Name */}

                        <div>

                            <label
                                htmlFor="child-last-name"
                                className="label"
                            >

                                <span className="label-text font-semibold">
                                    Child's Last Name
                                </span>

                            </label>


                            <input
                                id="child-last-name"
                                type="text"
                                value={childLastName}
                                onChange={(event) =>
                                    setChildLastName(
                                        event.target.value
                                    )
                                }
                                placeholder="Last name"
                                className="input input-bordered h-12 w-full rounded-xl"
                            />

                        </div>

                    </div>


                    {/* =====================================================
                        STUDENT ID
                    ===================================================== */}

                    <div className="mt-5">

                        <label
                            htmlFor="student-id"
                            className="label"
                        >

                            <span className="label-text font-semibold">
                                Student ID / Roll Number
                            </span>

                        </label>


                        <input
                            id="student-id"
                            type="text"
                            value={studentId}
                            onChange={(event) =>
                                setStudentId(
                                    event.target.value
                                )
                            }
                            placeholder="Enter student's ID or roll number"
                            className="input input-bordered h-12 w-full rounded-xl"
                        />


                        <p className="mt-2 text-xs text-base-content/50">
                            This helps the school administrator identify
                            your child.
                        </p>

                    </div>


                    {/* =====================================================
                        CLASS
                    ===================================================== */}

                    <div className="mt-6">

                        <label
                            htmlFor="parent-class"
                            className="label"
                        >

                            <span className="label-text font-semibold">
                                Child's Class
                            </span>

                        </label>


                        <select
                            id="parent-class"
                            value={classId}
                            onChange={handleClassChange}
                            disabled={
                                loadingClasses
                            }
                            className="select select-bordered h-12 w-full rounded-xl"
                        >

                            <option value="">

                                {loadingClasses
                                    ? "Loading classes..."
                                    : "Select child's class"}

                            </option>


                            {classes.map(
                                (item) => (

                                    <option
                                        key={item._id}
                                        value={item._id}
                                    >

                                        {item.class_name ||
                                            item.name}

                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* =====================================================
                        SECTION
                    ===================================================== */}

                    <div className="mt-5">

                        <label
                            htmlFor="parent-section"
                            className="label"
                        >

                            <span className="label-text font-semibold">
                                Child's Section
                            </span>

                        </label>


                        <select
                            id="parent-section"
                            value={sectionId}
                            onChange={handleSectionChange}
                            disabled={
                                !classId ||
                                loadingSections
                            }
                            className="select select-bordered h-12 w-full rounded-xl"
                        >

                            <option value="">

                                {!classId
                                    ? "Select class first"
                                    : loadingSections
                                        ? "Loading sections..."
                                        : "Select child's section"}

                            </option>


                            {sections.map(
                                (item) => (

                                    <option
                                        key={item._id}
                                        value={item._id}
                                    >

                                        {item.section_name ||
                                            item.name}

                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* =====================================================
                        INFORMATION NOTE
                    ===================================================== */}

                    <div className="mt-6 rounded-2xl border border-info/20 bg-info/5 p-4">

                        <div className="flex gap-3">

                            <span className="text-lg">
                                ℹ️
                            </span>


                            <div>

                                <p className="text-sm font-semibold">
                                    School verification
                                </p>


                                <p className="mt-1 text-xs leading-5 text-base-content/50">
                                    After you create and verify your account,
                                    your request will be sent to the school
                                    administrator. The administrator must
                                    approve your request before you can access
                                    your child's information.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* =====================================================
                        CONTINUE
                    ===================================================== */}

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={
                            loadingClasses ||
                            loadingSections ||
                            !childFirstName.trim() ||
                            !classId ||
                            !sectionId 
                            // ||
                            // !rollNumber.trim()
                        }
                        className="btn btn-primary mt-8 h-12 w-full rounded-xl"
                    >
                        Continue →
                    </button>

                </div>


                {/* =========================================================
                    FOOTER
                ========================================================= */}

                <p className="mx-auto mt-6 max-w-xl text-center text-xs leading-5 text-base-content/40">
                    Your information will only be used to identify
                    your child and send a connection request to the
                    selected school.
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
    // return (

    //     <div className="min-h-screen bg-base-200 px-4 py-10 sm:py-16">

    //         <div className="mx-auto max-w-3xl">


    //             {/* =========================================================
    //                 HEADER
    //             ========================================================= */}

    //             <div className="text-center">

    //                 <button
    //                     type="button"
    //                     onClick={handleBack}
    //                     className="mb-8 text-sm font-medium text-base-content/50 transition hover:text-primary"
    //                 >
    //                     ← Back
    //                 </button>


    //                 <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl text-primary-content shadow-lg">
    //                     🎓
    //                 </div>


    //                 <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
    //                     Academic Information
    //                 </h1>


    //                 <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-base-content/60 sm:text-base">
    //                     Tell us about your current class
    //                     and academic enrollment.
    //                 </p>

    //             </div>


    //             {/* =========================================================
    //                 PROGRESS
    //             ========================================================= */}

    //             <div className="mx-auto mt-10 max-w-md">

    //                 <div className="flex items-center gap-3">

    //                     <div className="h-2 flex-1 rounded-full bg-primary" />

    //                     <div className="h-2 flex-1 rounded-full bg-primary" />

    //                     <div className="h-2 flex-1 rounded-full bg-primary" />

    //                     <div className="h-2 flex-1 rounded-full bg-base-300" />

    //                 </div>


    //                 <p className="mt-3 text-center text-xs text-base-content/50">
    //                     Step 3 of 4
    //                 </p>

    //             </div>


    //             {/* =========================================================
    //                 SELECTED SCHOOL
    //             ========================================================= */}

    //             <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-5">

    //                 <div className="flex items-center gap-4">

    //                     <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-xl text-primary-content">
    //                         🏫
    //                     </div>


    //                     <div className="min-w-0 flex-1">

    //                         <p className="text-xs font-semibold uppercase tracking-wide text-primary">
    //                             Selected School
    //                         </p>


    //                         <h2 className="mt-1 truncate font-bold">
    //                             {
    //                                 registrationData.school_name ||
    //                                 "School selected"
    //                             }
    //                         </h2>


    //                         {registrationData.eiin && (

    //                             <p className="mt-1 text-xs text-base-content/50">

    //                                 EIIN:{" "}

    //                                 {
    //                                     registrationData.eiin
    //                                 }

    //                             </p>

    //                         )}

    //                     </div>


    //                     <button
    //                         type="button"
    //                         onClick={() =>
    //                             navigate(
    //                                 "/register/student/school"
    //                             )
    //                         }
    //                         className="btn btn-ghost btn-sm"
    //                     >
    //                         Change
    //                     </button>

    //                 </div>

    //             </div>


    //             {/* =========================================================
    //                 FORM
    //             ========================================================= */}

    //             <form
    //                 onSubmit={handleSubmit}
    //                 className="mt-6 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8"
    //             >


    //                 {/* =====================================================
    //                     ERROR
    //                 ===================================================== */}

    //                 {error && (

    //                     <div className="alert alert-error mb-6">

    //                         <span className="text-sm">
    //                             {error}
    //                         </span>

    //                     </div>

    //                 )}


    //                 {/* =====================================================
    //                     CLASS
    //                 ===================================================== */}

    //                 <div>

    //                     <label
    //                         htmlFor="student-class"
    //                         className="label"
    //                     >

    //                         <span className="label-text font-semibold">
    //                             Class
    //                         </span>

    //                     </label>


    //                     <select
    //                         id="student-class"
    //                         value={classId}
    //                         onChange={handleClassChange}
    //                         disabled={
    //                             loadingClasses ||
    //                             !schoolId
    //                         }
    //                         className="select select-bordered h-12 w-full rounded-xl"
    //                     >

    //                         <option value="">
    //                             {
    //                                 loadingClasses
    //                                     ? "Loading classes..."
    //                                     : "Select your class"
    //                             }
    //                         </option>


    //                         {classes.map((item) => {

    //                             const id =
    //                                 item._id
    //                             // ||
    //                             // item.class_code;

    //                             const name =
    //                                 item.name ||
    //                                 item.class_name;

    //                             return (

    //                                 <option
    //                                     key={id}
    //                                     value={id}
    //                                 >
    //                                     {name}
    //                                 </option>

    //                             );

    //                         })}

    //                     </select>


    //                     <p className="mt-2 text-xs text-base-content/50">
    //                         Select the class in which you
    //                         are currently enrolled.
    //                     </p>

    //                 </div>


    //                 {/* =====================================================
    //                     SECTION
    //                 ===================================================== */}

    //                 <div className="mt-6">

    //                     <label
    //                         htmlFor="student-section"
    //                         className="label"
    //                     >

    //                         <span className="label-text font-semibold">
    //                             Section
    //                         </span>

    //                     </label>


    //                     <select
    //                         id="student-section"
    //                         value={sectionId}
    //                         onChange={
    //                             handleSectionChange
    //                         }
    //                         disabled={
    //                             !classId ||
    //                             loadingSections
    //                         }
    //                         className="select select-bordered h-12 w-full rounded-xl"
    //                     >

    //                         <option value="">

    //                             {
    //                                 !classId
    //                                     ? "Select class first"
    //                                     : loadingSections
    //                                         ? "Loading sections..."
    //                                         : "Select your section"
    //                             }

    //                         </option>


    //                         {sections.map((item) => {

    //                             const id =
    //                                 item._id ||
    //                                 item.section_id;

    //                             const name =
    //                                 item.name ||
    //                                 item.section_name;

    //                             return (

    //                                 <option
    //                                     key={id}
    //                                     value={id}
    //                                 >
    //                                     {name}
    //                                 </option>

    //                             );

    //                         })}

    //                     </select>


    //                     <p className="mt-2 text-xs text-base-content/50">
    //                         Select your current section.
    //                     </p>

    //                 </div>


    //                 {/* =====================================================
    //                     ROLL NUMBER
    //                 ===================================================== */}

    //                 <div className="mt-6">

    //                     <label
    //                         htmlFor="student-roll"
    //                         className="label"
    //                     >

    //                         <span className="label-text font-semibold">
    //                             Roll Number
    //                         </span>

    //                     </label>


    //                     <input
    //                         id="student-roll"
    //                         type="text"
    //                         inputMode="numeric"
    //                         value={rollNumber}
    //                         onChange={handleRollChange}
    //                         placeholder="Enter your roll number"
    //                         className="input input-bordered h-12 w-full rounded-xl"
    //                     />


    //                     <p className="mt-2 text-xs text-base-content/50">
    //                         Enter the roll number assigned
    //                         to you by your school.
    //                     </p>

    //                 </div>


    //                 {/* =====================================================
    //                     INFORMATION NOTE
    //                 ===================================================== */}

    //                 <div className="mt-6 rounded-2xl border border-base-300 bg-base-200/50 p-4">

    //                     <div className="flex gap-3">

    //                         <span className="text-lg">
    //                             ℹ️
    //                         </span>


    //                         <div>

    //                             <p className="text-sm font-semibold">
    //                                 Why do we need this?
    //                             </p>


    //                             <p className="mt-1 text-xs leading-5 text-base-content/50">
    //                                 Your academic information
    //                                 helps your school identify
    //                                 your correct class and
    //                                 section. The school can
    //                                 review this information
    //                                 before approving your
    //                                 registration request.
    //                             </p>

    //                         </div>

    //                     </div>

    //                 </div>


    //                 {/* =====================================================
    //                     BUTTON
    //                 ===================================================== */}

    //                 <button
    //                     type="submit"
    //                     disabled={
    //                         loadingClasses ||
    //                         loadingSections ||
    //                         !classId ||
    //                         !sectionId ||
    //                         !rollNumber.trim()
    //                     }
    //                     className="btn btn-primary mt-8 h-12 w-full rounded-xl"
    //                 >
    //                     Continue →
    //                 </button>

    //             </form>


    //             {/* =========================================================
    //                 FOOTER
    //             ========================================================= */}

    //             <p className="mx-auto mt-6 max-w-xl text-center text-xs leading-5 text-base-content/40">
    //                 You can review your academic
    //                 information before completing
    //                 your registration.
    //             </p>


    //             {/* =========================================================
    //                 DEBUG
    //             ========================================================= */}

    //             {import.meta.env.DEV && (

    //                 <pre className="mt-8 overflow-auto rounded-xl bg-neutral p-4 text-xs text-neutral-content">
    //                     {JSON.stringify(
    //                         registrationData,
    //                         null,
    //                         2
    //                     )}
    //                 </pre>

    //             )}

    //         </div>

    //     </div>
    // );
}

export default ParentAcademic;