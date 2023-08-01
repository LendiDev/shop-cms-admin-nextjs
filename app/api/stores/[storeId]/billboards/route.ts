// Create new billboard

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface BillboardCreateDTO {
  imageUrl: string;
  label: string;
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const storeId = params.storeId;
    const body: BillboardCreateDTO = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    if (!body?.imageUrl) {
      return NextResponse.json(
        { message: "imageUrl property is required" },
        { status: 400 }
      );
    }

    if (!body?.label) {
      return NextResponse.json(
        { message: "label property is required" },
        { status: 400 }
      );
    }

    if (!params.storeId) {
      return NextResponse.json(
        { message: "storeId is required" },
        { status: 400 }
      );
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId,
        id: storeId,
      },
    });

    if (!storeByUserId) {
      return NextResponse.json({ message: "Unauthorised" }, { status: 403 });
    }

    const newBillboard = await prismadb.billboard.create({
      data: {
        storeId,
        label: body.label,
        imageUrl: body.imageUrl,
      },
    });

    return NextResponse.json({ billboard: newBillboard });
  } catch (error) {
    console.log("[BILLBOARDS_POST]", error);

    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
