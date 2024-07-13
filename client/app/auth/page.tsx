"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import API from "@/utils/api";

function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      console.log(data);
      if (isSignUp && data.password !== data.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      const { data: res } = await API.post(
        isSignUp ? "/auth/register" : "/auth/login",
        data
      );

      toast.success("Authenticated successfully");
      localStorage.setItem("token", res.token);
      router.push("/");
    } catch (err: any) {
      console.log(err);
      toast.error(
        err.response.data.message ||
          err.message ||
          "An error occurred while logging you in"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="md:w-2/3 w-full bg-main-blue flex md:items-center items-start justify-center">
        <div className="min-w-[360px] md:my-16 my-8">
          <Image
            src="/dominoes.png"
            alt="dominoes"
            width={60}
            height={60}
            className="w-[60px] md:hidden rounded-2xl h-[60px]"
          />
          <h1 className="text-white tracking-wider mt-4 font-bold font-poppins text-4xl">
            Dominoes
          </h1>
          {!isSignUp ? (
            <p className="text-white mt-2 mb-6">
              Don&apos;t have an account?{" "}
              <span
                onClick={() => setIsSignUp(true)}
                className="text-main-orange underline cursor-pointer"
              >
                Sign up
              </span>
            </p>
          ) : (
            <p className="text-white mt-2 mb-6">
              Already signed up?{" "}
              <span
                onClick={() => setIsSignUp(false)}
                className="text-main-orange underline cursor-pointer"
              >
                Log in
              </span>
            </p>
          )}
          {isSignUp && (
            <div className="relative">
              <input
                onChange={handleChange}
                type="text"
                placeholder=" "
                name="username"
                required
              />
              <label htmlFor="">Username</label>
            </div>
          )}
          <div className="relative mt-4">
            <input
              onChange={handleChange}
              type="email"
              placeholder=" "
              name="email"
              required
            />
            <label htmlFor="">Email</label>
          </div>
          <div className="relative mt-4">
            <input
              onChange={handleChange}
              type="password"
              placeholder=" "
              name="password"
              required
            />
            <label htmlFor="">Password</label>
          </div>
          {isSignUp && (
            <div className="relative mt-4">
              <input
                type="password"
                placeholder=" "
                name="confirmPassword"
                onChange={handleChange}
                required
              />
              <label htmlFor="">Confirm Password</label>
            </div>
          )}
          <button onClick={handleSubmit} className="mt-8" disabled={isLoading}>
            {isLoading ? "Loading..." : `Sign ${isSignUp ? "Up" : "In"}`}
          </button>
          {/* <div className="my-6 flex justify-center items-center gap-4">
            <div className="h-px w-full bg-white/15"></div>
            <p className="">or</p>
            <div className="h-px w-full bg-white/15"></div>
          </div>
          <button className=""></button> */}
        </div>
      </div>
      <div className="w-1/3 hidden bg-dark-blue md:flex justify-center items-center">
        <Image
          src="/dominoes.png"
          alt="dominoes"
          width={120}
          height={120}
          className="w-[120px] rounded-2xl h-[120px]"
        />
      </div>
    </div>
  );
}

export default AuthPage;
