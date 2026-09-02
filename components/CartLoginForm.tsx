"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import Button from "./ui/Button";
import Heading from "./ui/Heading";
import Paragraph from "./ui/Paragraph";
import { useDispatch } from "@/redux/hooks";
import { login, ONE_HOUR_MS, saveLogin } from "@/redux/slices/userSlice";

type CartLoginFormProps = {
  onSuccess: () => void;
};

export default function CartLoginForm({ onSuccess }: CartLoginFormProps) {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const response = await dispatch(
        login({ username, password })
      ).unwrap();

      saveLogin({
        user: {
          id: response.id,
          name: `${response.firstName} ${response.lastName}`.trim(),
          email: response.email,
          username: response.username,
        },
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresAt: Date.now() + ONE_HOUR_MS,
      });

      onSuccess();
    } catch {
      // DummyJSON mainly allows emilys / emilyspass
      setError("User not registered. Try username: emilys / password: emilyspass");
    }
  }

  return (
    <div className="p-[16px]">
      <Heading as="h3" variant="cartTitle">
        Log in to add to cart
      </Heading>
      <Paragraph className="mt-[8px] !text-[14px] !text-muted-nav">
        Sign in first, then we&apos;ll add the item for you.
      </Paragraph>

      <form
        onSubmit={handleSubmit}
        className="mt-[16px] flex flex-col gap-[12px]"
      >
        <label className="flex flex-col gap-[6px]">
          <span className="text-[13px] font-[500]">Username</span>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="emilys"
            className="h-[44px] rounded-[8px] border border-border-light bg-surface px-[12px] text-[14px] outline-none focus:border-primary"
          />
        </label>

        <label className="flex flex-col gap-[6px]">
          <span className="text-[13px] font-[500]">Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="emilyspass"
            className="h-[44px] rounded-[8px] border border-border-light bg-surface px-[12px] text-[14px] outline-none focus:border-primary"
          />
        </label>

        {error ? (
          <Paragraph className="!text-[13px] !text-primary">{error}</Paragraph>
        ) : null}

        <Button
          type="submit"
          variant="solid"
          text="Log in"
          className="mt-[4px] !h-[44px] !w-full"
        />
      </form>

      <Paragraph className="mt-[12px] text-center !text-[13px] !text-muted-nav">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-[500] text-primary underline">
          Sign up
        </Link>
      </Paragraph>
    </div>
  );
}
