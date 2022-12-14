import { readFile } from 'fs/promises';

interface Point{
    x: number;
    y: number;
}

class Simulation{

    #grid: boolean[][] = new Array(500);
    #setElement = (x: number, y: number) => {
        const newX = x-250;
        this.#grid[newX][y] = true;
    }
    #hasElement = (x: number, y: number) => {
        const newX = x-250;
        if (this.#part === 2 && y == this.#maxY+2){
            return true;
        }

        return this.#grid[newX]?.[y];
    }
    #part: 1|2 = 1;
    #maxY: number = 0;
    

    constructor(lines: Point[][], part: 1 | 2){
        for(let i=0; i<500; i++){
            this.#grid[i] = new Array(500).fill(false);
        }

        for (let points of lines){
            this.#maxY = Math.max(...points.map(pair => pair.y), this.#maxY);
            for(let i=1; i<points.length; i++){
                const start = points[i-1];
                const end = points[i];
                this.setLine(start, end);
            }
        }
        this.#part = part;
    }

    setLine = (start: Point, end: Point) =>{
        if (start.x === end.x){
            let yStart = Math.min(start.y, end.y);
            let yEnd = Math.max(start.y, end.y);
            for (yStart; yStart<=yEnd; yStart++){
                this.#setElement(start.x, yStart);
            }
        }else if (start.y === end.y){
            let xStart = Math.min(start.x, end.x);
            let xEnd = Math.max(start.x, end.x);
            for (xStart; xStart<=xEnd; xStart++){
                this.#setElement(xStart, start.y);
            }
        }else{
            throw new Error("something went wrong with the line");
        }
    }

    #visited = new Set<string>();
    #setVisited = (x: number, y: number) =>{
        this.#visited.add(String(x)+","+String(y));
    }
    #visitCount = () => this.#visited.size;

    #dropSand = (x: number, y: number) =>{
        for (; y< 500; y++){
            if (this.#hasElement(x,y)){
                if (!this.#hasElement(x-1, y) && this.#dropSand(x-1, y+1)){
                    return true; //short circuit we dropped somewhere
                }
                if (!this.#hasElement(x+1, y) && this.#dropSand(x+1, y+1)){
                    return true; //short circuit we dropped somewhere
                }
                if (this.#hasElement(x,y-1)){
                    return false; // we cannot be set
                } else{
                    this.#setElement(x, y-1); // we set the sand right above the current cell
                    this.#setVisited(x, y-1);
                    return true;
                }
            }
        }
        return true;//falls forever
    }

    addSand = () => {
        let prev = this.#visitCount();
        if (this.#hasElement(500, 0)){
            //if you go to the source, you're done for part 2...part 1 too but you never reach the source
            return false;
        }
        this.#dropSand(500, 0);
        return prev !== this.#visitCount();
    }
}

function solution(lines: Point[][], settings: { part: 1 | 2}){
    const simulation = new Simulation(lines, settings.part);
    let result = 0;
    while(simulation.addSand()){
        result++;
    }
    return result;
}

const regex = /(\d+),(\d+)/g;
const fileRaw = await readFile('input/day14.txt', { encoding : 'utf-8'});
const lines = fileRaw
                        .split(/\r?\n/)
                        .map(line => {
                            const matches = line.matchAll(regex);
                            return [...matches].map(match => ({ x: Number(match[1]), y: Number(match[2])} as Point));
                        });

const answer1 = solution(lines, { part: 1 });
const answer2 = solution(lines, { part: 2 });


console.log(`part 1: ${answer1}\npart 2: ${answer2}`);