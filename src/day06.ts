import { readFile } from 'fs/promises';

function solution(input: string, distinctCharacters: number){
    let windowSet = new Set<string>();
    let window: string[] = [];
    for (let i=0; i< input.length; i++){
        let curr = input[i];
        while(windowSet.has(curr)){
            let front = window.shift() as string;
            windowSet.delete(front);
        }
        window.push(curr);
        windowSet.add(curr);
        if (window.length === distinctCharacters){
            return i+1;
        }
    }
}

const fileRaw = await readFile('input/day06.txt', { encoding : 'utf-8'});

const answer1 = solution(fileRaw, 4);
const answer2 = solution(fileRaw, 14);

console.log(`part 1: ${answer1}\npart 2: ${answer2}`)