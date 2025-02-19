import { NextResponse } from "next/server";

let genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Drama" },
  { id: 3, name: "Sci-Fi" }
];

// GET: Отримати всі жанри
export async function GET() {
  return NextResponse.json(genres);
}

// POST: Додати новий жанр
export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    const newGenre = { id: genres.length + 1, name };
    genres.push(newGenre);

    return NextResponse.json(genres);
  } catch (error) {
    return NextResponse.json({ error: "Failed to add genre" }, { status: 500 });
  }
}
