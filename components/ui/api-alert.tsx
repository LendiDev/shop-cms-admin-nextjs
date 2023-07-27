"use client";

import { Copy, Server } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface ApiAlertProps {
  title: string;
  description: string;
  access: "public" | "admin";
}

const textMap: Record<ApiAlertProps["access"], string> = {
  public: "Public",
  admin: "Admin",
};

const variantMap: Record<ApiAlertProps["access"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

export const ApiAlert: React.FC<ApiAlertProps> = ({
  title,
  description,
  access = "public",
}) => {
  const onCopy = () => {
    try {
      navigator.clipboard.writeText(description);
      toast.success("API Endpoint copied to the clipboard");
    } catch (error) {
      toast.error("Something went wrong with copying to the clipboard");
    }
  };

  return (
    <Alert>
      <Server className="h-4 w-4" />
      <div className="flex flex-row items-center space-x-2">
        <AlertTitle>{title}</AlertTitle>
        <Badge className="mb-1" variant={variantMap[access]}>
          {textMap[access]}
        </Badge>
      </div>
      <Button
        size="icon"
        className="absolute h-8 w-8 mb-1 top-2 right-3"
        variant={"outline"}
        onClick={onCopy}
      >
        <Copy className="h-4 w-4" />
      </Button>
      <AlertDescription className="mt-1">
        <div className="inline-block bg-slate-50 px-2 py-1 outline outline-slate-300 outline-1 rounded-sm">
          <p>{description}</p>
        </div>
      </AlertDescription>
    </Alert>
  );
};
