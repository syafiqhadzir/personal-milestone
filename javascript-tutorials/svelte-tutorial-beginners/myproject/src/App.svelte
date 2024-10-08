<script>
	import Modal from "./Modal.svelte";
	import AddPersonForm from "./AddPersonForm.svelte";

	let showModal = false;

	const toggleModal = () => {
		showModal = !showModal;
	};

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

	// let num = 53;

	const addPerson = (e) => {
		// console.log(e.detail);
		// people.push(e.detail);
		const person = e.detail;
		people = [person, ...people];
		showModal = false;
	};
</script>

<Modal {showModal} on:click={toggleModal}>
	<!-- <h3>Add a New Person</h3> -->
	<AddPersonForm on:addPerson={addPerson} />
	<!-- <div slot="title">
		<h3>Add a New Person</h3>
	</div> -->
</Modal>

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

<!-- {#if num > 20}
	<p>Greater than 20</p>
{:else if num > 5}
	<p>Greater than 5</p>
{:else}
	<p>Not greater than 5</p>
{/if} -->

<main>
	<button on:click={toggleModal}>Open Modal</button>
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
