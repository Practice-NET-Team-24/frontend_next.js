import filmsJson from "../mockFilms.json"
import {Movie, MovieActor, MovieGenre} from "@/app/admin/film/edit/types";
import {formatSeconds} from "@/lib/utils";
import {Star, StarIcon} from "lucide-react";
import ModalTrailer from "@/components/ModalTrailer";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";

const data: Movie[] = filmsJson;

export default async function FilmEditDetails({params}: {params: {id: string}}) {
    const {id} = await params;
    const movie = data.find((movie: Movie) => movie.Id + "" === id);
    const actors = movie?.MovieActors.map((actor: MovieActor) => {
        return actor.ActorName
    })
    const genres = movie?.MovieGenres.map((genre: MovieGenre) => {
        return genre.GenreName
    })

     const formHandler = async (formData: FormData) => {
        "use server"
         console.log(formData.get("actors"))
    }



    return (
        <form action={formHandler} className={"flex flex-col gap-4"}>
            <div className={"flex gap-4 ma"}>
                <img
                    width="40%"
                    className={"self-center"}
                    src={movie?.ImageURL}
                    alt={movie?.Name}
                />
                <div className={"flex flex-col gap-4"}>
                    <div className={"flex"}>
                        <h1 className={"text-2xl"}>{movie?.Name}</h1>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            className={"w-min"}
                            defaultValue={movie?.Name}
                        />
                    </div>

                    <div className={"flex flex-col gap-4 font-light"}>

                        <div className="flex items-center gap-4 text-black-300">
                            <span>Min age</span>
                            <Input
                                id="age"
                                type="number"
                                name="age"
                                className={"w-min text-white"}
                                defaultValue={movie?.AgeRestriction}
                            />|
                            <span>Duration(sec)</span>
                            <Input
                                id="duration"
                                type="text"
                                name="duration"
                                className={"w-min text-white"}

                                defaultValue={movie?.Duration}
                            />|
                            <div className={"flex items-center gap-2"}><StarIcon width={"18px"} />  </div>
                            <Input
                                id="rating"
                                type="text"
                                name="rating"
                                className={"w-min text-white"}
                                defaultValue={movie?.Rating}
                            />
                        </div>

                        <p >{movie?.Description}</p>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={movie?.Description}
                            className={" text-white"}
                        />

                        <p>Genres:
                            {
                                movie?.MovieGenres.map((genre: MovieGenre) => {
                                    return (
                                        <span> {genre.GenreName} </span>
                                    )
                                })
                            }
                            <Textarea
                                id="genres"
                                name="genres"
                                className={"text-white"}
                                defaultValue={genres?.join(", ")}
                            />
                        </p>

                        <p>Actors:
                            {
                                movie?.MovieActors.map((actor: MovieActor) => {
                                    return (
                                        <span> {actor.ActorName}, </span>
                                    )
                                })
                            }
                            <Textarea
                                id="actors"
                                name="actors"
                                className={"text-white"}
                                defaultValue={actors?.join(", ")}
                            />
                        </p>
                    </div>


                    <ModalTrailer title={movie?.Name}>
                        <iframe className={"w-full h-[600px]"} src={movie?.TrailerURL} allowFullScreen />
                    </ModalTrailer>
                    <Input
                        id="trailer"
                        type="text"
                        name="trailer"
                        className={" text-white"}
                        defaultValue={movie?.TrailerURL}
                    />

                    <span>image URL</span>
                    <Input
                        id="image"
                        type="url"
                        name="image"
                        className={"text-white"}
                        defaultValue={movie?.ImageURL}
                    />
                </div>

            </div>
            <Button type={"submit"}>
                Save Changes
            </Button>
        </form>
    )
}