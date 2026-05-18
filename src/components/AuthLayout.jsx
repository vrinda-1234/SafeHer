import logo from "../assests/logo.png";
const AuthLayout = ({ title, subtitle, children }) => {
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 relative">
  
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={logo} alt="SafeHer Logo" className="h-28 w-auto" />
          </div>
  
          {/* Heading */}
          <h2 className="text-3xl font-bold text-purple-900 text-center mb-2">
            {title}
          </h2>
          <p className="text-gray-600 text-center mb-6">
            {subtitle}
          </p>
  
          {/* Form */}
          {children}
  
          {/* Trust Note */}
          <p className="text-xs text-gray-500 text-center mt-6">
            🔒 Your data is encrypted & never shared
          </p>
        </div>
      </div>
    );
  };
  
  export default AuthLayout;
  