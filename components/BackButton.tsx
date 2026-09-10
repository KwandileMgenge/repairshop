"use client"

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

type BackButtonProps ={
  title: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function BackButton({ title, className, variant = "default", ...props }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant={variant}
      className={`flex items-center gap-2 ${className}`}
      onClick={() => router.back()}
      {...props}
    >
      <ArrowLeft size={16} />
      {title}
    </Button>
  );
}