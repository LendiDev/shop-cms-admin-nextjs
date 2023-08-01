import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { SettingsForm } from "./components/settings-form";
import prismadb from "@/lib/prismadb";

interface SettingsPageProps {
  params: {
    storeId: string;
  };
}

const getStore = async (id: string, userId: string) => {
  const store = await prismadb.store.findFirst({
    where: {
      userId,
      id,
    },
  });
  return store;
};

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  const store = await getStore(params.storeId, userId);

  if (!store) {
    redirect("/");
  }

  return (
    <div className="space-y-3">
      <SettingsForm initialData={store} />
    </div>
  );
};

export default SettingsPage;
