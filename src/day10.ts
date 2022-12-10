import { readFile } from 'fs/promises';

interface Noop{
    type: 'noop';
}

interface Add {
    type: 'addx';
    num: number;
}

type Command = Noop | Add;

function solution(commands: Command[]){
    let x = 1;
    let sum = 0;
    let commandPosition = 0;
    let crt: boolean[] = new Array(240).fill(false);

    for(let cycle=1; cycle<=240; commandPosition++){
        commandPosition = commandPosition % commands.length;
        let command = commands[commandPosition];
        
        crt[cycle-1] = isSpriteVisible(x, cycle);
        cycle++;
        if (((cycle% 40)-20) === 0) {
            sum += cycle*x;
        }

        if (cycle<240 && command.type === 'addx'){
            crt[cycle-1] = isSpriteVisible(x, cycle);
            cycle++;
            x+=command.num;
            if (((cycle% 40)-20) === 0) {
                sum += cycle*x;
            }
        }
    }

    console.log(`part 1: ${sum}`);
    console.log(printout(crt));
}

function isSpriteVisible(x: number, cycle: number){
    let horizontaValue = (cycle-1)%40;
    return (x-1) <= horizontaValue && horizontaValue <= (x+1);
}

function printout(input: boolean[]){
    let result = "";
    for (let i=0; i< 240;){
        let line = "";
        for(let j =0; j<40;j++, i++){
            line+= input[i] ? "#" : ".";
        }
        result+=line+"\n";
    }
    return result;
}

const fileRaw = await readFile('input/day10.txt', { encoding : 'utf-8'});
const commands = fileRaw.split(/\r?\n/)
                     .map(line => {
                        const components = line.split(' ');
                        if (components.length === 1){
                            return { type: 'noop' } as Noop;
                        }
                        return { type: 'addx', num: Number(components[1])} as Add;
                     });

solution(commands);