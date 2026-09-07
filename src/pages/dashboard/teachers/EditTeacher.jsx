import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../../services/api.js";


function EditTeacher() {

    const { teacherId } = useParams();

    const navigate = useNavigate();


    const [formData, setFormData] = useState({

        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        gender: "",
        date_of_birth: "",
        nid: "",
        address: "",

        employee_id: "",
        designation: "",
        department: "",
        subject: "",
        joining_date: "",
        employment_type: "",

        status: "active",

    });


    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Load Teacher
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        let cancelled = false;


        const loadTeacher = async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await api.get(
                        `/teachers/${teacherId}`
                    );


                if (cancelled) {
                    return;
                }


                if (!response.data.success) {

                    setError(
                        response.data.message ||
                        "Unable to load teacher."
                    );

                    return;

                }


                const teacher =
                    response.data.data;


                setFormData({

                    first_name:
                        teacher.first_name || "",

                    last_name:
                        teacher.last_name || "",

                    email:
                        teacher.email || "",

                    phone:
                        teacher.phone || "",

                    gender:
                        teacher.gender || "",

                    date_of_birth:
                        formatDateForInput(
                            teacher.date_of_birth
                        ),

                    nid:
                        teacher.nid || "",

                    address:
                        teacher.address || "",


                    employee_id:
                        teacher.employee_id || "",

                    designation:
                        teacher.designation || "",

                    department:
                        teacher.department || "",

                    subject:
                        teacher.subject || "",

                    joining_date:
                        formatDateForInput(
                            teacher.joining_date
                        ),

                    employment_type:
                        teacher.employment_type || "",

                    status:
                        teacher.status || "active",

                });

            } catch (error) {

                if (cancelled) {
                    return;
                }


                console.error(
                    "Load teacher error:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Unable to load teacher."
                );

            } finally {

                if (!cancelled) {

                    setLoading(false);

                }

            }

        };


        if (teacherId) {

            loadTeacher();

        }


        return () => {

            cancelled = true;

        };

    }, [teacherId]);


    /*
    |--------------------------------------------------------------------------
    | Handle Input
    |--------------------------------------------------------------------------
    */

    const handleChange = (
        event
    ) => {

        const {
            name,
            value
        } = event.target;


        setFormData(
            previous => ({

                ...previous,

                [name]: value,

            })
        );


        setError("");

        setSuccess("");

    };


    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        setError("");

        setSuccess("");


        /*
        |----------------------------------------------------------------------
        | Basic Validation
        |----------------------------------------------------------------------
        */

        if (
            !formData.first_name.trim()
        ) {

            setError(
                "First name is required."
            );

            return;

        }


        if (
            !formData.last_name.trim()
        ) {

            setError(
                "Last name is required."
            );

            return;

        }


        if (
            !formData.email.trim()
        ) {

            setError(
                "Email address is required."
            );

            return;

        }


        // if (
        //     !formData.employee_id.trim()
        // ) {

        //     setError(
        //         "Employee ID is required."
        //     );

        //     return;

        // }


        try {

            setSaving(true);


            /*
            |------------------------------------------------------------------
            | Update Teacher
            |------------------------------------------------------------------
            */

            const response =
                await api.put(
                    `/teachers/${teacherId}`,
                    formData
                );

            console.log(
                "Update teacher response:",
                response.data
            );
            if (!response.data.success) {

                setError(
                    response.data.message ||
                    "Unable to update teacher."
                );

                return;

            }


            setSuccess(
                "Teacher information updated successfully."
            );


            /*
            |------------------------------------------------------------------
            | Go back to teacher profile
            |------------------------------------------------------------------
            */

            setTimeout(() => {

                navigate(
                    `/teachers/${teacherId}`
                );

            }, 800);

        } catch (error) {

            console.error(
                "Update teacher error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Unable to update teacher."
            );

        } finally {

            setSaving(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Cancel
    |--------------------------------------------------------------------------
    */

    const handleCancel = () => {

        navigate(
            `/teachers/${teacherId}`
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="min-h-screen bg-base-200">

                <div className="flex min-h-screen items-center justify-center">

                    <div className="flex flex-col items-center gap-4">

                        <span className="loading loading-spinner loading-lg text-primary" />

                        <p className="text-sm text-base-content/50">
                            Loading teacher...
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

    return (

        <div className="min-h-screen bg-base-200 p-4 sm:p-6 lg:p-8">

            <div className="mx-auto max-w-5xl">


                {/* =========================================================
                    HEADER
                ========================================================= */}

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <button
                            type="button"
                            onClick={handleCancel}
                            className="mb-3 text-sm text-base-content/50 hover:text-primary"
                        >
                            ← Back to Teacher Profile
                        </button>


                        <h1 className="text-2xl font-bold sm:text-3xl">
                            Edit Teacher
                        </h1>


                        <p className="mt-1 text-sm text-base-content/60">
                            Update teacher information.
                        </p>

                    </div>

                </div>


                {/* =========================================================
                    FORM
                ========================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="rounded-3xl border border-base-300 bg-base-100 shadow-sm"
                >


                    {/* =====================================================
                        ERROR
                    ===================================================== */}

                    {error && (

                        <div className="m-6 alert alert-error">

                            <span>
                                {error}
                            </span>

                        </div>

                    )}


                    {/* =====================================================
                        SUCCESS
                    ===================================================== */}

                    {success && (

                        <div className="m-6 alert alert-success">

                            <span>
                                {success}
                            </span>

                        </div>

                    )}


                    {/* =====================================================
                        PERSONAL INFORMATION
                    ===================================================== */}

                    <section className="p-6 sm:p-8">

                        <SectionTitle
                            icon="👤"
                            title="Personal Information"
                        />


                        <div className="mt-6 grid gap-5 sm:grid-cols-2">

                            <InputField
                                label="First Name"
                                name="first_name"
                                value={
                                    formData.first_name
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />


                            <InputField
                                label="Last Name"
                                name="last_name"
                                value={
                                    formData.last_name
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />


                            <InputField
                                label="Email Address"
                                name="email"
                                type="email"
                                value={
                                    formData.email
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />


                            <InputField
                                label="Phone Number"
                                name="phone"
                                value={
                                    formData.phone
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <SelectField
                                label="Gender"
                                name="gender"
                                value={
                                    formData.gender
                                }
                                onChange={
                                    handleChange
                                }
                                options={[
                                    {
                                        value: "male",
                                        label: "Male",
                                    },
                                    {
                                        value: "female",
                                        label: "Female",
                                    },
                                    {
                                        value: "other",
                                        label: "Other",
                                    },
                                ]}
                            />


                            <InputField
                                label="Date of Birth"
                                name="date_of_birth"
                                type="date"
                                value={
                                    formData.date_of_birth
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <InputField
                                label="National ID"
                                name="nid"
                                value={
                                    formData.nid
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <div className="sm:col-span-2">

                                <label className="label">

                                    <span className="label-text font-semibold">
                                        Address
                                    </span>

                                </label>


                                <textarea
                                    name="address"
                                    value={
                                        formData.address
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows="3"
                                    className="textarea textarea-bordered w-full rounded-xl"
                                    placeholder="Enter teacher address"
                                />

                            </div>

                        </div>

                    </section>


                    <div className="divider mx-6 sm:mx-8" />


                    {/* =====================================================
                        PROFESSIONAL INFORMATION
                    ===================================================== */}

                    <section className="p-6 sm:p-8">

                        <SectionTitle
                            icon="🏫"
                            title="Professional Information"
                        />


                        <div className="mt-6 grid gap-5 sm:grid-cols-2">

                            <InputField
                                label="Employee ID"
                                name="employee_id"
                                value={
                                    formData.employee_id
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />


                            <InputField
                                label="Designation"
                                name="designation"
                                value={
                                    formData.designation
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <InputField
                                label="Department"
                                name="department"
                                value={
                                    formData.department
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <InputField
                                label="Subject"
                                name="subject"
                                value={
                                    formData.subject
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <InputField
                                label="Joining Date"
                                name="joining_date"
                                type="date"
                                value={
                                    formData.joining_date
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <SelectField
                                label="Employment Type"
                                name="employment_type"
                                value={
                                    formData.employment_type
                                }
                                onChange={
                                    handleChange
                                }
                                options={[
                                    {
                                        value: "full_time",
                                        label: "Full Time",
                                    },
                                    {
                                        value: "part_time",
                                        label: "Part Time",
                                    },
                                    {
                                        value: "contract",
                                        label: "Contract",
                                    },
                                    {
                                        value: "temporary",
                                        label: "Temporary",
                                    },
                                ]}
                            />


                            <SelectField
                                label="Status"
                                name="status"
                                value={
                                    formData.status
                                }
                                onChange={
                                    handleChange
                                }
                                options={[
                                    {
                                        value: "active",
                                        label: "Active",
                                    },
                                    {
                                        value: "inactive",
                                        label: "Inactive",
                                    },
                                    {
                                        value: "suspended",
                                        label: "Suspended",
                                    },
                                    {
                                        value: "invited",
                                        label: "Invited",
                                    },
                                ]}
                            />

                        </div>

                    </section>


                    {/* =====================================================
                        ACTIONS
                    ===================================================== */}

                    <div className="border-t border-base-300 bg-base-200/50 p-6">

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                onClick={
                                    handleCancel
                                }
                                disabled={saving}
                                className="btn btn-ghost rounded-xl"
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                disabled={saving}
                                className="btn btn-primary rounded-xl"
                            >

                                {saving ? (

                                    <>
                                        <span className="loading loading-spinner loading-sm" />

                                        Saving...
                                    </>

                                ) : (

                                    <>
                                        💾 Save Changes
                                    </>

                                )}

                            </button>

                        </div>

                    </div>

                </form>

            </div>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Section Title
|--------------------------------------------------------------------------
*/

function SectionTitle({
    icon,
    title,
}) {

    return (

        <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                {icon}
            </div>


            <h2 className="text-lg font-bold">
                {title}
            </h2>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Input Field
|--------------------------------------------------------------------------
*/

function InputField({
    label,
    name,
    type = "text",
    value,
    onChange,
    required = false,
}) {

    return (

        <div>

            <label
                htmlFor={name}
                className="label"
            >

                <span className="label-text font-semibold">
                    {label}
                </span>

            </label>


            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                className="input input-bordered h-12 w-full rounded-xl"
            />

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Select Field
|--------------------------------------------------------------------------
*/

function SelectField({
    label,
    name,
    value,
    onChange,
    options = [],
}) {

    return (

        <div>

            <label
                htmlFor={name}
                className="label"
            >

                <span className="label-text font-semibold">
                    {label}
                </span>

            </label>


            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className="select select-bordered h-12 w-full rounded-xl"
            >

                <option value="">
                    Select {label}
                </option>


                {options.map(
                    (option) => (

                        <option
                            key={
                                option.value
                            }
                            value={
                                option.value
                            }
                        >
                            {
                                option.label
                            }
                        </option>

                    )
                )}

            </select>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Format Date For Input
|--------------------------------------------------------------------------
*/

function formatDateForInput(
    value
) {

    if (!value) {
        return "";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return date
        .toISOString()
        .split("T")[0];

}


export default EditTeacher;
