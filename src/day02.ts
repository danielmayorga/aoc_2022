import { readFile } from 'fs/promises';

enum GameMove{
    Rock= 1,
    Paper = 2,
    Scisor = 3,
}

enum GameState{
    Win = 6,
    Draw = 3,
    Lose = 0,
}

function score(game: string){
    const first = game[0].charCodeAt(0) - 'A'.charCodeAt(0) + 1;
    const second = game[2].charCodeAt(0) - 'X'.charCodeAt(0) + 1;

    if (first === second){
        return GameState.Draw + second;
    }
    switch(first){
        case GameMove.Rock:
            return ((second == GameMove.Paper) ? GameState.Win : GameState.Lose) + second;
        case GameMove.Paper:
            return ((second == GameMove.Scisor) ? GameState.Win: GameState.Lose) + second;
        case GameMove.Scisor:
            return ((second == GameMove.Rock) ? GameState.Win : GameState.Lose) + second;
        default:
            throw Error("shouldn't get here");
    }
}

function part1(input: string[]){
    return input.map(score).reduce((p,c) => p+c, 0);
}

enum ConditionRequired{
    Lose = 1,
    Draw = 2,
    Win = 3,
}

function score2(game: string){
    const first = game[0].charCodeAt(0) - 'A'.charCodeAt(0) + 1;
    const second = game[2].charCodeAt(0) - 'X'.charCodeAt(0) + 1;

    switch(second){
        case ConditionRequired.Draw: 
            return GameState.Draw + first;
        case ConditionRequired.Lose:
            return ((first+1)%3) + 1 + GameState.Lose;
        case ConditionRequired.Win:
            return ((first+3)%3) + 1 + GameState.Win;
        default:
            throw Error("shouldn't get here");
    }
}

function part2(input: string[]){
    return input.map(score2).reduce((p,c) => p+c, 0);
}


const fileRaw = await readFile('input/day02.txt', { encoding : 'utf-8'});
const input = fileRaw.split(/\r?\n/);

const answer1 = part1(input);
const answer2 = part2(input);

console.log(`part 1: ${answer1}\npart 2: ${answer2}`)