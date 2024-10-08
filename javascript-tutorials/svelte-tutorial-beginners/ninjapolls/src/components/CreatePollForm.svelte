<script>
    import Button from "../shared/Button.svelte";
    let fields = {
        question: "",
        answerA: "",
        answerB: "",
    };

    const submitHandler = () => {
        console.log(fields);
    }
</script>

<form on:submit|preventDefault={submitHandler}>
    <div class="form-field">
        <label for="question">Poll Question:-</label>
        <input type="text" name="question" id="question" bind:value={fields.question} />
    </div>
    <div class="form-field">
        <label for="answerA">Answer A:</label>
        <input type="text" name="answerA" id="answerA" bind:value={fields.answerA} />
    </div>
    <div class="form-field">
        <label for="answerB">Answer B:</label>
        <input type="text" name="answerB" id="answerB" bind:value={fields.answerB} />
    </div>
    <Button type="secondary" flat={true} inverse={false}>Add Poll</Button>
</form>

<style>
    form {
        width: 400px;
        margin: 0 auto;
        text-align: center;
    }
    .form-field {
        margin: 18px auto;
    }
    input{
        width: 100%;
        border-radius: 6px;
    }
    label{
        margin: 10px auto;
        text-align: left;
    }
</style>
