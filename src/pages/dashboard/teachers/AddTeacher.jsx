import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api.js";


function AddTeacher() {

    const navigate = useNavigate();


    const [formData, setFormData] = useState({

        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        // employee_id: "",
        gender: "",
        date_of_birth: "",
        designation: "",
        department: "",
        subject: "",
        qualification: "",
        joining_date: "",

    });


    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Handle Input
    |--------------------------------------------------------------------------
    */

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;


        setFormData((previous) => ({

            ...previous,

            [name]: value,

        }));

    };


    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (event) => {

        event.preventDefault();


        setError("");

        setSuccess("");

        setLoading(true);

        // console.log("Submitting form data:", formData
        // );  
        try {

            const response =
                await api.post(
                    "/teachers",
                    formData
                );

            // console.log("Add teacher response:", response.data);
            if (!response.data.success) {

                setError(
                    response.data.message ||
                    "Unable to add teacher."
                );

                return;

            }


            setSuccess(
                "Teacher added successfully."
            );


            /*
            |--------------------------------------------------------------------------
            | Redirect after short delay
            |--------------------------------------------------------------------------
            */

            setTimeout(() => {

                navigate(
                    "/school-admin/teachers"
                );

            }, 1000);


        } catch (error) {

            console.error(
                "Add teacher error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Unable to add teacher."
            );

        } finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Cancel
    |--------------------------------------------------------------------------
    */

    const handleCancel = () => {

        navigate(
            "/school-admin/teachers"
        );

    };


    return (

        <div className="min-h-screen bg-base-200 p-4 sm:p-6 lg:p-8">

            <div className="mx-auto max-w-4xl">

                {/* =========================================================
                    HEADER
                ========================================================= */}

                <div className="mb-8">

                    {/* <button
                        type="button"
                        onClick={handleCancel}
                        className="mb-4 text-sm text-base-content/50 hover:text-primary"
                    >
                        ← Back to Teachers
                    </button> */}


                    <h1 className="text-3xl font-bold">
                        Add Teacher
                    </h1>


                    <p className="mt-2 text-sm text-base-content/60">
                        Add a teacher to your school.
                        The teacher can create an account later
                        using the information provided here.
                    </p>

                </div>


                {/* =========================================================
                    SUCCESS
                ========================================================= */}

                {success && (

                    <div className="alert alert-success mb-6">

                        <span>
                            {success}
                        </span>

                    </div>

                )}


                {/* =========================================================
                    ERROR
                ========================================================= */}

                {error && (

                    <div className="alert alert-error mb-6">

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {/* =========================================================
                    FORM
                ========================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8"
                >

                    {/* =====================================================
                        PERSONAL INFORMATION
                    ===================================================== */}

                    <h2 className="text-xl font-bold">
                        Personal Information
                    </h2>


                    <div className="mt-5 grid gap-5 sm:grid-cols-2">

                        {/* First Name */}

                        <div>

                            <label className="label">

                                <span className="label-text font-semibold">
                                    First Name
                                </span>

                            </label>


                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="First name"
                                className="input input-bordered h-12 w-full rounded-xl"
                                required
                            />

                        </div>


                        {/* Last Name */}

                        <div>

                            <label className="label">

                                <span className="label-text font-semibold">
                                    Last Name
                                </span>

                            </label>


                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Last name"
                                className="input input-bordered h-12 w-full rounded-xl"
                                required
                            />

                        </div>


                        {/* Email */}

                        <div>

                            <label className="label">

                                <span className="label-text font-semibold">
                                    Email
                                </span>

                            </label>


                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="teacher@example.com"
                                className="input input-bordered h-12 w-full rounded-xl"
                                required
                            />

                        </div>


                        {/* Phone */}

                        <div>

                            <label className="label">

                                <span className="label-text font-semibold">
                                    Phone
                                </span>

                            </label>


                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="017XXXXXXXX"
                                className="input input-bordered h-12 w-full rounded-xl"
                                required
                            />

                        </div>


                        {/* Gender */}

                        <div>

                            <label className="label">

                                <span className="label-text font-semibold">
                                    Gender
                                </span>

                            </label>


                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="select select-bordered h-12 w-full rounded-xl"
                                required
                            >

                                <option value="">
                                    Select gender
                                </option>

                                <option value="male">
                                    Male
                                </option>

                                <option value="female">
                                    Female
                                </option>

                                <option value="other">
                                    Other
                                </option>

                            </select>

                        </div>


                        {/* Date of Birth */}

                        <div>

                            <label className="label">

                                <span className="label-text font-semibold">
                                    Date of Birth
                                </span>

                            </label>


                            <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                className="input input-bordered h-12 w-full rounded-xl"
                            />

                        </div>

                    </div>


                    {/* =====================================================
                        PROFESSIONAL INFORMATION
                    ===================================================== */}

                    <div className="mt-10 border-t border-base-300 pt-8">

                        <h2 className="text-xl font-bold">
                            Professional Information
                        </h2>


                        <div className="mt-5 grid gap-5 sm:grid-cols-2">

                            {/* Employee ID */}

                            {/* <div>

                                <label className="label">

                                    <span className="label-text font-semibold">
                                        Employee ID
                                    </span>

                                </label>


                                <input
                                    type="text"
                                    name="employee_id"
                                    value={formData.employee_id}
                                    onChange={handleChange}
                                    placeholder="T-1001"
                                    className="input input-bordered h-12 w-full rounded-xl"
                                    required
                                />

                            </div> */}


                            {/* Designation */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">
                                        Designation
                                    </span>

                                </label>


                                <input
                                    type="text"
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    placeholder="Assistant Teacher"
                                    className="input input-bordered h-12 w-full rounded-xl"
                                />

                            </div>


                            {/* Department */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">
                                        Department
                                    </span>

                                </label>


                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    placeholder="Science"
                                    className="input input-bordered h-12 w-full rounded-xl"
                                />

                            </div>


                            {/* Subject */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">
                                        Subject
                                    </span>

                                </label>


                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="Mathematics"
                                    className="input input-bordered h-12 w-full rounded-xl"
                                />

                            </div>


                            {/* Qualification */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">
                                        Qualification
                                    </span>

                                </label>


                                <input
                                    type="text"
                                    name="qualification"
                                    value={formData.qualification}
                                    onChange={handleChange}
                                    placeholder="M.Sc in Mathematics"
                                    className="input input-bordered h-12 w-full rounded-xl"
                                />

                            </div>


                            {/* Joining Date */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">
                                        Joining Date
                                    </span>

                                </label>


                                <input
                                    type="date"
                                    name="joining_date"
                                    value={formData.joining_date}
                                    onChange={handleChange}
                                    className="input input-bordered h-12 w-full rounded-xl"
                                />

                            </div>

                        </div>

                    </div>


                    {/* =====================================================
                        INFORMATION
                    ===================================================== */}

                    <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-4">

                        <div className="flex gap-3">

                            <div className="text-xl">
                                ℹ️
                            </div>


                            <div>

                                <p className="text-sm font-semibold">
                                    Teacher account
                                </p>


                                <p className="mt-1 text-xs leading-5 text-base-content/60">

                                    This only creates the teacher's
                                    school record. The teacher will
                                    create their Firebase account
                                    separately using the registered
                                    information.

                                </p>

                            </div>

                        </div>

                    </div>


                    {/* =====================================================
                        BUTTONS
                    ===================================================== */}

                    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={loading}
                            className="btn btn-ghost rounded-xl"
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary rounded-xl"
                        >

                            {loading ? (

                                <>
                                    <span className="loading loading-spinner loading-sm" />

                                    Adding Teacher...
                                </>

                            ) : (

                                <>
                                    Add Teacher
                                </>

                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}


export default AddTeacher;

