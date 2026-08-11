"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import Button from "./ui/Button";
import Heading from "./ui/Heading";
import Paragraph from "./ui/Paragraph";
import AppImage from "./ui/Image";

type AuthFormProps = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const isLogin = mode === "login";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // UI only for now — wire up real auth later
    console.log(isLogin ? "Login" : "Signup", { name, email, password });
  }

  return (
    <div className="w-full container">


    <div className="mx-auto w-full grid grid-cols-2  items-center justify-center rounded-[12px] bg-secondary p-[32px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.06)]">
    <div className="col-span-1">
      <AppImage
        src="/website/auth.svg"
        alt="logo"
        width={100}
        height={100}
        className="w-full h-full object-contain"
      />
    </div>
    <div className="col-span-1">
      <div>
      <Heading as="h1" variant="section" className="text-center">
        {isLogin ? "Log in" : "Sign up"}
      </Heading>
      <Paragraph className="mt-[8px] text-center text-muted">
        {isLogin
          ? "Welcome back. Enter your details below."
          : "Create an account to start shopping."}
      </Paragraph>

      <form onSubmit={handleSubmit} className="mt-[32px] flex flex-col gap-[16px]">
        {!isLogin ? (
          <label className="flex flex-col gap-[8px]">
            <span className="text-[14px] font-[500]">Name</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="h-[48px] rounded-[8px] border border-border-light bg-surface px-[16px] text-[14px] outline-none focus:border-primary"
            />
          </label>
        ) : null}

        <label className="flex flex-col gap-[8px]">
          <span className="text-[14px] font-[500]">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-[48px] rounded-[8px] border border-border-light bg-surface px-[16px] text-[14px] outline-none focus:border-primary"
          />
        </label>

        <label className="flex flex-col gap-[8px]">
          <span className="text-[14px] font-[500]">Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-[48px] rounded-[8px] border border-border-light bg-surface px-[16px] text-[14px] outline-none focus:border-primary"
          />
        </label>

        <Button
          type="submit"
          variant="solid"
          text={isLogin ? "Log in" : "Create account"}
          className="mt-[8px] w-full 2xl:w-full"
        />
      </form>

      <Paragraph className="mt-[24px] text-center text-muted">
        {isLogin ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-[500] text-primary underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-[500] text-primary underline">
              Log in
            </Link>
          </>
        )}
      </Paragraph>
      </div>
      
    </div>
    </div>
    </div>
  );
}
