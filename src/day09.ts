import { readFile } from 'fs/promises';

interface Command{
    direction: 'U' | 'D' | 'L' | 'R';
    position: number;
}

interface Position{
    x: number;
    y: number;
}

const fileRaw = await readFile('input/day09.txt', { encoding : 'utf-8'});
const commands: Command[] = fileRaw.split(/\r?\n/).map(line => {
    const [direction, position] = line.split(' ');
    return {direction, position: Number(position)} as Command;
});

//how the tail(or next knot in part 2) responds to the previous knot moving
function move(head: Position, tail: Position){
    let diffX = head.x - tail.x;
    let diffY = head.y - tail.y;

    if (Math.abs(diffX) <2 && Math.abs(diffY) < 2){
        return ;
    }

    if (diffX === 0){
        tail.y+= diffY > 0 ? 1 : -1;
    } else if (diffY === 0){
        tail.x+= diffX > 0 ? 1 : -1;
    } else if (Math.abs(diffX) === 1){//diagonal 
        tail.x = head.x;
        tail.y+= diffY > 0 ? 1 : -1;
    }else if (Math.abs(diffY) === 1){
        tail.x+= diffX > 0 ? 1 : -1;
        tail.y = head.y;
    }else if (Math.abs(diffX) === 2 && Math.abs(diffY) === 2){
        //new condition, you can move diagonally now
        tail.x+= diffX > 0 ? 1 : -1;
        tail.y+= diffY > 0 ? 1 : -1;
    }else{
        throw new Error("Shouldn't get here")
    }
}

//solution to part 1 and 2 just update parameter
function solution(commands: Command[], knotCount: number){
    let visited = new Set<string>();
    function setVisited(tail: Position){
        visited.add(String(tail.x)+","+String(tail.y));
    }
    
    const knots: Position[] = new Array(knotCount);
    for (let i=0; i<knotCount; i++){
        knots[i] = { x: 0, y: 0};
    }
    const head = knots[0];
    const tail = knots[knotCount-1];
    setVisited(tail);//starting position is visited
    function update(headDx: number, headDy: number, times: number){
        for(let time=0; time < times; time++){
            //update head
            head.x+=headDx;
            head.y+=headDy;
            //update knots
            for(let i=1; i<knotCount; i++){
                move(knots[i-1], knots[i]);
            }
            //set visited
            setVisited(tail);
        }
    }

    for (let command of commands){
        switch(command.direction){
            case 'U':
                update(0,1, command.position);
            break;
            case 'D':
                update(0,-1, command.position);
            break;
            case 'L':
                update(-1,0, command.position);
            break;
            case 'R':
                update(1, 0, command.position);
            break;
            default:
                throw new Error("Invalid Direction : "+ command.direction);
        }
    }

    return visited.size;
}

const answer1 = solution(commands,2);
const answer2 = solution(commands,10);

console.log(`part 1: ${answer1}\npart 2: ${answer2}`)