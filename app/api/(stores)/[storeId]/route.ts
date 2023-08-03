import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const storeData: { name: string | undefined } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!storeData.name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    if (!params.storeId) {
      return NextResponse.json(
        { message: "Store ID is required" },
        { status: 400 }
      );
    }

    await prismadb.store.updateMany({
      where: {
        userId,
        id: params.storeId,
      },
      data: {
        name: storeData.name,
      },
    });

    const updatedStore = await prismadb.store.findFirst({
      where: {
        userId,
        id: params.storeId,
      },
    });

    return NextResponse.json({ updatedStore: updatedStore }, { status: 200 });
  } catch (error: any) {
    console.log("[STORES_PATCH]", error);

    if (error.code === "P2025") {
      NextResponse.json(
        { message: "Store not found with id: " + params.storeId },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Store is not updated" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    if (!params.storeId) {
      return NextResponse.json(
        { message: "Store ID is required" },
        { status: 400 }
      );
    }

    await prismadb.store.deleteMany({
      where: {
        userId,
        id: params.storeId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.log("[STORES_DELETE]", error);

    if (error.code === "P2025") {
      NextResponse.json(
        { message: "Store not found with id: " + params.storeId },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Store is not deleted. Something went wrong." },
      { status: 400 }
    );
  }
}
