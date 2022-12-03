import { readFile } from 'fs/promises';

function getCharacterValue(char: string){
    const charCode = char.charCodeAt(0);
    if (charCode >=97){//lowercase
        return charCode - 96;
    }
    return charCode - 'A'.charCodeAt(0) + 27;
}

function puzzle1(input: string){
    const set = new Set();
    
    for (let char of input.substring(0, input.length/2)){
        set.add(char);
    }
    for (let char of input.substring(input.length/2)){
        if (set.has(char)){
            return getCharacterValue(char);
        }
    }
    throw Error('should have answer!');
}

function part1(input: string[]){
    return input.map(puzzle1).reduce((p,c) => p+c, 0);
}

function puzzle2(...input: string[]){
    const set = new Set();
    const set2 = new Set();
    for (let char of input[0]){
        set.add(char);
    }

    for(let char of input[1]){
        if (set.has(char)){
            set2.add(char);
        }
    }

    for (let char of input[2]){
        if (set2.has(char)){
            return getCharacterValue(char);
        }
    }

    throw Error('should have answer');
}

function part2(input: string[]){
    let sum = 0;
    for (let i=0; i<input.length; i+=3){
        sum+=puzzle2(...input.slice(i, i+3));
    }
    return sum;
}

const fileRaw = await readFile('input/day03.txt', { encoding : 'utf-8'});
const input = fileRaw.split(/\r?\n/);

const answer1 = part1(input);
const answer2 = part2(input);

console.log(`part 1: ${answer1}\npart 2: ${answer2}`)