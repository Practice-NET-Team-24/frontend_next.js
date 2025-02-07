import filmsJson from "../mockFilms.json"
import {Movie, MovieActor, MovieGenre} from "@/app/admin/film/edit/types";
import {formatSeconds} from "@/lib/utils";
import {Star, StarIcon} from "lucide-react";

const data: Movie[] = filmsJson;

export default async function FilmEditDetails({params}: {params: {id: string}}) {
    const {id} = await params;
    const movie = data.find((movie: Movie) => movie.Id + "" === id);
    return (
        <div className={"flex gap-4 ma"}>
            <img
                width="40%"
                src={movie?.ImageURL}
                alt={movie?.Name}
            />
            <div >
                <h1 className={"text-2xl"}>{movie?.Name}</h1>
                <div className={"flex flex-col gap-4 font-light"}>

                    <div className="flex items-center gap-4 text-black-300">
                        <span>Min age {movie?.AgeRestriction}</span>|
                        <span>{formatSeconds(movie?.Duration)}</span>|
                        <div className={"flex items-center gap-2"}><StarIcon width={"18px"} /> {movie?.Rating} </div>
                    </div>
                    <p >{movie?.Description}</p>


                    <p>Actors:
                        {
                            movie?.MovieActors.map((actor: MovieActor) => {
                                return (
                                    <span> {actor.ActorName}, </span>
                                )
                            })
                        }
                    </p>

                    <p>Genres:
                        {
                            movie?.MovieGenres.map((genre: MovieGenre) => {
                                return (
                                    <span> {genre.GenreName} </span>
                                )
                            })
                        }
                    </p>
                </div>

                <iframe className={"w-full h-full"} src={movie?.TrailerURL} allowFullScreen />
            </div>

        </div>
    )
}