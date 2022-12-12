import { readFile } from 'fs/promises';

function canMove(from: string, to: string){
    if (to === "S" || from === "E"){
        return false;
    }
    if (from === "S"){
        from = "a"
    }
    if (to === "E"){
        to = "z";
    }
    const diff = to.charCodeAt(0) - from.charCodeAt(0);
    return diff < 2;
}

function getNeightbor(grid: string[], row: number, column: number): [number, number][]{
    const result: [number,number][] = [];
    const curr = grid[row][column];
    let diff = -1;
    for(let i=0; i<2; i++){
        diff *= -1;
        if (grid[row-diff]?.[column] && canMove(curr, grid[row-diff][column])){//unspecified will be falsey
            result.push([row-diff, column]);
        }
        if (grid[row]?.[column-diff] && canMove(curr, grid[row][column-diff])){
            result.push([row, column-diff]);
        }
    }
    return result;
}

function find(grid: string[], char: "S" | "E"): [number, number]{
    for (let row = 0; row<grid.length; row++){
        let column = grid[row].indexOf(char);
        if (column >=0){
            return [row, column];
        }
    }
    throw new Error("Couldn't find position");
}

class Visit{
    #seen = new Set<string>();
    #cost = new Map<string, number>();

    #toString = (row: number, column: number) =>
        String(row) + "," + String(column);

    hasSeen=(row: number, column: number) => this.#seen.has(this.#toString(row, column));
    visited=(row: number, column: number, cost: number) => {
        this.#seen.add(this.#toString(row, column));
        this.#cost.set(this.#toString(row, column), cost);
    }
    cost = (row: number, column: number) => 
        this.#cost.get(this.#toString(row, column));
}

function solution(grid: string[], settings: { part: 1 | 2}){
    const startPosition = find (grid, "S");
    const endPosition = find(grid, "E");
    const visit = new Visit();
    visit.visited(startPosition[0], startPosition[1], 0);

    let queue: [number, number][] = [startPosition];
    while(queue.length){
        const [row, column] = queue.shift() as [number, number];
        const cost = visit.cost(row, column) as number;
        const neighbors = getNeightbor(grid, row, column);
        for(let neighbor of neighbors){
            if (!visit.hasSeen(neighbor[0], neighbor[1])){
                let newCost = cost + 1;

                if (settings.part === 2 && (grid[neighbor[0]][neighbor[1]] === "a" || grid[neighbor[0]][neighbor[1]] === "S")){
                    newCost = 0;
                }

                if (neighbor[0] === endPosition[0] && neighbor[1] === endPosition[1]){
                    return newCost;
                }

                visit.visited(neighbor[0], neighbor[1], newCost);
                queue.push(neighbor);
            }
        }
    }
}

const fileRaw = await readFile('input/day12.txt', { encoding : 'utf-8'});
const grid = fileRaw.split(/\r?\n/);

const answer1 = solution(grid, { part: 1});
const answer2 = solution(grid, { part: 2});

console.log(`part 1: ${answer1}\npart 2: ${answer2}`)