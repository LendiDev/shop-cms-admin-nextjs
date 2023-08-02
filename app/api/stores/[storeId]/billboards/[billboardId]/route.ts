// patch

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    if (!params.storeId || !params.billboardId) {
      return NextResponse.json(
        { message: "Store & billboard ids are required" },
        { status: 400 }
      );
    }

    const billboard = await prismadb.billboard.findFirst({
      where: {
        id: params.billboardId,
        storeId: params.storeId,
      },
    });

    if (!billboard) {
      return NextResponse.json(
        { message: "Billboard not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ billboard }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();
    const storeData: { imageUrl?: string; label?: string } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!storeData.imageUrl) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    if (!storeData.label) {
      return NextResponse.json(
        { message: "Label is required" },
        { status: 400 }
      );
    }

    if (!params.storeId) {
      return NextResponse.json(
        { message: "Store id is required" },
        { status: 400 }
      );
    }

    if (!params.billboardId) {
      return NextResponse.json(
        { message: "Billboard id is required" },
        { status: 400 }
      );
    }

    await prismadb.billboard.update({
      where: {
        id: params.billboardId,
        storeId: params.storeId,
      },
      data: {
        imageUrl: storeData.imageUrl,
        label: storeData.label,
      },
    });

    const updateBillboard = await prismadb.billboard.findFirst({
      where: {
        storeId: params.storeId,
        id: params.storeId,
      },
    });

    return NextResponse.json({ updateBillboard }, { status: 200 });
  } catch (error: any) {
    console.log("[BILLBOARDS_PATCH]", error);

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
  { params }: { params: { storeId: string; billboardId: string } }
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

    if (!params.billboardId) {
      return NextResponse.json(
        { message: "Billboard id is required" },
        { status: 400 }
      );
    }

    await prismadb.billboard.delete({
      where: {
        id: params.billboardId,
        storeId: params.storeId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.log("[BILLBOARD_DELETE]", error);

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
