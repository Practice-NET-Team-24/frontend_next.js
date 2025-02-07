export type Session = {
    SessionId: number
    Time: string
}

export type MovieGenre = {
    GenreId: number
    GenreName: string
}

export type MovieActor = {
    ActorId: number
    ActorName: string
}

export type Movie = {
    Id: number
    Name: string
    Description: string
    ImageURL: string
    TrailerURL: string
    AgeRestriction: number
    Duration: number
    Rating: number
    Sessions: Session[]
    MovieGenres: MovieGenre[]
    MovieActors: MovieActor[]
}