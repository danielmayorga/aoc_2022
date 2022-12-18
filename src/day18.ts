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

function part2(){

}

const fileRaw = await readFile('input/day18.txt', { encoding : 'utf-8'});
const points: Point[] = fileRaw
                    .split(/\r?\n/)
                    .map(line => {
                        const [x, y, z] = line.split(",").map(num => Number(num));
                        return {x,y,z};
                    });

const answer1 = part1(points);
const answer2 = part2();

console.log(`part 1: ${answer1}\npart 2: ${answer2}`);