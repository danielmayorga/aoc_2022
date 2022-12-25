import { readFile } from 'fs/promises';

const charMultiple: Record<string, number> = {
    "2": 2,
    "1": 1,
    "0": 0,
    "-": -1,
    "=": -2,
}

function toDecimal(snafu: string):number{
    let value = 0;
    let position = 1;
    for(let char of [...snafu].reverse()){
        value += charMultiple[char]*position;
        position*=5;
    }
    return value;
}

function toSnafu(sum: number): string{
    let result = "";
    while(sum){
        const currentPosition = sum%5;
        result+="012=-"[currentPosition];
        if (currentPosition >=3){
            sum+=5;
        }
        sum = Math.floor(sum/5);
    }

    return [...result].reverse().join("");
}

function solution(snafus: string[]){
    let result = snafus.map(toDecimal).reduce((sum, current) => sum+current,0);
    return toSnafu(result);
}


const fileRaw = await readFile('input/day25.txt', { encoding : 'utf-8'});
const lines =  fileRaw.split(/\r?\n/);

const answer = solution(lines);
console.log(`Solution : ${answer}`);