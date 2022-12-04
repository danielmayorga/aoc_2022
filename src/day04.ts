import { readFile } from 'fs/promises';

interface Range{
    start: number;
    end: number;
}

const inputRegex = /(\d+)-(\d+),(\d+)-(\d+)/;
const fileRaw = await readFile('input/day04.txt', { encoding : 'utf-8'});
const input: [Range,Range][] = fileRaw.split(/\r?\n/).map(line => {
    const match = line.match(inputRegex);
    if (match == null || match?.length < 5){
        throw Error ("Didn't match regex");
    }
    return [
        {
            start: Number(match[1]),
            end: Number(match[2]),
        },
        {
            start: Number(match[3]),
            end: Number(match[4]),
        }
    ];
});

function part1(input: [Range, Range][]){
    return input.filter(([first,second]) =>
        (first.start <= second.start && first.end >= second.end)
        ||
        (first.start >= second.start && first.end <= second.end)
    ).length;
}

function part2(input: [Range, Range][]){
    return input.filter(([first,second]) =>
        (first.start <= second.end && first.end >= second.start)
    ).length;
}

const answer1 = part1(input);
const answer2 = part2(input);

console.log(`part 1: ${answer1}\npart 2: ${answer2}`)