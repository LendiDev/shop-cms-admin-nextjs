"use client";

import React from "react";

import { ApiAlert } from "./api-alert";
import Heading from "./heading";
import { Separator } from "./separator";
import { useParams } from "next/navigation";
import { useWindowOrigin } from "@/hooks/use-window-origin";

interface ApiListProps {
  entityName: string;
  entityIdName: string;
}

const ApiList: React.FC<ApiListProps> = ({ entityName, entityIdName }) => {
  const params = useParams();
  const origin = useWindowOrigin();

  const baseUrl = `${origin}/api/${params.storeId}`;

  if (!origin) {
    return false;
  }

  return (
    <section className="space-y-3 mt-6">
      <Heading title="API Endpoints" className="pt-2" />
      <Separator />
      <ApiAlert
        title="GET"
        description={`${baseUrl}/${entityName}`}
        access="public"
      />
      <ApiAlert
        title="GET"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
        access="public"
      />
      <ApiAlert
        title="POST"
        description={`${baseUrl}/${entityName}`}
        access="admin"
      />
      <ApiAlert
        title="PATCH"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
        access="admin"
      />
      <ApiAlert
        title="DELETE"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
        access="admin"
      />
    </section>
  );
};

export default ApiList;
