import { readFile } from 'fs/promises';

type Stack = string[];
type Stacks = Stack[];
interface Move {
    count: number;
    from: number;
    to: number;
}

function part1(stacks: Stacks, moves: Move[]){
    for (const move of moves){
        const {count, from, to} = move;
        const fromArray = stacks[from-1];
        const toArray = stacks[to-1];
        for (let i=0; i<count; i++){
            let elem = fromArray.pop();
            if (elem != null){
                toArray.push(elem);
            }
        }
    }

    let result = '';
    for (let elem of stacks){
        result+=(elem[elem.length-1]??'');
    }
    
    return result;
}

function part2(stacks: Stacks, moves: Move[]){
    for (let move of moves){
        const {count, from, to} = move;
        const fromArray = stacks[from-1];
        const toArray = stacks[to-1];
        let temp: Stack = []
        for (let i=0; i<count; i++){
            let elem = fromArray.pop();
            if (elem != null){
                temp.push(elem);
            }
        }
        toArray.push(...temp.reverse());
    }
    let result = '';
    for (let elem of stacks){
        result+=(elem[elem.length-1]??'');
    }
    
    return result;
}

/**
 * reads the file input and creates the following objects
 * @returns { moves: Move[], stacks: Stacks}
 */
async function readInput(){
    const fileRaw = await readFile('input/day05.txt', { encoding : 'utf-8'});
    const lines = fileRaw.split(/\r?\n/);

    //parse stack
    const lastStackLine = lines.findIndex((line) => line.includes('1   2   3   4   5   6   7   8   9'));
    const stacklines = lines.slice(0,lastStackLine).reverse();
    let stacks: Stacks = [];
    for (let i=0; i<9; i++){
        stacks.push([]);
    }
    const letterRegex = /\[([A-Z])\]/;
    for(let line of stacklines){
        for (let i=0; i<line.length; i+=4){
            let word = line.substring(i,i+4);
            let match=word.match(letterRegex)
            if (match && match.length >= 2){
                stacks[i/4].push(match[1]);
            }
        }
    }
    //parse moves
    const moves: Move[] = [];
    const regex = /move (\d+) from (\d+) to (\d+)/;
    for (let line of lines){
        const match = line.match(regex);
        if (match && match.length >= 4){
            moves.push({
                count: Number(match[1]),
                from: Number(match[2]),
                to: Number(match[3]),
            });
        }
    }
    return { stacks, moves };
}

//pass answer
let input = await readInput();
const answer1 = part1(input.stacks, input.moves);

input = await readInput();
const answer2 = part2(input.stacks, input.moves);

console.log(`part 1: ${answer1}\npart 2: ${answer2}`)