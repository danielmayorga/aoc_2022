import { readFile } from 'fs/promises';

interface Instruction{
    isLeft: boolean;
    spaces: number;
}

const fileRaw = await readFile('input/2016/day01.txt', { encoding : 'utf-8'});                
const directions = fileRaw
                    .split(', ')
                    .map(segment => (
                        {
                            isLeft: segment[0] === 'L',
                            spaces: Number(segment.substring(1))
                        } as Instruction
                    ));

interface SolutionOutput{
    part1: number;
    part2: number;
}

//the enums are in order each next one is a new Left turn :p
enum Direction{
    Up,
    Left,
    Down,
    Right,
}

function nextDirection(direction: Direction, turnLeft: boolean): Direction{
    const offset = turnLeft ? 1 : 3;
    return (direction+offset)%(Direction.Right+1);
}

function* updatePosition(x: number, y: number, direction: Direction, steps: number){
    for (let step=1; step<=steps;step++){
        switch(direction){
            case Direction.Up:
                yield { x, y: y+step};
                break;
            case Direction.Left:
                yield { x:x-step, y};
                break;
            case Direction.Down:
                yield { x, y: y-step};
                break;
            case Direction.Right:
                yield { x:x+step, y};
                break;
            default: 
                throw new Error("Unsupported Direction");
        }
    }
}

function solution(instructions: Instruction[]): SolutionOutput{
    const visited = new Set<string>();
    const toKey = (x: number, y: number) => `${x},${y}`;
    
    let part2: number|undefined;
    let part1: number|undefined;

    let direction = Direction.Up;
    let x = 0, y = 0;
    for(let instruction of instructions){
        direction = nextDirection(direction, instruction.isLeft);
        for ({ x , y } of updatePosition(x,y, direction, instruction.spaces)){
            const key = toKey(x,y);
            if (visited.has(key) && part2 == null){
                part2 = Math.abs(x)+ Math.abs(y);
            }
            visited.add(key);
        }
    }
    part1 = Math.abs(x)+Math.abs(y);

    return ({
        part1: part1 as number,
        part2: part2 as number,
    });
}

const { part1: answer1, part2: answer2} = solution(directions);
console.log(`part 1: ${answer1}\npart 2: ${answer2}`);