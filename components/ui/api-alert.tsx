"use client";

import { Copy, Server } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export interface ApiAlertProps {
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
      // TODO: find better way to handle clipboard on all devices
      const element = document.createElement("textarea");
      element.value = description;
      document.body.appendChild(element);
      element.select();
      document.execCommand("copy");
      document.body.removeChild(element);
      toast.success("API Endpoint copied to the clipboard");
    } catch (error) {
      toast.error("Something went wrong with copying to the clipboard");
    }
  };

  return (
    <Alert>
      <Server className="h-4 w-4" />
      <div className="flex flex-col items-start justify-start space-x-0 space-y-2 sm:space-x-2 sm:space-y-0 sm:flex-row sm:items-center">
        <AlertTitle className="mb-0">{title}</AlertTitle>
        <Badge variant={variantMap[access]}>{textMap[access]}</Badge>
      </div>
      <Button
        size="icon"
        className="absolute h-8 w-8 mb-1 top-2 right-3"
        variant={"outline"}
        onClick={onCopy}
      >
        <Copy className="h-4 w-4" />
      </Button>
      <AlertDescription className="mt-2">
        <div className="flex w-fit font-semibold overflow-x-auto bg-slate-50 px-2 py-1 outline outline-slate-300 outline-1 rounded-sm">
          {description}
        </div>
      </AlertDescription>
    </Alert>
  );
};
