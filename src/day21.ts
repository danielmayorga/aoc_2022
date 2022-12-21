import { readFile } from 'fs/promises';

interface Monkey{
    name: string;
    command: number | (() => number);
}

function part1(monkeyMap: Map<string, Monkey>){
    let result =  monkeyMap.get('root')!.command;
    return typeof result === "number" ? result: result();
}

function part2(monkeyMap: Map<string, Monkey>){
    
}


async function generateMonkeys(){

    const monkeyMap = new Map<string, Monkey>();
    function generateCommand(varA: string, command: string, varB: string){
        return function(){
            let a = monkeyMap.get(varA)!.command;
            let b = monkeyMap.get(varB)!.command;
            if (typeof a !== 'number'){
                a = a();
            }
            if (typeof b !== 'number'){
                b = b();
            }
            switch(command){
                case "+":
                    return a+b;
                case "*":
                    return a*b;
                case "/":
                    return a/b;
                case "-":
                    return a-b;
                default: 
                    throw new Error("Not supported: "+command);
            }
        }
    }

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
                command: generateCommand(match[2], match[3], match[4]),
            } as Monkey;
        }
    });

    for (let monkey of monkeys){
        monkeyMap.set(monkey.name, monkey);
    }
    return monkeyMap;
}

const monkeyMap = await generateMonkeys();

const answer1 = part1(monkeyMap);
const answer2 = part2(monkeyMap);

console.log(`part 1: ${answer1}\npart 2: ${answer2}`);