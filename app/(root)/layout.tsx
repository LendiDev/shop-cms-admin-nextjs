import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { RedirectType } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  const store = await prismadb.store.findFirst({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (store) {
    redirect(`/${store.id}`, RedirectType.replace);
  }

  return <>{children}</>;
}
