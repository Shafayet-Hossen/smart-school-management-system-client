import { createContext, useContext, useState } from "react";

const RegistrationContext = createContext(null);

const initialRegistrationData = {
    // Role
    role: "",

    // Personal information
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",


    // Authentication
    password: "",
    confirm_password: "",

    // School information
    school_name: "",
    school_type: "",
    school_email: "",
    school_phone: "",
    eiin: "",
    division: "",
    district: "",
    upazila: "",
    address: "",
    website: "",

    // Existing school
    school_id: "",
    school_code: "",

    // Role-specific information
    student_id: "",
    employee_id: "",
    class_id: "",
    section_id: "",

    // Parent-specific information
    child_student_id: "",
    relationship: "",

    // Verification
    email_verified: false,
    phone_verified: false,

    // Registration status
    status: "draft",

    // Join request
    join_request_id: "",

    // School Admin
    school_created: false,

    // Subscription
    subscription_activated: false,
};

export function RegistrationProvider({ children }) {
    const [registrationData, setRegistrationData] = useState(
        initialRegistrationData
    );

    const updateRegistration = (data) => {
        setRegistrationData((previous) => ({
            ...previous,
            ...data,
        }));
    };

    const updateField = (field, value) => {
        setRegistrationData((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const resetRegistration = () => {
        setRegistrationData(initialRegistrationData);
    };

    const setRole = (role) => {
        setRegistrationData((previous) => ({
            ...previous,
            role,
        }));
    };

    const setSchool = ({ school_id, school_name, school_code }) => {
        setRegistrationData((previous) => ({
            ...previous,
            school_id,
            school_name,
            school_code,
        }));
    };

    const markEmailVerified = () => {
        setRegistrationData((previous) => ({
            ...previous,
            emailVerified: true,
        }));
    };

    return (
        <RegistrationContext.Provider
            value={{
                registrationData,

                updateRegistration,
                updateField,

                setRole,
                setSchool,

                markEmailVerified,

                resetRegistration,
            }}
        >
            {children}
        </RegistrationContext.Provider>
    );
}

export function useRegistration() {
    const context = useContext(RegistrationContext);

    if (!context) {
        throw new Error(
            "useRegistration must be used inside RegistrationProvider"
        );
    }

    return context;
}