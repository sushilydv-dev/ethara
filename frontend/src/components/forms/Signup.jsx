import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Signup = () => {
  const namereg = /^[A-Za-z ]{3,50}$/;
  const userreg = /^(?=.*[a-zA-Z])[a-zA-Z0-9_]{3,20}$/;
  const mailreg =
    /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+\-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;
  const passreg =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  const navigate = useNavigate();

  const [signupdata, setsignupdata] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setsignupdata({
      ...signupdata,
      [name]: value,
    });

    if (name === "fullname") {
      setError((prev) => ({
        ...prev,
        fullname: namereg.test(value)
          ? ""
          : "Full name should contain only letters and spaces",
      }));
    }

    if (name === "username") {
      setError((prev) => ({
        ...prev,
        username: userreg.test(value)
          ? ""
          : "Username should be of length 3-20 chars and contain letters",
      }));
    }

    if (name === "email") {
      setError((prev) => ({
        ...prev,
        email: mailreg.test(value) ? "" : "invaild gmail",
      }));
    }

    if (name === "password") {
      setError((prev) => ({
        ...prev,
        password: passreg.test(value)
          ? ""
          : "Password must contain 8+ letters with Uppercase, Lowercase, Number, and Symbol",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !namereg.test(signupdata.fullname) ||
      !userreg.test(signupdata.username) ||
      !mailreg.test(signupdata.email) ||
      !passreg.test(signupdata.password)
    ) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupdata),
      });

      const data = await response.json();

      if (!response.ok) {
        alert("Signup failed");
        return;
      }

      localStorage.setItem("token", data.token);
      alert("Signup successful");
      navigate("/home");
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  const invalid =
    !signupdata.fullname ||
    !signupdata.username ||
    !signupdata.email ||
    !signupdata.password ||
    error.fullname !== "" ||
    error.username !== "" ||
    error.email !== "" ||
    error.password !== "";

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-screen md:w-[500px] h-[85vh] md:h-[700px]">
        <div className="bg-gray-200 rounded-4xl">
          <div className="flex justify-center items-center flex-col h-[100px]">
            <h1 className="text-[2rem]">Signup form</h1>
            <p className="text-[1.2rem]">Create your account</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center gap-10 h-[580px]"
          >
            <div className="w-full flex justify-center flex-col items-center">
              <input
                type="text"
                name="fullname"
                className="border border-gray-600 h-[2.4rem] w-[80%]"
                placeholder="Enter Your Full Name"
                value={signupdata.fullname}
                onChange={handleChange}
                required
              />

              <span className="h-[1rem] text-red-500 text-[.8rem] w-full text-center">
                {error.fullname}
              </span>
            </div>

            <div className="w-full flex justify-center flex-col items-center">
              <input
                type="text"
                name="username"
                className="border border-gray-600 h-[2.4rem] w-[80%]"
                placeholder="Enter Your Username"
                value={signupdata.username}
                onChange={handleChange}
                required
              />

              <span className="h-[1rem] text-red-500 text-[.8rem] w-full text-center">
                {error.username}
              </span>
            </div>

            <div className="w-full flex justify-center flex-col items-center">
              <input
                type="email"
                name="email"
                className="border border-gray-600 h-[2.4rem] w-[80%]"
                placeholder="Enter Your Email"
                value={signupdata.email}
                onChange={handleChange}
                required
              />

              <span className="h-[1rem] text-red-500 text-[.8rem] w-full text-center">
                {error.email}
              </span>
            </div>

            <div className="w-full flex justify-center flex-col items-center">
              <input
                type="password"
                name="password"
                className="border border-gray-600 h-[2.4rem] w-[80%]"
                placeholder="Enter Your Password"
                value={signupdata.password}
                onChange={handleChange}
                required
              />

              <span className="h-[1rem] text-red-500 text-[.8rem] w-full text-center">
                {error.password}
              </span>
            </div>

            <button
              type="submit"
              disabled={invalid}
              className={`h-[2.4rem] w-[100px] ${
                invalid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Signup
            </button>

            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
