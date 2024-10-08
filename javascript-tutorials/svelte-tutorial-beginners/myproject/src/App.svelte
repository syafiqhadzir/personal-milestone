<script>
	import Modal from "./Modal.svelte";

	let people = [
		{ name: "Yoshi", beltColour: "black", age: 25, id: 1 },
		{ name: "Mario", beltColour: "orange", age: 45, id: 2 },
		{ name: "Luigi", beltColour: "brown", age: 35, id: 3 },
	];

	const handleClick = (e, id) => {
		// delete the person from people
		people = people.filter((person) => person.id != id);
		console.log(e);
	};

	let num = 53;
</script>

<Modal message="Hey, I am prop value." isPromo={true} />

<!-- <main>
	<div>
		<h4>{people[0].name}</h4>
		<h4>{people[0].beltColour}</h4>
	</div>
	<div>
		<h4>{people[1].name}</h4>
		<h4>{people[1].beltColour}</h4>
	</div>
	<div>
		<h4>{people[2].name}</h4>
		<h4>{people[2].beltColour}</h4>
	</div>
</main> -->

{#if num > 20}
	<p>Greater than 20</p>
{:else if num > 5}
	<p>Greater than 5</p>
{:else}
	<p>Not greater than 5</p>
{/if}

<main>
	{#each people as person (person.id)}
		<div>
			<h4>{person.name}</h4>
			{#if person.beltColour === "black"}
				<p><strong>Master Ninja</strong></p>
			{/if}
			<p>{person.age} years old, {person.beltColour} belt.</p>
			<button on:click={(e) => handleClick(e, person.id)}>Delete</button>
		</div>
	{:else}
		<p>There are no people to show ...</p>
	{/each}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
