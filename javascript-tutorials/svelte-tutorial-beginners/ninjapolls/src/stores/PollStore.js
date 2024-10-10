import { writable } from 'svelte/store';

const PollStore = writable([
    {
        id: 1,
        question: "What is your favorite programming language?",
        answerA: "JavaScript",
        answerB: "Python",
        votesA: 10,
        votesB: 20,
    },
]);

export default PollStore;
