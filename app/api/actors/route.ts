import { NextResponse } from "next/server";

let actors = [
  { id: 1, name: "Robert Downey Jr." },
  { id: 2, name: "Chris Evans" }
];

// GET: Отримати всіх акторів
export async function GET() {
  return NextResponse.json(actors);
}

// POST: Додати нового актора
export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    const newActor = { id: actors.length + 1, name };
    actors.push(newActor);

    return NextResponse.json(actors);
  } catch (error) {
    return NextResponse.json({ error: "Failed to add actor" }, { status: 500 });
  }
}
