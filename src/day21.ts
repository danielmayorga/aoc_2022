import { readFile } from 'fs/promises';

interface Monkey{
    name: string;
    command: number | Instruction;
    containsMe?: boolean;
}

interface Instruction{
    first: string;
    operator: string;
    second: string;
}

function part1(monkeyMap: Map<string, Monkey>){
    const root =  monkeyMap.get('root') as Monkey;
    return runCommand(monkeyMap, root);
}

function part2(monkeyMap: Map<string, Monkey>){
    const root =  monkeyMap.get('root') as Monkey;
    //mark branches is containing "me" i.e. humn
    branchContainsMe(monkeyMap, root);
    const {first, second} = root.command as Instruction;
    const firstBranch = monkeyMap.get(first)!;
    const secondBranch = monkeyMap.get(second)!;
    let value: number = 0; let containingBranch= firstBranch;
    if (firstBranch.containsMe){
        value = runCommand(monkeyMap, secondBranch);
        containingBranch = firstBranch;
    }else{
        value = runCommand(monkeyMap, firstBranch);
        containingBranch = secondBranch;
    }

    return solveForMe(monkeyMap, value, containingBranch)
}

function runCommand(monkeyMap:Map<string, Monkey> , monkey: Monkey): number{
    if (typeof monkey.command === "number"){
        return monkey.command;
    }

    const {first: varA, second: varB, operator} = monkey.command;

    let a = runCommand(monkeyMap , monkeyMap.get(varA)!);
    let b = runCommand(monkeyMap , monkeyMap.get(varB)!);
    switch(operator){
        case "+":
            return a+b;
        case "*":
            return a*b;
        case "/":
            return a/b;
        case "-":
            return a-b;
        default: 
            throw new Error("Not supported: "+operator);
    }
}

const meKey = "humn";
function branchContainsMe(monkeyMap: Map<string, Monkey>, root: Monkey): boolean{
    if (root.name === meKey){
        root.containsMe = true;
        return true;
    }

    if (typeof root.command === "number"){
        root.containsMe = false;
        return false;
    }

    const { first, second }= root.command;
    const left = branchContainsMe(monkeyMap, monkeyMap.get(first)!);
    const right =  branchContainsMe(monkeyMap, monkeyMap.get(second)!);
    root.containsMe = left || right;
    return left || right;
}

function solveForMe(monkeyMap: Map<string, Monkey>, value: number, monkey: Monkey): number{
    if (monkey.name === meKey){
        return value;
    }
    const {first, second, operator} = monkey.command as Instruction;
    const firstBranch = monkeyMap.get(first)!;
    const secondBranch = monkeyMap.get(second)!;

    if (firstBranch.containsMe){
        const secondValue =  runCommand(monkeyMap, secondBranch);
        let newValue = value;
        switch(operator){
            case "+":
                newValue -= secondValue;
                break;
            case "*":
                newValue = newValue/secondValue;
                break;
            case "/":
                newValue *= secondValue;
                break;
            case "-":
                newValue += secondValue;
                break;
            default: 
            throw new Error("not supported");
        }

        return solveForMe(monkeyMap, newValue, firstBranch);

    }else{
        const firstValue = runCommand(monkeyMap, firstBranch);
        let newValue = value;
        switch(operator){
            case "+":
                newValue -= firstValue;
                break;
            case "*":
                newValue /= firstValue;
                break;
            case "/":
                newValue = firstValue/newValue;
                break;
            case "-":
                newValue = firstValue - newValue;
                break;
            default: 
            throw new Error("not supported");
        }
        return solveForMe(monkeyMap, newValue, secondBranch);
    }
}

async function generateMonkeys(){
    const numRegex = /([a-z]+): (\d+)/;
    const operatorRegex = /([a-z]+): ([a-z]+) ([\+\-\/\*]) ([a-z]+)/
    const fileRaw = await readFile('input/day21.txt', { encoding : 'utf-8'});
    const monkeys: Monkey[] = fileRaw.split(/\r?\n/).map(line =>{
        const match = line.match(numRegex);
        if (match){
            return {
                name: match[1],
                command: Number(match[2]),
            } as Monkey;
        }else{
            const match = line.match(operatorRegex);
            if (match==null){
                throw new Error("Did not match :( ");
            }
            return {
                name: match[1],
                command: {
                    first: match[2], 
                    operator: match[3], 
                    second: match[4]
                },
            } as Monkey;
        }
    });

    const monkeyMap = new Map<string, Monkey>();
    for (let monkey of monkeys){
        monkeyMap.set(monkey.name, monkey);
    }
    return monkeyMap;
}

interface Monkey2{
    name: string;
    command: number | string | (() => number|string);
}

const monkeyMap = await generateMonkeys();

const answer1 = part1(monkeyMap);
const answer2 = part2(monkeyMap);

console.log(`part 1: ${answer1}\npart 2: ${answer2}`);