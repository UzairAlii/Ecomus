import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import { toast } from 'react-toastify';

const Login = () => {
    const { setToken, setEmail, backendUrl } = useContext(ShopContext);
    const [name, setName] = useState('');
    const [emailState, setEmailState] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [showSpamMessage, setShowSpamMessage] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const toggleRegister = () => {
        setIsRegistering(true);
        setIsForgotPassword(false);
    };

    const toggleForgotPassword = () => {
        setIsForgotPassword(true);
        setIsRegistering(false);
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (isForgotPassword) {
            if (!otpSent) {
                try {
                    const response = await fetch(`${backendUrl}/api/user/reset-password-request`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: emailState }),
                    });

                    const data = await response.json();

                    if (data.success) {
                        toast.success('OTP sent to your email.');
                        setOtpSent(true);
                    } else {
                        toast.error(data.msg || 'Error sending OTP. Please try again.');
                    }
                } catch (err) {
                    toast.error('Failed to send OTP. Please try again later.');
                }
            } else {
                try {
                    const response = await fetch(`${backendUrl}/api/user/verify-otp-reset-password`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: emailState, otp, newPassword }),
                    });

                    const data = await response.json();

                    if (data.success) {
                        toast.success('Password updated successfully. Please log in.');
                        setIsForgotPassword(false);
                        setOtpSent(false);
                    } else {
                        toast.error(data.msg || 'Failed to reset password. Please try again.');
                    }
                } catch (err) {
                    toast.error('An error occurred. Please try again later.');
                }
            }
            return;
        }

        const url = isRegistering
            ? `${backendUrl}/api/user/register`
            : `${backendUrl}/api/user/login`;

        const bodyData = isRegistering
            ? { name, email: emailState, password }
            : { email: emailState, password };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            });

            const data = await response.json();

            if (data.success) {
                setToken(data.token);
                setEmail(data.user.email);
                toast.success(data.msg || 'Success!');
                navigate(from, { replace: true });
            } else {
                toast.error(data.msg || 'Error logging in/registering.');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    };

    const loginAsGuest = () => {
        setToken('guest');
        navigate('/');
    };

    useEffect(() => {
        if (otpSent) {
            const timer = setTimeout(() => setShowSpamMessage(true), 5000);
            return () => clearTimeout(timer);
        }
    }, [otpSent]);

    return (
        <div className='flex items-center justify-center'>
            <div className="p-10 w-full md:w-1/2">
                <div className="flex items-center justify-between w-full text-center">
                    <h1 className="text-3xl font-normal w-full">
                        {isForgotPassword
                            ? 'Reset Your Password'
                            : isRegistering
                                ? 'Register'
                                : 'Login'}
                    </h1>
                </div>

                {isForgotPassword ? (
                    <form onSubmit={onSubmitHandler} className="flex flex-col gap-3 mt-6">
                        <p className="text-sm text-gray-600">
                            Enter your email to reset your password. We'll send you a link.
                        </p>

                        <input
                            className="border px-5 py-3 outline-none rounded-md"
                            placeholder="Email"
                            type="email"
                            onChange={(e) => setEmailState(e.target.value)}
                            value={emailState}
                        />

                        {otpSent && (
                            <>
                                {showSpamMessage && (
                                    <p className="text-sm text-black">
                                        (If you still haven't received an email, please check your spam and junk folder)
                                    </p>
                                )}
                                <input
                                    className="border px-5 py-3 outline-none rounded-md"
                                    placeholder="Enter OTP"
                                    type="text"
                                    onChange={(e) => setOtp(e.target.value)}
                                    value={otp}
                                />
                                <input
                                    className="border px-5 py-3 outline-none rounded-md"
                                    placeholder="New Password"
                                    type="password"
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    value={newPassword}
                                />
                            </>
                        )}
                        <div className="w-full flex-col md:flex-row flex items-center gap-5 mt-6">
                            <button className="w-[95%] md:w-[45%] py-3 bg-black text-white text-[15px]">
                                Submit
                            </button>
                            <div
                                className="border-b-[1px] border-black hover:text-red-600 hover:border-b-red-600 cursor-pointer"
                                onClick={() => setIsForgotPassword(false)}
                            >
                                <p className="text-[15px]">Back to Login</p>
                            </div>
                        </div>
                    </form>
                ) : isRegistering ? (
                    <form onSubmit={onSubmitHandler} className="flex flex-col gap-3 mt-6">
                        <input
                            className="border px-5 py-3 outline-none rounded-md"
                            placeholder="Full Name"
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                        <input
                            className="border px-5 py-3 outline-none rounded-md"
                            placeholder="Email"
                            type="email"
                            onChange={(e) => setEmailState(e.target.value)}
                            value={emailState}
                        />
                        <input
                            className="border px-5 py-3 outline-none rounded-md"
                            placeholder="Password"
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                        <div className="w-full flex-col md:flex-row flex items-center gap-5 mt-6">
                            <button className="w-[95%] md:w-[45%] py-3 bg-black text-white text-[15px]">
                                Register
                            </button>
                            <div
                                className="border-b-[1px] border-black hover:text-red-600 hover:border-b-red-600 cursor-pointer"
                                onClick={() => setIsRegistering(false)}
                            >
                                <p className="text-[15px]">Already have an account? Log in</p>
                            </div>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={onSubmitHandler} className="flex flex-col gap-3 mt-6">
                        <input
                            className="border px-5 py-3 outline-none rounded-md"
                            placeholder="Email"
                            type="email"
                            onChange={(e) => setEmailState(e.target.value)}
                            value={emailState}
                        />
                        <input
                            className="border px-5 py-3 outline-none rounded-md"
                            placeholder="Password"
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                        <p
                            className="text-[15px] mt-6 underline cursor-pointer hover:text-red-600"
                            onClick={toggleForgotPassword}
                        >
                            Forgot your password?
                        </p>
                        <div className="w-full flex flex-col md:flex-row items-center gap-5 mt-6">
                            <button className="w-[95%] md:w-[45%] py-3 bg-black text-white text-[15px]">
                                Log in
                            </button>
                            <div
                                className="border-b-[1px] border-black hover:text-red-600 hover:border-b-red-600 cursor-pointer"
                                onClick={toggleRegister}
                            >
                                <p className="text-[15px]">New Customer? Create your account</p>
                            </div>
                        </div>
                    </form>
                )}
                <div className="w-full flex items-center justify-center gap-5 mt-2">
                    <p
                        className="py-3 text-black text-[15px] cursor-pointer underline hover:text-red-600"
                        onClick={loginAsGuest}
                    >
                        Login as a Guest
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;