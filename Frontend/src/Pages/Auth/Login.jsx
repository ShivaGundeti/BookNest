import React, { useContext, useState } from "react";
import { authAPI, authUtils } from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Theme } from "../../Context/ThemeContext/ThemeContext";

const Login = () => {
  const { SwitchTheme } = useContext(Theme);
  const [formData, setFormData] = useState({ Email: "", Password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInput = (e) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    setFormData(updated);
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const response = await authAPI.Login(formData);
      authUtils.setAuth(response.data.token, response.data.userData);
      navigate("/");
    } catch (err) {
      const msg =
        err.response?.data ||
        "Something went wrong. Please try again later.";
      if (
        msg === "User Not Found" ||
        msg === "Password Not matched" ||
        msg === "Please Fill All fields" ||
        msg === "User Already Exist"
      ) {
        setServerError(msg);
      } else {
        setServerError("Invalid email or password.");
      }
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        SwitchTheme === "dark" ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className="bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-600 py-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
          📚 BookNest
        </h1>
        <p className="text-white text-sm md:text-base mt-2">
          Your cozy place for books & reviews
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        <div
          className={`w-full max-w-md ${
            SwitchTheme === "dark" ? "bg-gray-800 text-white" : "bg-white"
          } rounded-2xl shadow-xl p-6`}
        >
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

          {serverError && (
            <div className="mb-4 text-center text-red-500 font-medium">
              {serverError}
            </div>
          )}

          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleInput}
                className={`w-full rounded-lg border p-2 focus:outline-none focus:ring-2 ${
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

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="Password"
                  value={formData.Password}
                  onChange={handleInput}
                  className={`w-full rounded-lg border p-2 focus:outline-none focus:ring-2 ${
                    errors.Password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  } text-black`}
                  placeholder="Enter your password"
                />
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

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Login
            </button>

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
