"use client";

import Heading from "@/components/ui/heading";
import SettingsForm from "./components/settings-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const SettingsPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <Heading title="Settings" subtitle="Manage store preferences" />
        <Button variant="destructive" size="icon" className="w-8 h-8">
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
      <Separator className="my-3" />
      <SettingsForm />
    </div>
  );
};

export default SettingsPage;
