import { readFile } from 'fs/promises';

function part1(elves: number[][]){
    const calories = elves.map(elf => elf.reduce((p,c) => p+c, 0));
    return Math.max(...calories);
}

const part2 = (elves: number[][]) => 
    elves.map(elf => elf.reduce((p,c) => p+c, 0))//get calorie sum
        .sort((a,b) => b-a) //descending order
        .slice(0,3) // get the first 3 elements
        .reduce((p,c) => p+c, 0); // sum the values


const fileRaw = await readFile('input/day01.txt', { encoding : 'utf-8'});
const elves = fileRaw.split(/\r?\n\r?\n/) // 2 new line splits regardless of OS
                     .map(elfSegment => elfSegment.split('\n').map(Number));

const answer1 = part1(elves);
const answer2 = part2(elves);

console.log(`part 1: ${answer1}\npart 2: ${answer2}`)