import pizzas from '../src/data.json'

test('pizza returns new york last', () => {
    const pizza1 = pizzas[0]
    const pizza2 = pizzas[1]
    const pizza3 = pizzas[2]
    const pizza = jest.fn(currentPizza => currentPizza.name)

    pizza(pizza1) // Chicago Pizza
    pizza(pizza2) // Neopolitan Pizza
    pizza(pizza3) // New York Slice

    expect(pizza).toHaveLastReturnedWith('New York Pizza')
})

test('pizza data has New York Pizza and matches as an object', () => {
    const newYorkPizza = {
        "id": 3,
        "name": "New York Pizza",
        "image": "/images/ny-pizza.jpg",
        "desc": "New York-style pizza has slices that are large and wide with a thin crust that is foldable yet crispy. It is traditionally topped with tomato sauce and mozzarella cheese.",
        "price": 8
    }
    expect(pizzas[2]).toMatchObject(newYorkPizza)
})

test('expect a promise to resolve', async () => {
    const user = {
        getFullName: jest.fn(() => Promise.resolve('Karl Hadwen'))
    }
    await expect(user.getFullName('Karl Hadwen')).resolves.toBe('Karl Hadwen')
})

test('expect a promise to reject', async () => {
    const user = {
        getFullName: jest.fn(() => Promise.reject(new Error('Something went terribly wrong.')))
    }
    await expect(user.getFullName('Karl Hadwen')).rejects.toThrow('Something went terribly wrong.')
})