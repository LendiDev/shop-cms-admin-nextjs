import { auth } from "@clerk/nextjs";

import Heading from "@/components/ui/heading";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

interface BillboardsPageProps {
  params: {
    storeId: string;
  };
}

const BillboardPage: React.FC<BillboardsPageProps> = async ({ params }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  const billboard = await prismadb.billboard.findFirst({
    where: {
      storeId: params.storeId,
      store: {
        userId,
      },
    },
  });

  if (!billboard) {
  }

  return (
    <>
      <Heading title="Billboard" />
    </>
  );
};

export default BillboardPage;
