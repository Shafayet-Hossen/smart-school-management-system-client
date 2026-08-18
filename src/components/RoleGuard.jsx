const RoleGuard = ({ 
    allowedRoles=[], 
    userRole, 
    children,
    fallback = null
}) => {
  if (!allowedRoles.includes(userRole)) {
    return null;
  }

  return children;
};

export default RoleGuard;