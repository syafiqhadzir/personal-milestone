<script>
	import Header from "./components/Header.svelte";
	import Tabs from "./shared/Tabs.svelte";
	import PollList from "./components/PollList.svelte";
	import CreatePollForm from "./components/CreatePollForm.svelte";
	import Footer from "./components/Footer.svelte";

	// tabs
	let items = ["Current Polls", "Add Poll"];
	let activeItem = "Current Polls";

	const tabChange = (e) => (activeItem = e.detail);

	// polls
	let polls = [
		{
			id: 1,
			question: "What is your favorite programming language?",
			answerA: "JavaScript",
			answerB: "Python",
			votesA: 10,
			votesB: 20,
		},
	];

	const handleAdd = (e) => {
		const poll = e.detail;
		polls = [poll, ...polls];
		console.log(poll);
		activeItem = "Current Polls";
	};

	const handleVote = (e) => {
		const { id, option } = e.detail;
		
		let copiedPolls = [...polls];
		let upvotedPoll = copiedPolls.find((poll) => poll.id == id);

		if (option === "a") {
			upvotedPoll.votesA++;
		} else {
			upvotedPoll.votesB++;
		}
		// simplified
		// upvotedPoll.votesA = option === "a" ? upvotedPoll.votesA++;
		// upvotedPoll.votesB = option === "b" ? upvotedPoll.votesB++;

		polls = copiedPolls;
	};
</script>

<Header />

<main>
	<Tabs {activeItem} {items} on:tabChange={tabChange} />
	{#if activeItem === "Current Polls"}
		<PollList {polls} on:vote={handleVote} />
	{:else if activeItem === "Add Poll"}
		<CreatePollForm on:add={handleAdd} />
	{/if}
</main>

<Footer />

<style>
	main {
		width: 100%;
		max-width: 960px;
		margin: 40px auto;
	}
</style>
