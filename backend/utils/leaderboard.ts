const filePath = "data/score.txt";

interface LeaderboardObject {
    name: string;
    score: number;
    time: string;
}

const leaderboard: LeaderboardObject[] = JSON.parse(Deno.readTextFileSync(filePath));

export const readLeaderboard = () => {
    sortLeaderboard();
    return leaderboard;
}

export const insertRecord = (name: string, score: number, time: string) => {
    const record: LeaderboardObject = { "name" : name, "score": score, "time": time };
    sortLeaderboard();
    if (leaderboard.length < 10) {
        leaderboard.push(record);
        writeLeaderboard();
    } else {
        if (record.score > leaderboard[9].score) {
            leaderboard.pop();
            leaderboard.push(record);
            writeLeaderboard();
        }
    }
    return;
}

const writeLeaderboard = () => {
    sortLeaderboard();
    Deno.writeTextFileSync(filePath, JSON.stringify(leaderboard));
    return;
}

const sortLeaderboard = () => {
    leaderboard.sort((a, b) => b.score - a.score);
}