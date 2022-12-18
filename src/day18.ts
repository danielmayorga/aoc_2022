import { stat } from 'fs';
import { readFile } from 'fs/promises';

interface Point{
    x: number;
    y: number; 
    z: number;
}

function adjacent(a: Point, b: Point,){
    const xDiff = Math.abs(a.x-b.x);
    const yDiff = Math.abs(a.y-b.y);
    const zDiff = Math.abs(a.z-b.z);
    return (xDiff+yDiff+zDiff)===1;
}

function part1(points: Point[]){
    let hidden = 0; 

    for (let i=0; i<points.length; i++){
        let a = points[i];
        for (let j=i+1; j<points.length; j++){
            let b = points[j];
            if (adjacent(a,b)){
                hidden+=2;
            }
        }
    }

    return (points.length*6) -hidden;
}

interface BfsHelperOutput{
    status: boolean;
    visited: Set<string>;
}

//3246 wrong?
function part2(points: Point[]){
    let maxX=0, maxY=0, maxZ=0;
    for (let point of points){
        maxX = Math.max(point.x, maxX);
        maxY = Math.max(point.y, maxY);
        maxZ = Math.max(point.z, maxZ);
    }

    function withinRange(point: Point){
        return  0<=point.x && point.x<=maxX &&
                0<=point.y && point.y<=maxY &&
                0<=point.z && point.z<maxZ;
    }
    
    const toKey = (point: Point) => `${point.x},${point.y},${point.z}`;

    function generateNeighbors(point: Point): Point[]{
        return [
            { x: point.x, y: point.y, z: point.z+1},
            { x: point.x, y: point.y, z: point.z-1},
            { x: point.x, y: point.y+1, z: point.z},
            { x: point.x, y: point.y-1, z: point.z},
            { x: point.x+1, y: point.y, z: point.z},
            { x: point.x-1, y: point.y, z: point.z},
        ];
    }

    function findAdjacentGapsInbetween(point: Point): number{
        return generateNeighbors(point)
                .map(neighbor => isGap(neighbor))
                .filter(gap => gap).length;
    }
    
    const gapMemo = new Map<string, boolean>();
    function isGap(point: Point){
        const key = toKey(point);
        if (set.has(key)){
            return false;//you're a square :P 
        }
        if (gapMemo.has(key)){
            return gapMemo.get(key);
        }
        const {visited, status}= BfsHelper(point);
        for(let visitedKey of visited){
            gapMemo.set(visitedKey, status);
        }
        return status;
    }

    function BfsHelper(point:Point): BfsHelperOutput{
        let visited = new Set<string>();
        const queue = [point];
        while(queue.length){
            const currPoint = queue.shift() as Point;
            for(let neighbor of generateNeighbors(currPoint)){
                const neighborKey = toKey(neighbor);
                if (!set.has(neighborKey) && !visited.has(neighborKey)){
                    if (!withinRange(neighbor)){
                        return { visited, status: false};
                    }
                    visited.add(neighborKey);
                    queue.push(neighbor);
                }
            }
        }
        return {visited, status: true};
    }

    //find the gaps of air inbetween
    const set = new Set(points.map(toKey));
    const gaps = points
                    .map(point => findAdjacentGapsInbetween(point))
                    .reduce((sum, curr) => sum+curr, 0);
    return part1(points) - gaps;
}

const fileRaw = await readFile('input/day18.txt', { encoding : 'utf-8'});
const points: Point[] = fileRaw
                    .split(/\r?\n/)
                    .map(line => {
                        const [x, y, z] = line.split(",").map(num => Number(num));
                        return {x,y,z};
                    });

const answer1 = part1(points);
const answer2 = part2(points);

console.log(`part 1: ${answer1}\npart 2: ${answer2}`);