var myMovie = {
    title: "The Social Network",
    releaseYear: "2010",
    duration: 2.0,
    actors: [
        {
            name: "Jessie Eisenberg",
            birthday: new Date("October 5, 1983"),
            hometown: "New York, New York"
        },
        {
            name: "Roonie Mara",
            birthday: new Date("April 1, 1985"),
            hometown: "Bedford New York"
        }
    ]
}

document.write(myMovie.duration)
document.write(myMovie.actors[0].name)