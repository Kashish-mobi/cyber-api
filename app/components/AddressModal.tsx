"use client";

import { useEffect, useState } from "react";
import Button from "./ui/Button";
import Heading from "./ui/Heading";
import Input from "./ui/Input";
import Paragraph from "./ui/Paragraph";
import type { Address } from "@/redux/slices/checkoutSlice";

type AddressForm = Omit<Address, "id">;

const emptyForm: AddressForm = {
  label: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  phone: "",
  type: "HOME",
};

export default function AddressModal({
  open,
  address,
  onClose,
  onSave,
}: {
  open: boolean;
  address?: Address | null;
  onClose: () => void;
  onSave: (data: AddressForm) => void;
}) {
  const [form, setForm] = useState<AddressForm>(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setForm(address || emptyForm);
    setError("");
  }, [open, address]);

  if (!open) return null;

  const setField = (key: keyof AddressForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const handleSave = () => {
    if (
      !form.label.trim() ||
      !form.street.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.zip.trim() ||
      !form.phone.trim()
    ) {
      setError("Please fill in all address fields.");
      return;
    }

    onSave(form);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-[16px]"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-[16px] border border-surface-gray bg-white p-[24px]"
        onClick={(e) => e.stopPropagation()}
      >
        <Heading as="h3" variant="cartTitle">
          {address ? "Edit Address" : "Add New Address"}
        </Heading>
        <div className="mt-[20px] flex flex-col gap-[12px]">
          <Input
            placeholder="Address name"
            variant="base"
            value={form.label}
            onChange={(e) => setField("label", e.target.value)}
          />
          <Input
            placeholder="Street"
            variant="base"
            value={form.street}
            onChange={(e) => setField("street", e.target.value)}
          />
          <Input
            placeholder="City"
            variant="base"
            value={form.city}
            onChange={(e) => setField("city", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-[12px]">
            <Input
              placeholder="State"
              variant="base"
              value={form.state}
              onChange={(e) => setField("state", e.target.value)}
            />
            <Input
              placeholder="ZIP"
              variant="base"
              value={form.zip}
              onChange={(e) => setField("zip", e.target.value)}
            />
          </div>
          <Input
            placeholder="Phone"
            variant="base"
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
          />
          <div className="flex gap-[8px]">
            {(["HOME", "OFFICE"] as const).map((type) => (
              <button
                key={type}
                type="button"
                className={`h-[40px] flex-1 rounded-[8px] border text-[14px] ${
                  form.type === type
                    ? "border-primary bg-primary text-white"
                    : "border-border-light bg-white text-primary"
                }`}
                onClick={() => setField("type", type)}
              >
                {type}
              </button>
            ))}
          </div>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
        </div>
        <div className="mt-[24px] flex gap-[12px]">
          <Button
            variant="dark"
            className="!h-[48px] !min-w-0 flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="fill-dark"
            className="!h-[48px] !min-w-0 flex-1"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
        <Paragraph type="cart" className="mt-[12px] !text-muted-nav">
          Saved on this device only.
        </Paragraph>
      </div>
    </div>
  );
}
