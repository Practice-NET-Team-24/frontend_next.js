import { NextResponse } from "next/server";
import { getFilmById, updateFilm, deleteFilm } from "@/lib/database";

// GET /api/films/:id - Отримати фільм за ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const film = getFilmById(parseInt(params.id));
  return film ? NextResponse.json(film) : NextResponse.json({ error: "Film not found" }, { status: 404 });
}

// PUT /api/films/:id - Оновити фільм
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const updatedData = await req.json();
  const updatedFilm = updateFilm(parseInt(params.id), updatedData);
  return updatedFilm ? NextResponse.json(updatedFilm) : NextResponse.json({ error: "Film not found" }, { status: 404 });
}

// DELETE /api/films/:id - Видалити фільм
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const deletedFilm = deleteFilm(parseInt(params.id));
  return deletedFilm ? NextResponse.json(deletedFilm) : NextResponse.json({ error: "Film not found" }, { status: 404 });
}
