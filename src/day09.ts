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

function part1(command: Command[]){
    let visited = new Set<string>();
    function setVisited(tail: Position){
        visited.add(String(tail.x)+","+String(tail.y));
    }
    
    const head: Position = { x: 0, y: 0};
    const tail: Position = { x: 0, y: 0};
    setVisited(tail);//starting position is visited

    function update(headDx: number, headDy: number, times: number){
        for(let time=0; time < times; time++){
            //update head
            head.x+=headDx;
            head.y+=headDy;
            //update tail
            let diffX = head.x - tail.x;
            let diffY = head.y - tail.y;

            if (Math.abs(diffX) <2 && Math.abs(diffY) < 2){
                continue; //nothing to see here we wont change tail
            }

            if (diffX === 0){
                tail.y+= diffY > 0 ? 1 : -1;
            } else if (diffY === 0){
                tail.x+= diffX > 0 ? 1 : -1;
            } else if (Math.abs(diffX) === 1){//diagonal 
                tail.x = head.x;
                tail.y+= diffY > 0 ? 1 : -1;
            }else {
                tail.x+= diffX > 0 ? 1 : -1;
                tail.y = head.y;
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

function part2(command: Command[]){
    let visited = new Set<string>();
    function setVisited(tail: Position){
        visited.add(String(tail.x)+","+String(tail.y));
    }
    
    const knots: Position[] = new Array(10);
    for (let i=0; i<10; i++){
        knots[i] = { x: 0, y: 0};
    }
    const head = knots[0];
    const tail = knots[9];
    setVisited(tail);//starting position is visited

    function updateHelper(head: Position, tail: Position){
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

    function update(headDx: number, headDy: number, times: number){
        for(let time=0; time < times; time++){
            //update head
            head.x+=headDx;
            head.y+=headDy;
            //update tail
            for(let i=1; i<10; i++){
                updateHelper(knots[i-1], knots[i]);
            }
            //set visited
            setVisited(tail);//2573
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

const answer1 = part1(commands);
const answer2 = part2(commands);

console.log(`part 1: ${answer1}\npart 2: ${answer2}`)