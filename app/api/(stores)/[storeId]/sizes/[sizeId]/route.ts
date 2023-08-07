import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    if (!params.storeId || !params.sizeId) {
      return NextResponse.json(
        { message: "Store & size ids are required" },
        { status: 400 }
      );
    }

    const size = await prismadb.size.findFirst({
      where: {
        id: params.sizeId,
        storeId: params.storeId,
      },
    });

    if (!size) {
      return NextResponse.json(
        { message: "Billboard not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ size }, { status: 200 });
  } catch (error) {
    console.log("[SIZE_GET]", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();
    const {
      name,
      value,
    }: {
      name: string;
      value: string;
    } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!name) {
      return NextResponse.json(
        { message: "name is required" },
        { status: 400 }
      );
    }

    if (!value!) {
      return NextResponse.json(
        { message: "value is required" },
        { status: 400 }
      );
    }

    if (!params.storeId) {
      return NextResponse.json(
        { message: "Store id is required" },
        { status: 400 }
      );
    }

    if (!params.sizeId) {
      return NextResponse.json(
        { message: "Billboard id is required" },
        { status: 400 }
      );
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId,
        id: params.storeId,
      },
    });

    if (!storeByUserId) {
      return NextResponse.json({ message: "Unauthorised" }, { status: 403 });
    }

    await prismadb.size.update({
      where: {
        id: params.sizeId,
        storeId: params.storeId,
      },
      data: {
        name,
        value: +value,
      },
    });

    const updatedSize = await prismadb.size.findFirst({
      where: {
        id: params.sizeId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json({ updatedSize }, { status: 200 });
  } catch (error: any) {
    console.log("[SIZE_PATCH]", error);

    if (error.code === "P2025") {
      NextResponse.json(
        { message: "Store not found with id: " + params.storeId },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    if (!params.storeId) {
      return NextResponse.json(
        { message: "Store id is required" },
        { status: 400 }
      );
    }

    if (!params.sizeId) {
      return NextResponse.json(
        { message: "Billboard id is required" },
        { status: 400 }
      );
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId,
        id: params.storeId,
      },
    });

    if (!storeByUserId) {
      return NextResponse.json({ message: "Unauthorised" }, { status: 403 });
    }

    await prismadb.size.delete({
      where: {
        id: params.sizeId,
        storeId: params.storeId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.log("[SIZE_DELETE]", error);

    if (error.code === "P2025") {
      NextResponse.json(
        { message: "Store not found with id: " + params.storeId },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
