import { NextResponse } from "next/server";
import { getFilms, addFilm } from "@/lib/database";

// GET /api/films - Отримати всі фільми
export async function GET() {
  return NextResponse.json(getFilms());
}

// POST /api/films - Додати новий фільм
export async function POST(req: Request) {
  const newFilm = await req.json();
  const addedFilm = addFilm(newFilm);
  return NextResponse.json(addedFilm, { status: 201 });
}
