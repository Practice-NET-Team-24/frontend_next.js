export let films = [
  {
    id: 1,
    name: "Avengers: Endgame",
    description: "Superhero movie",
    imageURL: "https://example.com/image1.jpg",
    trailerURL: "https://example.com/trailer1.mp4",
    ageRestriction: 13,
    duration: 181,
    rating: 9,
    movieActors: [{ actorId: 1, role: "Tony Stark" }],
    movieGenres: [{ genreId: 1 }],
  },
];

export let actors = [
  { id: 1, name: "Robert", surname: "Downey Jr." },
  { id: 2, name: "Chris", surname: "Evans" },
];

export let genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Drama" },
  { id: 3, name: "Sci-Fi" },
];
