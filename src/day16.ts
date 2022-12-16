import { readFile } from 'fs/promises';

interface Valve{
    name: string;
    flowRate: number;
    leadsTo: string[];
}

function floyd(graph: Map<string, Valve>){
    let nodes = [...graph.keys()];
    let cost: Record<string, Record<string, number|undefined>> = {};
    for (let i=0; i< nodes.length; i++){
        let nodeName = nodes[i]
        //set cost per path
        cost[nodeName] = {};
        cost[nodeName][nodeName] = 0;

        let node = graph.get(nodeName) as Valve;
        for(let neighbor of node.leadsTo){
            cost[nodeName][neighbor] = 1;
        }
    }

    for (let k of nodes){
        for (let i of nodes){
            for (let j of nodes){
                let costIToJ = cost[i][j] ?? Number.MAX_SAFE_INTEGER;
                let costIToK = cost[i][k];
                let costKtoJ = cost[k][j];
                if (costIToK && costKtoJ && costIToJ > (costIToK+costKtoJ)){
                    cost[i][j] = costIToK + costKtoJ;
                }
            }
        }
    }

    return cost;
}

function part1(valves: Valve[]){
    const graph = new Map<string, Valve>();
    for (let valve of valves){
        graph.set(valve.name, valve);
    }

    const cost = floyd(graph);
    const visited = new Set<string>();
    const flowValves = valves.filter(valve => valve.flowRate >0)
                             .map(valve => valve.name);

    function flowRecurse(curr: string, flowRate: number, minutes: number){
        if (minutes <= 0){
            return 0;
        }

        let flowPaths: number[] = flowValves
            .filter(valve => !visited.has(valve))
            .map(valve =>{
                visited.add(valve);
                const weight = cost[curr][valve] as number;
                const newFlowRate = flowRate+ (graph.get(valve)?.flowRate as number);
                const minMinutes = Math.min(minutes, weight+1);
                let result = (flowRate*minMinutes)+ flowRecurse(valve, newFlowRate, minutes-minMinutes);
                visited.delete(valve);
                return result;
            });

        return Math.max(...flowPaths, flowRate*minutes);
    }
    return flowRecurse("AA", 0, 30);
}



function part2(valves: Valve[]){

    const graph = new Map<string, Valve>();
    for (let valve of valves){
        graph.set(valve.name, valve);
    }

    const cost = floyd(graph);
    const visited = new Set<string>();
    const flowValves = valves.filter(valve => valve.flowRate >0)
                             .map(valve => valve.name);

    const pairs: [string,string][] = [];
    for(let i=0; i<flowValves.length; i++){
        for(let j=i+1; j<flowValves.length; j++){
            pairs.push([flowValves[i], flowValves[j]]);
        }
    }

    function flowRecurse(curr: string, elephant: string, myflowRate: number, elephantFlowRate: number, myMinutes: number, elephantMinutes: number){
        if (visited.size === flowValves.length){
            return elephantFlowRate*elephantMinutes + myMinutes*myflowRate;
        }

        let flowPaths = 
            flowValves
                .filter(valve => !visited.has(valve))
                .map(valve=>{
                    visited.add(valve);

                    const valveFlow = graph.get(valve)?.flowRate as number;
                    
                    const myCost = cost[curr][valve] as number+1;
                    const elephantCost = cost[elephant][valve] as number+1;
                    const myDiff = myMinutes-elephantMinutes;
                    let result: number;
                    if ((myCost-myDiff) < elephantCost){
                        //I'll move
                        const minutes = Math.min(myCost, myMinutes);
                        result = (myflowRate*minutes)+flowRecurse(valve, elephant, myflowRate+valveFlow, elephantFlowRate, myMinutes-minutes,elephantMinutes);    
                    }else{
                        //elephant moves
                        const minutes = Math.min(elephantCost, elephantMinutes);
                        result = (elephantFlowRate*minutes)+flowRecurse(curr, valve, myflowRate, elephantFlowRate+valveFlow, myMinutes,elephantMinutes-minutes);    
                    }
                    visited.delete(valve);
                    return result;
                });
        return Math.max(...flowPaths);
    }
    return flowRecurse("AA", "AA", 0, 0, 26, 26);
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
console.log(`part 1: ${answer1}`);
const answer2 = part2(valves);
console.log(`part 2: ${answer2}`);