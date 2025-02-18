"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function FilmDetails({ params }: { params: { id: string } }) {
  const [film, setFilm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/films/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setFilm(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{film.name}</h1>
      <p>{film.description}</p>
      <img src={film.imageURL} alt={film.name} className="w-full mt-4 rounded" />
      <Button className="mt-6" variant="outline" onClick={() => router.push("/client")}>
        Back to My Bookings
      </Button>
    </Card>
  );
}
