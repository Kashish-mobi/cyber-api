"use client";

import Button from "./Button";
import Heading from "./Heading";
import Paragraph from "./Paragraph";

export default function ConfirmBox({
  open,
  title,
  message,
  onYes,
  onNo,
}: {
  open: boolean;
  title: string;
  message: string;
  onYes: () => void;
  onNo: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-[16px]"
      onClick={(e) => {
        e.stopPropagation();
        onNo();
      }}
    >
      <div
        className="w-full max-w-[400px] rounded-[16px] border border-surface-gray bg-white p-[24px]"
        onClick={(e) => e.stopPropagation()}
      >
        <Heading as="h3" variant="cartTitle">
          {title}
        </Heading>
        <Paragraph type="body" className="mt-[12px] !text-muted-nav">
          {message}
        </Paragraph>
        <div className="mt-[24px] flex gap-[12px]">
          <Button
            variant="dark"
            className="!h-[48px] !min-w-0 flex-1"
            onClick={onNo}
          >
            No
          </Button>
          <Button
            variant="fill-dark"
            className="!h-[48px] !min-w-0 flex-1"
            onClick={onYes}
          >
            Yes
          </Button>
        </div>
      </div>
    </div>
  );
}
