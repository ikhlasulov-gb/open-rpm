const ENCRYPTED_DATA = "eyIxIjo0LCIyIjo1LCIzIjoxLCI0IjoyLCI1Ijo2LCI2IjozLCI3Ijo2LCI4IjoyLCI5IjoxLCIxMCI6MywiMTEiOjQsIjEyIjo1LCIxMyI6MiwiMTQiOjYsIjE1IjoxLCIxNiI6MiwiMTciOjEsIjE4IjozLCIxOSI6NSwiMjAiOjYsIjIxIjo0LCIyMiI6MywiMjMiOjQsIjI0Ijo1LCIyNSI6OCwiMjYiOjIsIjI3IjozLCIyOCI6OCwiMjkiOjcsIjMwIjo0LCIzMSI6NSwiMzIiOjEsIjMzIjo3LCIzNCI6NiwiMzUiOjEsIjM2IjoyLCIzNyI6MywiMzgiOjQsIjM5IjozLCI0MCI6NywiNDEiOjgsIjQyIjo2LCI0MyI6NSwiNDQiOjQsIjQ1IjoxLCI0NiI6MiwiNDciOjUsIjQ4Ijo2LCI0OSI6NywiNTAiOjYsIjUxIjo4LCI1MiI6MiwiNTMiOjEsIjU0Ijo1LCI1NSI6MSwiNTYiOjYsIjU3IjozLCI1OCI6MiwiNTkiOjQsIjYwIjo1fQ==";

function getAnswers() {
    try {
        const jsonString = atob(ENCRYPTED_DATA);
        return JSON.parse(jsonString);
    } catch (e) {
        console.error("Reading error:", e);
        return {};
    }
}
