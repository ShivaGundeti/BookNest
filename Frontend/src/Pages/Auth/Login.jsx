import React, { useContext, useState } from "react";
import { authAPI, authUtils } from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // 👈 using lucide-react for icons
import { Theme } from "../../Context/ThemeContext/ThemeContext";

const Login = () => {
  const {SwitchTheme} = useContext(Theme)
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // 👈 state for eye toggle
  const navigate = useNavigate();

  // Handle input changes
  const handleInput = (e) => {
    const NewData = { ...formData, [e.target.name]: e.target.value };
    setFormData(NewData);
    setErrors({ ...errors, [e.target.name]: "" }); // clear error while typing
  };

  // Validation function
  const validate = () => {
    let newErrors = {};

    if (!formData.Email.trim()) {
      newErrors.Email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
      newErrors.Email = "Invalid email format";
    }

    if (!formData.Password.trim()) {
      newErrors.Password = "Password is required";
    } else if (formData.Password.length < 6) {
      newErrors.Password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const response = await authAPI.Login(formData);

        // Save token + user data
        authUtils.setAuth(response.data.token, response.data.userData);

        // ✅ Redirect to dashboard
        navigate("/");
      } catch (err) {
        console.error("Login failed:", err);
        setErrors({ Email: "Invalid credentials", Password: " " });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-600 py-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
          📚 BookNest
        </h1>
        <p className="text-white text-sm md:text-base mt-2">
          Your cozy place for books & reviews
        </p>
      </div>

      {/* Form Section */}
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Login
          </h2>

          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleInput}
                className={`mt-1 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 ${
                  errors.Email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } text-black`}
                placeholder="Enter your email"
              />
              {errors.Email && (
                <p className="text-red-500 text-sm mt-1">{errors.Email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="Password"
                  value={formData.Password}
                  onChange={handleInput}
                  className={`mt-1 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 ${
                    errors.Password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  } text-black `}
                  placeholder="Enter your password"
                />
                {/* 👁️ Eye Icon */}
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.Password && (
                <p className="text-red-500 text-sm mt-1">{errors.Password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Login
            </button>

            {/* Register Link */}
            <p className="mt-4 text-sm text-gray-600 text-center">
              Don’t have an account?{" "}
              <a href="/auth/register" className="text-blue-600 hover:underline">
                Register
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
