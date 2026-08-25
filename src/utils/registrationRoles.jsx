export const REGISTRATION_ROLES = {
  SCHOOL_ADMIN: "school_admin",
  TEACHER: "teacher",
  STUDENT: "student",
  PARENT: "parent",
};

export const ROLE_LABELS = {
  school_admin: "School Admin",
  teacher: "Teacher",
  student: "Student",
  parent: "Parent",
};

export const ROLE_ROUTES = {
  school_admin: "/register/school_admin",
  teacher: "/register/teacher",
  student: "/register/student",
  parent: "/register/parent",
};

export const getRoleLabel = (role) => {
  return ROLE_LABELS[role] || "User";
};