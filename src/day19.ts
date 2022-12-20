import { readFile } from 'fs/promises';
//haven't decided which type is better

type MineralType = "ore" | "clay" | "obsidian" | "geode";
type RobotType = "oreRobot" | "clayRobot" | "obsidianRobot" | "geodeRobot";
type GenerateDecision = (state: State) => Generator<State, void, unknown>;

enum RobotIndex {
    Ore      = 0,
    Clay     = 1,
    Obsidian = 2,
    Geode    = 3,
}

interface Mineral{
    type: MineralType;
    amount: number;
}

interface Robot{
    type: RobotType;
    cost: Mineral[];
}

interface Blueprint{
    name: number;
    instructions: Robot[];
}

interface State {
    minutes: number;
    oreRobot: number;
    ore: number;
    clayRobot: number;
    clay: number;
    obsidianRobot: number;
    obsidian: number;
    geodeRobot: number;
    geode: number;
}

function CanMakeRobot(state: State, instruction: Robot){
    return instruction.cost.every(cost =>{
        const count = state[cost.type];
        return count >= cost.amount;
    })
}

function MakeRobot(prevState: State, instruction: Robot){
    const newState = {...prevState};
    //subtract the cost
    for(let cost of instruction.cost){
        newState[cost.type] -= cost.amount;
    }
    //increment the Robot counter
    newState[instruction.type]++;
    UpdateState(newState, prevState);
    return newState;
}

function UpdateState(newState: State, oldState: State){
    newState.minutes--;
    newState.ore+=oldState.oreRobot;
    newState.clay+=oldState.clayRobot
    newState.obsidian+=oldState.obsidianRobot;
    newState.geode+=oldState.geodeRobot;
}

function MineralMax(blueprint: Blueprint, mineralSearch: MineralType){
    return blueprint.instructions
            .map(instruction => {
                let oreRecipe =  instruction.cost.find(mineral => mineral.type === mineralSearch);
                return oreRecipe?.amount ?? 0;
            }).reduce((max, curr) => Math.max(max, curr), 0);
}

function MissingOre(robot: Robot, state: State){
    const [ore, other] = robot.cost;
    if (other.amount <= state[other.type]){
        return true;
    }
    return false;
}

function solution(blueprints: Blueprint[], minutes: number, part: '1'|'2'){
    const state : State = {
        minutes,
        oreRobot: 1,
        ore: 0,
        clayRobot: 0,
        clay: 0,
        obsidianRobot: 0,
        obsidian: 0,
        geodeRobot: 0,
        geode: 0
    };

    function CreateGenerateDecision(blueprint: Blueprint){
        //it's not useful to horde ore
        const oreMax = MineralMax(blueprint, 'ore');

        const geodeRobot = blueprint.instructions[RobotIndex.Geode];
        const obsidianRobot = blueprint.instructions[RobotIndex.Obsidian];
        const clayRobot = blueprint.instructions[RobotIndex.Clay];
        const oreRobot = blueprint.instructions[RobotIndex.Ore];

        return function* (state: State){
            
            if (CanMakeRobot(state, geodeRobot)){
                //if you can make a geode...make it. It's always optimal because of our input
                yield MakeRobot(state, geodeRobot);
                return;
            }
            
            if(MissingOre(geodeRobot, state)){
                const doNothingState = {...state};
                UpdateState(doNothingState, state);
                yield doNothingState;
                return;
            }

            if (CanMakeRobot(state, obsidianRobot)){
                yield MakeRobot(state, obsidianRobot);
            }

            if(MissingOre(obsidianRobot, state)){
                const doNothingState = {...state};
                UpdateState(doNothingState, state);
                yield doNothingState;
                return;
            }

            if (CanMakeRobot(state, clayRobot)){
                yield MakeRobot(state, clayRobot);
            }
            
            //don't make more ores than you need
            if (state.oreRobot <= oreMax && CanMakeRobot(state, oreRobot)){
                yield MakeRobot(state, oreRobot);
            }

            if (state.ore <= oreMax){
                const doNothingState = {...state};
                UpdateState(doNothingState, state);
                yield doNothingState;
            }
        }
    }

    function helper(state: State, GenerateDecision: GenerateDecision): number{
        if (state.minutes === 0){
            return state.geode;
        }
        return [...GenerateDecision(state)]
                    .map(newState => helper(newState, GenerateDecision))
                    .reduce((max, curr) => Math.max(max, curr), state.geode);
    }

    const tuples =  blueprints
            .map(blueprint => {
                const GenerateDecision = CreateGenerateDecision(blueprint);
                let result = helper(state, GenerateDecision);
                //console.log("Starting blueprint"+blueprint.name+" "+(new Date()));
                return { maxGeode: result, blueprint};
            });
    if (part === '1'){
        return tuples
            .map(({maxGeode, blueprint}) => maxGeode*blueprint.name)
            .reduce((sum, qualityLevel) => sum+qualityLevel, 0);
    }else{
        return tuples
        .map(({maxGeode}) => maxGeode)
        .reduce((sum, prevGeode) => sum*prevGeode, 1);
    } 
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
                                    type: 'oreRobot',
                                    cost: [{ type: 'ore', amount: ore }]
                                },
                                {
                                    type: 'clayRobot',
                                    cost: [{ type: 'ore', amount: clay }]
                                },
                                {
                                    type: 'obsidianRobot',
                                    cost: [{ type: 'ore', amount: obsidianOre }, { type: 'clay', amount: obsidianClay }]
                                },
                                {
                                    type: 'geodeRobot',
                                    cost: [{ type: 'ore', amount: geodeOre }, { type: 'obsidian', amount: geodObsidian }]
                                },
                            ]} as Blueprint)});

const answer1 = solution(blueprints, 24, '1');
const answer2 = solution(blueprints.slice(0,3), 32,'2');

console.log(`part 1: ${answer1}\npart 2: ${answer2}`);