import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Login = () => {
  const mailreg =
    /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+\-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;
  const passreg =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  const navigate = useNavigate();
  const [logindata, setlogindata] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setlogindata({
      ...logindata,
      [name]: value,
    });

    if (name === "email") {
      setError((prev) => ({
        ...prev,
        email: mailreg.test(value) ? "" : "Invalid email format",
      }));
    }
    if (name === "password") {
      setError((prev) => ({
        ...prev,
        password: passreg.test(value)
          ? ""
          : "Password must be 8+ chars with Uppercase, Lowercase, Number, and Symbol",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mailreg.test(logindata.email) || !passreg.test(logindata.password)) {
      return;
    }

    try {
      const response = await fetch("https://ethara-yhgl.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logindata),
      });
      const data = await response.json();
      if (!response.ok) {
        alert("Login failed");
        return;
      }
      localStorage.setItem("token", data.token);
      alert("Login successful");
      navigate("/home");
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  const invalid =
    !logindata.email ||
    !logindata.password ||
    error.email !== "" ||
    error.password !== "";

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className=" w-screen md:w-[500px] h-[70vh] md:h-[500px]">
        <div className="bg-gray-200 rounded-4xl">
          <div className="flex justify-center items-center flex-col  h-[100px]">
            <h1 className="text-[2rem]">Login form</h1>
            <p className="text-[1.2rem]">Enter your credentials</p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center gap-14  h-[400px]"
          >
            <div className=" w-full flex justify-center flex-col items-center">
              <input
                type="email"
                name="email"
                className="border border-gray-600 h-[2.4rem] w-[80%]"
                placeholder="Enter Your Email"
                value={logindata.email}
                onChange={handleChange}
                required
              />
              <span className="h-[1rem] text-red-500 text-[.8rem] w-full text-center ">
                {error.email}
              </span>
            </div>

            <div className="w-full flex justify-center flex-col items-center">
              <input
                type="password"
                name="password"
                className="border border-gray-600 h-[2.4rem] w-[80%]"
                placeholder="Enter Your password"
                value={logindata.password}
                onChange={handleChange}
                required
              />
              <span className="h-[1rem] text-red-500 text-[.8rem] w-full text-center ">
                {error.password}
              </span>
            </div>

            <button
              type="submit"
              disabled={invalid}
              className={`h-[2.4rem] w-[100px] ${invalid ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
            >
              Login
            </button>

            <p className="">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-400">
                Create
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
