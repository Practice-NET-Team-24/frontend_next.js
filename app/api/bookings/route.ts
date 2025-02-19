import { NextResponse } from "next/server";
import { getUserBookings } from "@/lib/database";

export async function GET() {
  const bookings = getUserBookings();
  return NextResponse.json(bookings);
}
