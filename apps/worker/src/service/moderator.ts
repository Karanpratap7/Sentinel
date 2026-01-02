export const moderate = async (content: string) => {
    const bannedWords = ["idiot", "stupid"];

    const found = bannedWords.some((w) =>
         content.toLowerCase().includes(w)
    );

    if (found) {
        return {
            actions: "remove",
            score: 0.95
        };
    }

    return {
        action: "none",
        score: 0.01
    };
}