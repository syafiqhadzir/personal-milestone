<script>
    // import { onMount, onDestroy } from "svelte";
    import { fade, scale } from "svelte/transition";
    import { flip } from "svelte/animate";
    import PollStore from "../stores/PollStore.js";
    import PollDetails from "./PollDetails.svelte";

    // export let polls = []; * we don't need this anymore

    // const unsub = PollStore.subscribe(data => {
    //     console.log(data);
    //     polls = data;
    // });

    // onMount(() => {
    //     // gets data from the store
    //     console.log('component mounted')
    // });

    // onDestroy(() => {
    //     // unsubscribes from the store
    //     console.log('component destroyed')
    //     unsub();
    // });
</script>

<div class="poll-list">
    {#each $PollStore as poll (poll.id)}
        <div in:fade out:scale|local animate:flip={{ duration: 500 }}>
            <PollDetails {poll} />
        </div>
    {/each}
</div>

<style>
    .poll-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 20px;
    }
</style>
