<script>
    let name;
    let beltColour;
    let age;

    const handleSubmit = () => {
        console.log (name, beltColour, age);
    }
</script>

<form on:submit|preventDefault={handleSubmit}>
    <input type="text" placeholder="Name" bind:value={name} />
    <input type="text" placeholder="Belt Colour" bind:value={beltColour} />
    <input type="number" placeholder="Age" bind:value={age} />
    <button>Add Person</button>
</form>

<style>
</style>
