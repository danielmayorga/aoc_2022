import { readFile } from 'fs/promises';

interface Point{
    x: number;
    y: number;
}

//range is inclusive
interface Range{
    start: number;
    end: number;
}

interface Pair{
    sensor: Point;
    beacon: Point;
}

//we're guaranteed that first comes before second in ranges
function overlap(first: Range, second: Range){
    return first.start <= second.start && first.end >= second.start;
}

function merge(first: Range, second: Range): Range{
    return { 
        start: Math.min(first.start, second.start), 
        end: Math.max(first.end, second.end),
    };
}

function nonOverlappingRanges(ranges: Range[]){
    const sorted = ranges.sort((a, b) => a.start - b.start);
    const reduceRanges: Range[]= [];
    let prevRange = sorted[0];
    for (let i=1; i< sorted.length; i++){
        const currRange = sorted[i];
        if (!overlap(prevRange, currRange)){
            reduceRanges.push(prevRange);
        }else{
            prevRange = merge(prevRange, currRange);
        }
    }
    reduceRanges.push(prevRange);
    return reduceRanges;
}

function nonOverlappingSum(ranges: Range[]){
    const reduceRanges = nonOverlappingRanges(ranges);
    const sum = reduceRanges.reduce((p, c)=> p+(c.end-c.start) , 0);
    return sum;
}

function manhattanDistance(pointA: Point, pointB: Point){
    const xDistance = Math.abs(pointA.x - pointB.x);
    const yDistance = Math.abs(pointA.y - pointB.y);
    return xDistance + yDistance;
}

function createRange(pair: Pair, yPosition: number): Range| null{
    const {sensor, beacon} = pair;
    const manhaDistance = manhattanDistance(sensor, beacon);
    const diffY = Math.abs(yPosition - sensor.y);
    if (diffY > manhaDistance){
        return null;
    }
    const diffX = manhaDistance - diffY;

    return {
        start: sensor.x-diffX,
        end: sensor.x+diffX,
    };
}

function part1(pairs: Pair[], yPosition: number){
    const ranges: Range[] = pairs
                        .map((pair) => createRange(pair, yPosition))
                        .filter(range => range != null) as Range[];
    const solution = nonOverlappingSum(ranges);
    return solution;
}

function availablePoint(ranges: Range[], maxXPosition: number): number|null{
    let availablePoint: number = 0;
    for (let range of ranges){
        if (range.start <= availablePoint  && range.end >= availablePoint){
            availablePoint = range.end+1;
        }
    }
    if (availablePoint <= maxXPosition){
        return availablePoint;
    }
    return null;
}

function part2(pairs: Pair[], maxPosition: number){
    let point: Point|null = null;
    for(let y=0; y<=maxPosition; y++){
        const ranges = pairs
                .map((pair) => createRange(pair, y))
                .filter(range => range!= null) as Range[];
        const reducedRange = nonOverlappingRanges(ranges);
        const availableXPosition = availablePoint(reducedRange, maxPosition);
        if (availableXPosition){
            point = { x: availableXPosition, y: y};
            break;
        }
    }
    if (point == null){
        throw new Error("No available point...this is weird");
    }

    return BigInt(point.x)*4_000_000n+BigInt(point.y);
}

const regex = /x=(-?\d+), y=(-?\d+)/g;
const fileRaw = await readFile('input/day15.txt', { encoding : 'utf-8'});
const pairs = fileRaw.split(/\r?\n/)
                     .filter(line => line.trim() !== "")
                     .map(line =>{
                        const matches = line.matchAll(regex);
                        const [sensorMatch, beaconMatch] = matches;
                        return {
                            sensor: {
                                x: Number(sensorMatch[1]),
                                y: Number(sensorMatch[2]),
                            },
                            beacon: {
                                x: Number(beaconMatch[1]),
                                y: Number(beaconMatch[2]),
                            }
                        } as Pair;
                     });


const answer1 = part1(pairs, 2_000_000);
const answer2 = part2(pairs, 4_000_000);

console.log(`part 1: ${answer1}\npart 2: ${answer2}`);