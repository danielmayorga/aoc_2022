import { readFile } from 'fs/promises';

interface Valve{
    name: string;
    flowRate: number;
    leadsTo: string[];
}

function part1(valves: Valve[]){
    const graph = new Map<string, Valve>();
    for (let valve of valves){
        graph.set(valve.name, valve);
    }
    //I think I'll need to compute the pairwise shortest paths for the nodes
    //with weights i.e. All-Pairs-Shortest-Path
    //Then I think I can iterate through each weighted node but that would be O(V!) where V is weighted...would be terrible runtime
    //this may be the travelling salesman problem...maybe there is an efficient way
}



function part2(valves: Valve[]){

}

const regex = /Valve ([A-Z]+) has flow rate=(-?\d+); tunnels? leads? to valves? (.*)/;
const fileRaw = await readFile('input/day16.txt', { encoding : 'utf-8'});
const valves = fileRaw.split(/\r?\n/)
                .map(line =>{
                    const match =line.match(regex);
                    if (match == null) throw new Error("Parsing Error");
                    return {
                        name: match[1],
                        flowRate: Number(match[2]),
                        leadsTo: match[3].split(",").map(segment => segment.trim()),
                    } as Valve;
                } );


const answer1 = part1(valves);
const answer2 = part2(valves);

console.log(`part 1: ${answer1}\npart 2: ${answer2}`);