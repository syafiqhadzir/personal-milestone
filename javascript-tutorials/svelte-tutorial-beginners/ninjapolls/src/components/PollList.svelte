<script>
    export let polls = [];
</script>

<div class="poll-list">
    {#each polls as poll (poll.id)}
        <p>{poll.question}</p>
    {/each}
</div>

<style>
    .poll-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 20px;
    }
</style>
