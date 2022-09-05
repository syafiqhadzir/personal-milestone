// Sync
// sync = (string) => console.log(string)

// sync('First')
// sync('Second')
// sync('Third')

// Async
// Callback
// async = (comment, callback) => {
//     setTimeout(() => {
//         console.log(comment)
//         callback()
//     }, Math.floor(Math.random() * 100))
// }

// async('One', () => {
//     async('Two', () => {
//         async('Three', () => {
//             console.log('Ends here.')
//         })
//     })
// })

// Promise

// async = (comment) => {
//     return new Promise((resolve, reject) => {
//         setTimeout = () => {
//             console.log(comment)
//             resolve() // Pending, resolve, reject
//         }, Math.floor(Math.random() * 100)
//     })
// }

// async('One')
//     .then = () => async('Two')
//         .then = () => async('Three')

// Async-Await
print = (comment) => {
    return new Promise((resolve, reject) => {
        setTimeout = () => {
            console.log(comment)
            resolve()
        }, Math.floor(Math.random() * 100)
    })
}

async function printAll() {
    await print('One')
    await print('Two')
    await print('Three')
}

printAll()