"use client";

import { useParams } from "next/navigation";

import { ApiAlert } from "@/components/ui/api-alert";
import Heading from "@/components/ui/heading";
import { useWindowOrigin } from "@/hooks/use-window-origin";

const ApiEndPoints = () => {
  const origin = useWindowOrigin();
  const params = useParams();

  const baseUrl = `${origin}/api/${params.storeId}`;

  if (!origin) {
    return false;
  }

  return (
    <>
      <Heading title="API Endpoints" className="pt-2" />
      <ApiAlert
        title="Public API URL"
        description={`${baseUrl}`}
        access="public"
      />
    </>
  );
};

export default ApiEndPoints;
