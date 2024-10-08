<script>
    let name;
    let beltColour;
    let age;
    // let fighting = false;
    // let sneaking = false;
    // let running = false;
    let skills = [];

    const handleSubmit = () => {
        console.log(name, beltColour, age, skills);
    };
</script>

<form on:submit|preventDefault={handleSubmit}>
    <input type="text" placeholder="Name" bind:value={name} />
    <input type="number" placeholder="Age" bind:value={age} />
    <label for="skills">Skills:-</label>
    <!-- <input type="checkbox" bind:checked={fighting} /> Fighting<br />
    <input type="checkbox" bind:checked={sneaking} /> Sneaking<br />
    <input type="checkbox" bind:checked={running} /> Running<br /> -->
    <input type="checkbox" bind:group={skills} value="fighting" /> Fighting
    <br />
    <input type="checkbox" bind:group={skills} value="sneaking" /> Sneaking
    <br />
    <input type="checkbox" bind:group={skills} value="running" /> Running
    <br />
    <label for="beltColour">Belt Colour:-</label>
    <select id="beltColour" bind:value={beltColour}>
        <option value="black">Black</option>
        <option value="orange">Orange</option>
        <option value="brown">Brown</option>
        <option value="white">White</option>
    </select>
    <button>Add Person</button>
</form>

<style>
</style>
