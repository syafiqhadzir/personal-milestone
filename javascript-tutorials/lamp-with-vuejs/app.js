const app = Vue.createApp({
    // data, functions
    // template: '<h2>I am the template</h2>'

    data() {
        return {
            url: 'https://www.thenetninja.co.uk',
            showBooks: true,
            // title: 'The Final Empire',
            // author: 'Brandon Sanderson',
            // age: 45,
            // x: 0,
            // y: 0,
            books: [{
                    title: 'Name of The Wind',
                    author: 'Patrick Rothfuss',
                    img: 'assets/1.jpg',
                    isFav: true
                },
                {
                    title: 'The Way of King',
                    author: 'Brandon Sanderson',
                    img: 'assets/2.jpg',
                    isFav: false
                },
                {
                    title: 'The Final Empire',
                    author: 'Brandon Sanderson',
                    img: 'assets/3.jpg',
                    isFav: true
                }
            ]
        }
    },
    methods: {
        // changeTitle(title) {
        //     // this.title = 'Words of Randiance'
        //     this.title = title
        // }

        toggleShowBooks() {
            this.showBooks = !this.showBooks
        },
        // handleEvent(e, data) {
        //     console.log(e, e.type)
        //     if (data) {
        //         console.log(data)
        //     }
        // },
        toggleFav(book) {
            book.isFav = !book.isFav
        }
        // handleMouseMove(e) {
        //     this.x = e.offsetX
        //     this.y = e.offsetY
        // }
    },
    computed: {
        filteredBooks() {
            return this.books.filter((book) => book.isFav)
        }
    }
})

app.mount('#app')

// Challenge - Add to Favs
//      - attach a click event to each li tag (for each books)
//      - when a user clicks an li, toggle the 'isFav' property of that book