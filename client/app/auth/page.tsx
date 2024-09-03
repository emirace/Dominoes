"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import createAPI from "@/utils/api";

function AuthPage() {
  const API = createAPI();
  const [showUsername, setShowUsername] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const verifySignature = async (
    address: string,
    nonce: string,
    signedMessage: string
  ) => {
    try {
      const recoveredAddress = await window.tronWeb.trx.verifyMessageV2(
        nonce,
        signedMessage
      );
      console.log(recoveredAddress, address);
      return recoveredAddress === address;
    } catch (error) {
      console.error("Signature verification failed", error);
      return false;
    }
  };

  const authenticate = async (
    address: string,
    nonce: string,
    signedMessage: string
  ) => {
    try {
      if (address) {
        const isValidSignature = await verifySignature(
          address,
          nonce,
          signedMessage
        );
        if (!isValidSignature) {
          toast.error("Invalid signature");
          return;
        }

        const response = await API.post("/user/auth", {
          address,
          username,
        });
        if (!response.data.data.token) {
          return setShowUsername(true);
        }

        localStorage.setItem("token", response.data.data.token);
        window.location.href = "/";
      }
    } catch (error: any) {
      console.error("Authentication failed", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Authentication failed"
      );
    }
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      if (!window.tronWeb) {
        toast.error("Please install the tronlink extension first");
        return;
      }
      await window.tronWeb.request({ method: "tron_requestAccounts" });
      const userAddress = window.tronWeb.defaultAddress.base58;
      const nonce = `Sign this message to verify wallet ownership: ${Math.random()
        .toString(36)
        .substring(2)}`;
      const signedMessage = await window.tronWeb.trx.signMessageV2(nonce);
      authenticate(userAddress, nonce, signedMessage);
    } catch (err: any) {
      console.log(err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          (typeof err === "string" && err) ||
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
          {!showUsername && (
            <button
              onClick={handleSubmit}
              className="mt-6 px-8"
              disabled={isLoading}
            >
              Authenticate with your tron link wallet
            </button>
          )}
          {showUsername && (
            <div className="mt-6">
              <div className="relative">
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  placeholder=" "
                  name="username"
                  required
                />
                <label htmlFor="">Username</label>
              </div>
              <button
                onClick={handleSubmit}
                className="mt-8"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : `Create account`}
              </button>
            </div>
          )}
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
