import { NextResponse } from "next/server";
import { deleteBooking } from "@/lib/database";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const success = deleteBooking(parseInt(params.id));

  if (!success) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Booking deleted successfully" });
}
