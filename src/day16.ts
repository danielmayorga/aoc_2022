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
    const visited = new Set<number>();
    const flowValves = valves.filter(valve => valve.flowRate >0)
                             .map(valve => valve.name);

    //i'm converting the graph to arrays to try to squeeze out some performance
    //this might be in pointless
    const optomizedCost: number[][] = new Array(flowValves.length+1);
    const interimValves = ["AA", ...flowValves].map((elem, index) => ({ valve: elem, index}));
    const optimizedValves = flowValves.map((_,index) => index+1);
    const optimizedValveFlow: number[] = new Array(flowValves.length+1);
    for(let { valve , index } of interimValves){
        optomizedCost[index]=new Array(interimValves.length);
        optimizedValveFlow[index] = graph.get(valve)?.flowRate as number;
        for(let {valve: neighbor, index: neighborIndex} of interimValves){
            optomizedCost[index][neighborIndex] = cost[valve][neighbor] as number;
        } 
    }
    //memo of optimum position
    const memoOptimum: number[][][][]= new Array(27);
    for (let i=0; i<memoOptimum.length; i++){
        memoOptimum[i] = new Array(27);
        for (let j=0; j<27; j++){
            memoOptimum[i][j] = new Array(optimizedValveFlow.length+1);
            for (let k=0; k<optimizedValveFlow.length+1; k++){
                memoOptimum[i][j][k] = new Array(optimizedValveFlow.length+1).fill(0);
            }
        }
    }
    const isLessOptimal = (currIndex: number, elephantIndex: number, myflowRate: number, elephantFlowRate: number, myMinutes: number, elephantMinutes: number, flowSoFar: number) =>{
        const current = (myflowRate*myMinutes + elephantFlowRate*elephantMinutes)+flowSoFar;

        if (memoOptimum[myMinutes][elephantMinutes][currIndex][elephantIndex] > current){
            return true;
        }
        memoOptimum[myMinutes][elephantMinutes][currIndex][elephantIndex] = current;
        return false;
    };

    const initialPerformance = performance.now();
    let previousPerformance = initialPerformance;
    function flowRecurse(currIndex: number, elephantIndex: number, myflowRate: number, elephantFlowRate: number, myMinutes: number, elephantMinutes: number, flowSoFar: number){
        if (visited.size === optimizedValves.length){
            return elephantFlowRate*elephantMinutes + myMinutes*myflowRate + flowSoFar;
        }
        if (myMinutes === 0 && elephantMinutes === 0){
            return flowSoFar;
        }

        if (isLessOptimal(currIndex, elephantIndex, myflowRate, elephantFlowRate, myMinutes, elephantMinutes, flowSoFar)){
            return 0;//not optimal don't explore path
        }

        let flowPaths = 
            optimizedValves
                .filter(valve => !visited.has(valve))
                .map((valve, index)=>{
                    if (visited.size === 0){
                        let now = performance.now();
                        let timeMilli = now-previousPerformance;
                        previousPerformance = now;
                        console.log("percentage: "+ Math.floor((index/optimizedValves.length)*100)+"%");
                        console.log("performance: "+timeMilli+" milliseconds.");
                    }
                    visited.add(valve);

                    const valveFlow = optimizedValveFlow[valve];
                    
                    const myCost = optomizedCost[currIndex][valve] as number+1;
                    const elephantCost = optomizedCost[elephantIndex][valve] as number+1;
                    const myDiff = myMinutes-elephantMinutes;
                    let result: number;
                    if ((myCost-myDiff) < elephantCost){
                        //I'll move
                        const minutes = Math.min(myCost, myMinutes);
                        result = flowRecurse(valve, elephantIndex, myflowRate+valveFlow, elephantFlowRate, myMinutes-minutes,elephantMinutes, flowSoFar+ myflowRate*minutes);    
                    }else{
                        //elephant moves
                        const minutes = Math.min(elephantCost, elephantMinutes);
                        result = flowRecurse(currIndex, valve, myflowRate, elephantFlowRate+valveFlow, myMinutes,elephantMinutes-minutes, (elephantFlowRate*minutes)+flowSoFar);    
                    }
                    visited.delete(valve);
                    return result;
                });
        return Math.max(...flowPaths);
    }
    
    let result = flowRecurse(0, 0, 0, 0, 26, 26, 0);
    console.log("Performance total: "+(performance.now()-initialPerformance)+" milliseconds");
    return result;
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