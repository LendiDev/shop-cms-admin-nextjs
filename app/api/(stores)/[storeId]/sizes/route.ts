import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return NextResponse.json(
        { message: "Store id is required" },
        { status: 400 }
      );
    }

    const sizes = await prismadb.size.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json({ sizes });
  } catch (error) {
    console.log("[SIZES_GET]", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

interface SizeCreateDTO {
  name: string;
  value: string;
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const storeId = params.storeId;
    const { name, value }: SizeCreateDTO = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    if (!name) {
      return NextResponse.json(
        { message: "name property is required" },
        { status: 400 }
      );
    }

    if (!value) {
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

    const size = await prismadb.size.create({
      data: {
        storeId,
        name,
        value: +value,
      },
    });

    return NextResponse.json({ size });
  } catch (error) {
    console.log("[SIZE_POST]", error);

    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
