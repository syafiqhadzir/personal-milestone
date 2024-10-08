<script>
	import Header from "./components/Header.svelte";
	import Tabs from "./shared/Tabs.svelte";
	import CreatePollForm from "./components/CreatePollForm.svelte";
	import Footer from "./components/Footer.svelte";

	// tabs
	let items = ['Current Polls', 'Add Poll'];
	let activeItem = 'Current Polls';

	const tabChange = (e) => {
		activeItem = e.detail;
	};
</script>

<Header />

<main>
	<Tabs {activeItem} {items} on:tabChange={tabChange} />
	{#if activeItem === 'Current Polls'}
		<p>Poll list component goes here ...</p>
	{:else if activeItem === 'Add Poll'}
		<CreatePollForm />
	{/if}
</main>

<Footer />

<style>
	main {
		max-width: 960px;
		margin: 40px auto;
	}
</style>
