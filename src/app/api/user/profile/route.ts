import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { password, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const {
      name,
      companyName,
      companyEmail,
      companyAddress,
      companyPhone,
      companyLogo,
      currency,
      taxNumber,
      isPro, // allowed for demo/testing toggle
    } = data;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name !== undefined ? name : user.name,
        companyName: companyName !== undefined ? companyName : user.companyName,
        companyEmail: companyEmail !== undefined ? companyEmail : user.companyEmail,
        companyAddress: companyAddress !== undefined ? companyAddress : user.companyAddress,
        companyPhone: companyPhone !== undefined ? companyPhone : user.companyPhone,
        companyLogo: companyLogo !== undefined ? companyLogo : user.companyLogo,
        currency: currency !== undefined ? currency : user.currency,
        taxNumber: taxNumber !== undefined ? taxNumber : user.taxNumber,
        isPro: isPro !== undefined ? Boolean(isPro) : user.isPro,
      },
    });

    const { password, ...safeUser } = updated;
    return NextResponse.json(safeUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
