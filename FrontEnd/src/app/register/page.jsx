"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from 'axios';
import loadingGif from "../../../public/images/loading.gif"; 
import LoginForm from "@/components/LoginForm";

const Register = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [studentId, setStudentId] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [showEmail, setShowEmail] = useState(true);
    const [showName, setShowName] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [emailPlaceholder, setEmailPlaceholder] = useState("email");
    const [namePlaceholder, setNamePlaceholder] = useState("name");
    const [surnamePlaceholder, setSurnamePlaceholder] = useState("surname");
    const [studentIdPlaceholder, setStudentIdPlaceholder] = useState("university student id");
    const [passwordPlaceholder, setPasswordPlaceholder] = useState("password");
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        password_confirmation: "",
        name: "",
        surname: "",
        university_id: "",
    });
    useEffect(() => {
        
        setNamePlaceholder("name");
        setSurnamePlaceholder('surname')
        setStudentIdPlaceholder('student id')
    }, []);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: value, // Handle checkbox
        });
    };

    const goBack = () => {
        window.location.reload();
    };

    const handleFocus = () => {
        setEmailPlaceholder("");
    };

    const handleBlur = (inputValue) => {
        if (!inputValue) {
            setEmailPlaceholder("email");
        }
    };

    const handleNameFocus = () => {
        setNamePlaceholder("");
    };

    const handleSurnameFocus = () => {
        setSurnamePlaceholder("");
    };

    const handleStudentIdFocus = () => {
        setStudentIdPlaceholder("");
    };

    const handleNameBlur = (inputValue) => {
        if (!inputValue) {
            setNamePlaceholder("name");
        }
    };
    const handleSurnameBlur = (inputValue) => {
        if (!inputValue) {
            setSurnamePlaceholder("surname");
        }
    };
    const handleStudentIdBlur = (inputValue) => {
        if (!inputValue) {
            setStudentIdPlaceholder("university student id");
        }
    };


    const handlePasswordFocus = () => {
        setPasswordPlaceholder("");
    };

    const handlePasswordBlur = (inputValue) => {
        if (!inputValue) {
            setPasswordPlaceholder("password");
        }
    };

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    const handleName = () => {
        let validationErrors = {};
        if (!name) validationErrors.name = "Name is required";
        if (Object.keys(validationErrors).length === 0) {
            setShowName(false);
            setShowPassword(true);
            console.log(name);
        } else {
            setErrors(validationErrors);
        }
    };

    const handleEmail = () => {
        let validationErrors = {};
        console.log(email);
        if (!email) {
            validationErrors.email = "Email is required";
        } else if (!validateEmail(email)) {
            validationErrors.email = "Invalid email address";
        }
        if (Object.keys(validationErrors).length === 0) {
            setShowEmail(false);
            setShowName(true);
        } else {
            setErrors(validationErrors);
        }
    };

    const evaluatePasswordStrength = (password) => {
        if (password.length == 0) {
            setPasswordStrength("");
        } else if (password.length < 8) {
            setPasswordStrength("too short");
        } else if (password.length >= 8 && password.length < 10) {
            setPasswordStrength("weak");
        } else if (password.length >= 10 && password.length < 12) {
            setPasswordStrength("good");
        } else if (password.length >= 12) {
            setPasswordStrength("great");
        } else {
            setPasswordStrength("");
        }
    };

    useEffect(() => {
        evaluatePasswordStrength(password);
    }, [password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.email = email;
        formData.password = password;
        formData.password_confirmation = password;
        formData.name = name;
        formData.surname = surname;
        formData.university_id = studentId;
        console.log("current FormData: ", formData);
        let validationErrors = {};
        if (!name) validationErrors.name = "Name is required";
        if (!email) {
            validationErrors.email = "Email is required";
        } else if (!validateEmail(email)) {
            validationErrors.email = "Invalid email address";
        }
        if (!password) {
            validationErrors.password = "Password is required";
        } else if (!validatePassword(password)) {
            validationErrors.password =
                "Password must be at least 8 characters long";
        }
        
        setError(null);
        setSuccess(false);

        if (Object.keys(validationErrors).length === 0) {
            setLoading(true);

            try {
                const response = await axios.post(
                    "http://127.0.0.1:8000/api/v1/register",
                    formData
                );
                console.log(response);
                if (response.status === 200) {
                    setSuccess(true);
                    router.push("/login");
                }
            } catch (err) {
                if (err.response && err.response.data) {
                    if (err.response.data.errors) {
                        const errors = Object.values(
                            err.response.data.errors
                        ).flat();
                        setError(errors.join(", "));
                    } else {
                        setError(
                            err.response.data.message || "Something went wrong"
                        );
                    }
                } else {
                    setError("Something went wrong");
                }
            } finally {
                setLoading(false);
            }
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <div className="w-full register-bg flex h-screen justify-center items-center bg-cover">
            <div className="w-[500px]  mx-3 font-montserrat p-6 mt-[50px] rounded-3xl">
                {showEmail && (
                    <div className="flex justify-between w-full sm:w-[450px]">
                        <button
                            onClick={goBack}
                            className="text-start flex items-center p-2 rounded"
                        >
                            <div className="mt-[-240px] z-50 text-gray-700">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a1 1 0 01-.707-.293l-7-7a1 1 0 010-1.414l7-7a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l6.293 6.293A1 1 0 0110 18z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </button>

                        <Link
                            href={"/login"}
                            className="text-gray-700 text-sm underline mt-[-125px] mr-[10px] cursor-pointer"
                        >
                            Log In
                        </Link>
                    </div>
                )}
                {showName && (
                    <button
                        onClick={goBack}
                        className="text-start flex items-center p-2 rounded"
                    >
                        <div className="mt-[-435px] z-50 text-gray-700">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a1 1 0 01-.707-.293l-7-7a1 1 0 010-1.414l7-7a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l6.293 6.293A1 1 0 0110 18z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </button>
                )}
                {showPassword && (
                    <button
                        onClick={goBack}
                        className="text-start flex items-center p-2 rounded"
                    >
                        <div className="mt-[-435px] z-50 text-gray-700">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a1 1 0 01-.707-.293l-7-7a1 1 0 010-1.414l7-7a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l6.293 6.293A1 1 0 0110 18z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </button>
                )}
                {showEmail && (
                    <div>
                        <h1 className="text-xl mb-[50px] uppercase font-semibold mt-[-146px] text-gray-700 font-montserrat text-center">
                            Sign Up
                        </h1>
                        <h3 className="text-sm mb-2 text-gray-700 font-montserrat">
                            Please, enter your email:
                        </h3>
                    </div>
                )}
                {showEmail && (
                    <div className="mb-4">
                        <input
                            onFocus={handleFocus}
                            onBlur={(e) => handleBlur(e.target.value)}
                            placeholder={emailPlaceholder}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-5 text-lg border-2 font-thin h-[50px] border-[#737373] text-gray-700 placeholder-gray-500  rounded-xl bg-gray-200"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">
                                {errors.email}
                            </p>
                        )}

                       
                    </div>
                )}
                {showName && (
                    <div>
                        <h1 className="text-xl mb-[50px] uppercase font-semibold mt-[-243px] text-gray-700 font-montserrat text-center">
                            Sign Up
                        </h1>
                        <h3 className="text-sm mb-2 text-gray-700 font-montserrat">
                            Please, enter your name
                        </h3>
                        <div className="mb-4 ">
                            <input
                                onFocus={handleNameFocus}
                                onBlur={(e) => handleNameBlur(e.target.value)}
                                placeholder={namePlaceholder}
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-5 border-2 font-thin h-[50px] border-[#737373] text-gray-700 placeholder-gray-500 text-lg rounded-xl bg-gray-200"
                            />

                            {errors.name && (
                                <p className="text-yellow-500 text-sm">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <h3 className="text-sm mb-2 text-gray-700 font-montserrat">
                            Please, enter your surname
                        </h3>
                        <div className="mb-4 ">
                            <input
                                onFocus={handleSurnameFocus}
                                onBlur={(e) => handleSurnameBlur(e.target.value)}
                                placeholder={surnamePlaceholder}
                                type="text"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                className="w-full p-5 border-2 font-thin h-[50px] border-[#737373] text-gray-700 placeholder-gray-500 text-lg rounded-xl bg-gray-200"
                            />

                            {errors.name && (
                                <p className="text-yellow-500 text-sm">
                                    {/* {errors.surname} */}
                                </p>
                            )}
                        </div>
                        <h3 className="text-sm mb-2 text-gray-700 font-montserrat">
                            Please, enter your university ID
                        </h3>
                        <div className="mb-4 ">
                            <input
                                onFocus={handleStudentIdFocus}
                                onBlur={(e) => handleStudentIdBlur(e.target.value)}
                                placeholder={studentIdPlaceholder}
                                type="text"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                className="w-full p-5 border-2 font-thin h-[50px] border-[#737373] text-gray-700 placeholder-gray-500 text-lg rounded-xl bg-gray-200"
                            />

                            {errors.name && (
                                <p className="text-yellow-500 text-sm">
                                    {/* {errors.uniId} */}
                                </p>
                            )}
                        </div>
                    </div>
                )}
                {showPassword && (
                    <div>
                        <h1 className="text-xl mb-[50px] uppercase font-semibold mt-[-243px] text-gray-700 font-montserrat text-center">
                            Sign Up
                        </h1>
                        <h3 className="text-sm mb-2 text-gray-700 font-montserrat">
                            Please, create a password
                        </h3>
                        <div className="mb-4 transition-all duration-300">
                            <input
                                placeholder={passwordPlaceholder}
                                onFocus={handlePasswordFocus}
                                onBlur={(e) =>
                                    handlePasswordBlur(e.target.value)
                                }
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="transition-all duration-300 w-full p-5 border-2 mb-4 font-thin h-[50px] border-[#737373] text-gray-700 placeholder-gray-500 text-lg rounded-xl bg-gray-200"
                            />
                            <div className="transition-all duration-300 flex justify-start space-x-3">
                                <div
                                    className={`transition-all duration-300 h-1 w-[32%] rounded-3xl ${
                                        passwordStrength === "too short"
                                            ? "bg-red-500"
                                            : passwordStrength === "weak"
                                            ? "bg-yellow-500"
                                            : passwordStrength === "good"
                                            ? "bg-green-400"
                                            : passwordStrength === "great"
                                            ? "bg-blue-400"
                                            : "hidden"
                                    }`}
                                ></div>
                                <div
                                    className={` transition-all duration-300 h-1 w-[32%] rounded-3xl ${
                                        passwordStrength === "good"
                                            ? "bg-green-400"
                                            : passwordStrength === "great"
                                            ? "bg-blue-400"
                                            : "hidden"
                                    }`}
                                ></div>
                                <div
                                    className={`transition-all duration-300 h-1 w-[32%] rounded-3xl ${
                                        passwordStrength === "great"
                                            ? "bg-blue-400"
                                            : "hidden"
                                    }`}
                                ></div>
                            </div>
                          
                            <p className="text-gray-700 mt-6 transition-all duration-300">
                                {passwordStrength === "too short" &&
                                    "Choose a password with at least 8 characters."}
                                {passwordStrength === "weak" &&
                                    "Weak password."}
                                {passwordStrength === "good" &&
                                    "Good Password."}
                                {passwordStrength === "great" &&
                                    "Great Password."}
                            </p>

                            {errors.password && (
                                <p className="text-yellow-500 text-sm">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                    </div>
                )}
                {showEmail && (
                    <button
                        onClick={handleEmail}
                        className="w-full p-5 mt-10 h-[50px] flex items-center justify-center text-white text-lg rounded-xl purple-gradient "
                    >
                        Continue
                    </button>
                )}
                {showName && (
                    <button
                        onClick={handleName}
                        className="w-full p-5 mt-10 h-[50px] flex items-center justify-center text-white text-lg rounded-xl purple-gradient"
                    >
                        Continue
                    </button>
                )}
                {showPassword && (
                    <button
                        onClick={handleSubmit}
                        className="w-full p-5 mt-5 h-[50px] flex items-center justify-center text-white text-lg rounded-xl purple-gradient"
                        disabled={loading}
                    >
                        {loading ? (
                            <Image
                                src={loadingGif}
                                alt="Loading..."
                                width={45}
                                height={45}
                            />
                        ) : (
                            "Continue"
                        )}
                    </button>
                )}
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && (
                    <p className="text-green-500 mb-4">
                        Registration successful!
                    </p>
                )}
                
            </div>
        </div>
    );
};

export default Register;
