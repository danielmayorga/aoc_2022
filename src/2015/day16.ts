import { readFile } from 'fs/promises';

type Sue = Record<string, number>;
const regex = /([a-zA-Z]+): (-?\d+)/g;
const fileRaw = await readFile('input/2015/day16.txt', { encoding : 'utf-8'});
const sues = fileRaw
                .split(/\r?\n/)
                .map(line => {
                    const matches = [...line.matchAll(regex)];
                    if (matches.length !== 3) throw new Error("something went wrong");
                    let sue: Sue =  { };
                    for (let i=0; i<matches.length; i++){
                        sue[matches[i][1]] = Number(matches[i][2])
                    };
                    return sue;
                });

                /**
 * Pretty straight forward:
 * Create an object/map for the Sue like objects
 * Create a "master" object/map for the values to match up against
 * 
 * part 1 - return the sue where all the key/value pairs match with the "masterObject"
 * part 2 - return the sue where all the key/value pairs satisfy the requirements. This is 
 * done with a switch case on specific strings
 */
function solution(sues: Sue[]){
    let masterObject = {
        children: 3,
        cats: 7,
        samoyeds: 2,
        pomeranians: 3,
        akitas: 0,
        vizslas: 0,
        goldfish: 5,
        trees: 3,
        cars: 2,
        perfumes: 1,
    } as Record<string, number>;

    const part1 = sues.findIndex(sue => {
        for (let key of Object.keys(sue)){
            if (masterObject[key] !== sue[key]){
                return false;
            }
        }
        return true;
    }) + 1;
    const part2 = sues.findIndex(sue => {
        for (let key of Object.keys(sue)){
            switch(key){
                case "cats":
                case "trees":
                if (masterObject[key] >= sue[key]){
                    return false;
                }   
                break;
                case "pomeranians":
                case "goldfish":
                if (masterObject[key] <= sue[key]){
                    return false;
                } 
                break;
                default: 
                if (masterObject[key] !== sue[key]){
                    return false;
                }
                break;
            }
        }
        return true;
    }) + 1;

    return { part1, part2 }
}

const {part1, part2} = solution(sues);
console.log(`part 1: ${part1}\npart 2: ${part2}`);