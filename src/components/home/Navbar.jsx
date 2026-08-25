// import { useState } from "react";
// import { Link, NavLink } from "react-router-dom";

// const navItems = [
//   { name: "Home", path: "/" },
//   { name: "Features", path: "/features" },
//   { name: "Pricing", path: "/pricing" },
//   { name: "About", path: "/about" },
//   { name: "Contact", path: "/contact" },
// ];

// function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);

//   // Temporary authentication state.
//   // Later this will come from your Firebase/JWT authentication system.
//   const isAuthenticated = false;

//   const closeMenu = () => {
//     setIsOpen(false);
//   };

//   return (
//     <header className="sticky top-0 z-50 border-b border-base-200 bg-base-100/95 backdrop-blur">
//       <div className="navbar mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

//         {/* Logo */}
//         <div className="navbar-start">
//           <Link
//             to="/"
//             onClick={closeMenu}
//             className="flex items-center gap-3"
//           >
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content shadow-md">
//               <span className="text-lg font-bold">S</span>
//             </div>

//             <div className="hidden sm:block">
//               <h1 className="text-lg font-bold leading-none">
//                 Smart School
//               </h1>
//               <p className="mt-1 text-xs text-base-content/60">
//                 Management Platform
//               </p>
//             </div>
//           </Link>
//         </div>

//         {/* Desktop Navigation */}
//         <div className="navbar-center hidden lg:flex">
//           <nav className="flex items-center gap-1">
//             {navItems.map((item) => (
//               <NavLink
//                 key={item.name}
//                 to={item.path}
//                 className={({ isActive }) =>
//                   `rounded-lg px-4 py-2 text-sm font-medium transition ${
//                     isActive
//                       ? "bg-primary/10 text-primary"
//                       : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
//                   }`
//                 }
//               >
//                 {item.name}
//               </NavLink>
//             ))}
//           </nav>
//         </div>

//         {/* Desktop Actions */}
//         <div className="navbar-end hidden gap-3 lg:flex">
//           {isAuthenticated ? (
//             <>
//               <Link
//                 to="/dashboard"
//                 className="btn btn-primary rounded-xl px-5"
//               >
//                 Dashboard
//               </Link>

//               <button
//                 className="btn btn-outline btn-error rounded-xl"
//                 type="button"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link
//                 to="/login"
//                 className="btn btn-ghost rounded-xl px-5"
//               >
//                 Login
//               </Link>

//               <Link
//                 to="/register"
//                 className="btn btn-primary rounded-xl px-5 shadow-md"
//               >
//                 Get Started
//               </Link>
//             </>
//           )}
//         </div>

//         {/* Mobile Menu Button */}
//         <div className="navbar-end lg:hidden">
//           <button
//             type="button"
//             className="btn btn-ghost btn-square"
//             onClick={() => setIsOpen(!isOpen)}
//             aria-label="Toggle navigation menu"
//             aria-expanded={isOpen}
//           >
//             {isOpen ? (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             ) : (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M4 6h16M4 12h16M4 18h16"
//                 />
//               </svg>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Navigation */}
//       {isOpen && (
//         <div className="border-t border-base-200 bg-base-100 lg:hidden">
//           <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
//             <nav className="flex flex-col gap-1">
//               {navItems.map((item) => (
//                 <NavLink
//                   key={item.name}
//                   to={item.path}
//                   onClick={closeMenu}
//                   className={({ isActive }) =>
//                     `rounded-lg px-4 py-3 text-sm font-medium transition ${
//                       isActive
//                         ? "bg-primary/10 text-primary"
//                         : "text-base-content/70 hover:bg-base-200"
//                     }`
//                   }
//                 >
//                   {item.name}
//                 </NavLink>
//               ))}
//             </nav>

//             <div className="mt-4 flex flex-col gap-2 border-t border-base-200 pt-4">
//               {isAuthenticated ? (
//                 <>
//                   <Link
//                     to="/dashboard"
//                     onClick={closeMenu}
//                     className="btn btn-primary w-full rounded-xl"
//                   >
//                     Dashboard
//                   </Link>

//                   <button
//                     type="button"
//                     className="btn btn-outline btn-error w-full rounded-xl"
//                   >
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <Link
//                     to="/login"
//                     onClick={closeMenu}
//                     className="btn btn-ghost w-full rounded-xl"
//                   >
//                     Login
//                   </Link>

//                   <Link
//                     to="/register"
//                     onClick={closeMenu}
//                     className="btn btn-primary w-full rounded-xl"
//                   >
//                     Get Started
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }

// export default Navbar;

import { useState } from "react";
import { Link } from "react-router-dom";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Features", path: "/#features" },
  { name: "Why Us", path: "/#why-us" },
  { name: "Pricing", path: "/pricing" },
  { name: "About", path: "/#about" },
  { name: "Contact", path: "/#contact" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Temporary authentication state.
  // This will be replaced with your actual Firebase/JWT auth state.
  const isAuthenticated = false;

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleSectionNavigation = () => {
    closeMenu();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-base-200 bg-base-100/95 backdrop-blur">
      <div className="navbar mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <div className="navbar-start">
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content shadow-md">
              <span className="text-lg font-bold">S</span>
            </div>

            <div className="hidden sm:block">
              <h1 className="text-lg font-bold leading-none">
                Smart School
              </h1>

              <p className="mt-1 text-xs text-base-content/60">
                Management Platform
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-center hidden lg:flex">
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                onClick={handleSectionNavigation}
                className="rounded-lg px-4 py-2 text-sm font-medium text-base-content/70 transition-all duration-200 hover:bg-primary/10 hover:text-primary"
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="navbar-end hidden gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="btn btn-primary rounded-xl px-5 shadow-sm"
              >
                Dashboard
              </Link>

              <button
                type="button"
                className="btn btn-outline btn-error rounded-xl"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-ghost rounded-xl px-5"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="btn btn-primary rounded-xl px-5 shadow-md"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="navbar-end lg:hidden">
          <button
            type="button"
            className="btn btn-ghost btn-square"
            onClick={() => setIsOpen((previous) => !previous)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-base-200 bg-base-100 lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">

            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={handleSectionNavigation}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-base-content/70 transition hover:bg-primary/10 hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Authentication Actions */}
            <div className="mt-4 flex flex-col gap-2 border-t border-base-200 pt-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={closeMenu}
                    className="btn btn-primary w-full rounded-xl"
                  >
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={closeMenu}
                    className="btn btn-outline btn-error w-full rounded-xl"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="btn btn-ghost w-full rounded-xl"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="btn btn-primary w-full rounded-xl"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;