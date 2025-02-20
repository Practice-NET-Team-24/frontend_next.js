"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectItem } from "@/components/ui/select";

interface Actor {
  id: number;
  name: string;
  surname: string;
}

interface Genre {
  id: number;
  name: string;
}

interface MovieActor {
  id: number;
  movieId: number;
  actorId: number;
  role: string;
  actor: Actor;
}

interface MovieGenre {
  id: number;
  movieId: number;
  genreId: number;
  genre: Genre;
}

interface Movie {
  id: number;
  name: string;
  description: string;
  imageURL: string;
  trailerURL: string;
  ageRestriction: number;
  duration: number;
  rating: number;
  movieActors: MovieActor[];
  movieGenres: MovieGenre[];
}

export default function CreateFilm() {
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { register, handleSubmit, reset } = useForm<Movie>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actors, setActors] = useState<Actor[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [newActor, setNewActor] = useState("");
  const [newGenre, setNewGenre] = useState("");
  let token: string | null = null;

  if (window != undefined)
    token = window.localStorage.getItem('token')

  // const addActor = async () => {
  //   if (!newActor.trim()) return;
  //   try {
  //     const response = await fetch("/api/actors", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ name: newActor }),
  //     });
  //     if (!response.ok) throw new Error("Failed to add actor");
  //     setActors(await response.json());
  //     setNewActor("");
  //   } catch (error) {
  //     console.error("Error adding actor:", error);
  //   }
  // };

  // const addGenre = async () => {
  //   if (!newGenre.trim()) return;
  //   try {
  //     const response = await fetch("/api/genres", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ name: newGenre }),
  //     });
  //     if (!response.ok) throw new Error("Failed to add genre");
  //     setGenres(await response.json());
  //     setNewGenre("");
  //   } catch (error) {
  //     console.error("Error adding genre:", error);
  //   }
  // };

  const onSubmit = async (data: Movie) => {
    setLoading(true);
    setError("");

    data.movieActors = data.movieActors.map((actorId) => ({
      id: 0,
      movieId: 0,
      actorId: Number(actorId),
      role: "Unknown Role",
      actor: actors.find((a) => a.id === Number(actorId))!,
    }));

    data.movieGenres = data.movieGenres.map((genreId) => ({
      id: 0,
      movieId: 0,
      genreId: Number(genreId),
      genre: genres.find((g) => g.id === Number(genreId))!,
    }));

    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/Movies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create film");
      reset();
      router.push("/admin/film/edit");
    } catch (err) {
      setError("Error adding film. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Create a New Film</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input {...register("name", { required: true })} placeholder="Film Name" />
        <Textarea {...register("description")} placeholder="Description" />
        <Input {...register("imageURL")} placeholder="Image URL" />
        <Input {...register("trailerURL")} placeholder="Trailer URL" />
        <Input type="number" {...register("ageRestriction")} placeholder="Age Restriction" />
        <Input type="number" {...register("duration")} placeholder="Duration (minutes)" />
        <Input type="number" {...register("rating")} placeholder="Rating" />

        <Select multiple {...register("movieActors")}>
          {actors.map((actor) => (
            <SelectItem key={actor.id} value={actor.id.toString()}>
              {actor.name} {actor.surname}
            </SelectItem>
          ))}
        </Select>

        <div className="flex">
          <Input value={newActor} onChange={(e) => setNewActor(e.target.value)} placeholder="New Actor" />
          <Button type="button" >Add Actor</Button>
        </div>

        <Select multiple {...register("movieGenres")}>
          {genres.map((genre) => (
            <SelectItem key={genre.id} value={genre.id.toString()}>
              {genre.name}
            </SelectItem>
          ))}
        </Select>

        <div className="flex">
          <Input value={newGenre} onChange={(e) => setNewGenre(e.target.value)} placeholder="New Genre" />
          <Button type="button" >Add Genre</Button>
        </div>

        <Button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Film"}</Button>
      </form>
    </Card>
  );
}