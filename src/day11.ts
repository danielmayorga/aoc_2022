import { readFile } from 'fs/promises';

interface Monkey{
    items: bigint[];
    operation: (item: bigint) => bigint;
    test: (item: bigint) => void;
    testDivisible: bigint;
    numberInspected: bigint;
}

function part1(monkeys: Monkey[]){
    for (let i=0; i<20; i++){
        for (let monkey of monkeys){
            for (let item of monkey.items){
                const newVal = monkey.operation(item) / 3n;
                monkey.test(newVal);
            }
            monkey.numberInspected += BigInt(monkey.items.length);
            monkey.items = [];
        }
    }
    const [first, second] = monkeys.sort((a, b) => {
        const val = (b.numberInspected - a.numberInspected);
        if (val === 0n){
            return 0;
        } 
        return val > 0n ? 1 : -1
    });
    return first.numberInspected*second.numberInspected;
}

function part2(monkeys: Monkey[]){
    //we notice a property of divisible by and we can modReduce all the nums
    const modReducer = monkeys.reduce((prev, curr) => prev*curr.testDivisible,1n);

    for (let i=0; i<10_000; i++){
        for (let monkey of monkeys){
            for (let item of monkey.items){
                const newVal = (monkey.operation(item%modReducer)%modReducer);
                monkey.test(newVal);
            }
            monkey.numberInspected += BigInt(monkey.items.length);
            monkey.items = [];
        }
    }
    const [first, second] = monkeys.sort((a, b) => {
        const val = (b.numberInspected - a.numberInspected);
        if (val === 0n){
            return 0;
        } 
        return val > 0n ? 1 : -1
    });
    return first.numberInspected*second.numberInspected;
}

async function getMonkeys(): Promise<Monkey[]>{
    const operationRegex = /([\*|\+]) (\d+|old)/;
    function getOperation(operator: "*" | "+", modifier: string): (item: bigint) => bigint {    
        if (modifier === "old"){
            if (operator === "*"){
                return function(item: bigint){
                    return item * item;
                }    
            } else if (operator === "+"){
                return function(item: bigint){
                    return item + item;
                }
            }
            throw new Error("Unsupported operator "+operator);
        }
        const numericModifier = BigInt(modifier);
        if (operator === "*"){
            return function(item: bigint){
                return item * numericModifier;
            }
        } else if (operator === "+"){
            return function(item: bigint){
                return item + numericModifier;
            }
        }
        throw new Error("Unsupported operator "+operator);
    }
    
    
    const numRegex= /\d+/;
    function getTest(divisibleBy: number, trueMonkey: number, falseMonkey: number){
        const mod = BigInt(divisibleBy);
        return function (item: bigint){
            if (item % mod === 0n){
                monkeys[trueMonkey].items.push(item);
            } else {
                monkeys[falseMonkey].items.push(item);
            }
        }
    }

    const fileRaw = await readFile('input/day11.txt', { encoding : 'utf-8'});
    const monkeys = fileRaw.split(/\r?\n\r?\n/).map(chunk =>{
        const segment = chunk.split(/\r?\n/);
        const items = segment[1].substring(segment[1].indexOf(":")+1).split(',').map(BigInt);
        const operationMatch = segment[2].match(operationRegex);
        if (operationMatch == null || operationMatch.length < 3){
            throw new Error("regex match didn't work");
        }
        const operation = getOperation(operationMatch[1] as "*"|"+", operationMatch[2]);
        const divisibleBy = Number(segment[3].match(numRegex)?.[0]);
        const trueMonkey = Number(segment[4].match(numRegex)?.[0]);
        const falseMonkey = Number(segment[5].match(numRegex)?.[0]);
        return {
            items,
            operation,
            test: getTest(divisibleBy, trueMonkey, falseMonkey),
            testDivisible: BigInt(divisibleBy),
            numberInspected: 0n,
        } as Monkey;
    });
    
    return monkeys;
}

let monkeys = await getMonkeys();
const answer1 = part1(monkeys);
monkeys = await getMonkeys();
const answer2 = part2(monkeys);

console.log(`part 1: ${answer1}\npart 2: ${answer2}`)