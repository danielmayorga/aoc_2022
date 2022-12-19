import { readFile } from 'fs/promises';
//haven't decided which type is better

type Mineral = "ore" | "clay" | "obsidian" | "geode";

interface MineralCost{
    type: Mineral;
    cost: number;
}

interface Robot{
    type: Mineral;
    cost: MineralCost[];
}

interface Blueprint{
    name: number;
    instructions: Robot[];
}

function part1(blueprints: Blueprint[]){
    return blueprints;
}

function part2(){

}



const regex = /(\d+)/g;
const fileRaw = await readFile('input/day19.txt', { encoding : 'utf-8'});
const blueprints = fileRaw.split(/\r?\n/)
                    .map(line => {
                        const [num, ore, clay, obsidianOre, obsidianClay, geodeOre, geodObsidian] = [...line.matchAll(regex)].map(match => {
                            let variable = Number(match[0])
                            if (Number.isNaN(variable)){
                                throw new Error("failed to map");
                            }
                            return variable;
                        });
                        return ({
                            name: num,
                            instructions: [
                                {
                                    type: 'ore',
                                    cost: [{ type: 'ore', cost: ore }]
                                },
                                {
                                    type: 'clay',
                                    cost: [{ type: 'ore', cost: clay }]
                                },
                                {
                                    type: 'obsidian',
                                    cost: [{ type: 'ore', cost: obsidianOre }, { type: 'clay', cost: obsidianClay }]
                                },
                                {
                                    type: 'geode',
                                    cost: [{ type: 'ore', cost: geodeOre }, { type: 'obsidian', cost: geodObsidian }]
                                },
                            ]} as Blueprint)});

const answer1 = part1(blueprints);
const answer2 = part2();

console.log(`part 1: ${answer1}\npart 2: ${answer2}`);