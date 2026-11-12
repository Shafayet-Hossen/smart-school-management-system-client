const RoleGuard = ({ 
    allowedRoles=[], 
    userRole, 
    children,
    fallback = null
}) => {
  
  if (!allowedRoles.includes(userRole)) {
    return fallback;
  }

  return children;
};

export default RoleGuard;