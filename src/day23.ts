import { readFile } from 'fs/promises';

interface Position{
    x: number;
    y: number;
}

class Simulation{
    #visited = new Map<string, Position>();
    #toKey = (x: number, y: number) =>  x+','+y;
    #setPosition = (x: number, y: number) => this.#visited.set(this.#toKey(x,y), {x,y});
    #hasPosition = (x: number, y: number) => this.#visited.has(this.#toKey(x,y));
    #getPosition = (x: number, y: number) => this.#visited.get(this.#toKey(x,y));

    constructor(lines: string[]){
        for(let y=0; y<lines.length; y++){
            for(let x=0; x<lines[0].length; x++){
                if (lines[y][x] === "#"){
                    this.#setPosition(x,-y);
                }
            }
        }
    }

    #checkAllAround = (position: Position) => {
        return  !this.#hasPosition(position.x, position.y+1)   && 
                !this.#hasPosition(position.x+1, position.y+1) &&
                !this.#hasPosition(position.x-1, position.y+1) &&
                !this.#hasPosition(position.x, position.y-1)   &&
                !this.#hasPosition(position.x+1, position.y-1) &&
                !this.#hasPosition(position.x-1, position.y-1) &&
                !this.#hasPosition(position.x-1, position.y)   &&
                !this.#hasPosition(position.x+1, position.y);
    }

    #checkNorth = (position: Position):Position|undefined => {
        let n = this.#hasPosition(position.x, position.y+1),
        ne = this.#hasPosition(position.x+1, position.y+1),
        nw = this.#hasPosition(position.x-1, position.y+1);
        if(!n && !ne && !nw){
            return {x: position.x, y: position.y+1};
        }
    }
    #checkSouth = (position: Position):Position|undefined =>{
        let s = this.#hasPosition(position.x, position.y-1),
        se = this.#hasPosition(position.x+1, position.y-1),
        sw = this.#hasPosition(position.x-1, position.y-1);
        if(!s && !se && !sw){
            return {x: position.x, y: position.y-1};
        }
    }
    #checkWest = (position: Position):Position|undefined => {
        let w = this.#hasPosition(position.x-1, position.y),
        nw = this.#hasPosition(position.x-1, position.y+1),
        sw = this.#hasPosition(position.x-1, position.y-1);
        if (!w && !sw && !nw){
            return {x: position.x-1, y: position.y};
        }
    }
    #checkEast = (position: Position):Position|undefined => {
        let e = this.#hasPosition(position.x+1, position.y),
        ne = this.#hasPosition(position.x+1, position.y+1),
        se = this.#hasPosition(position.x+1, position.y-1);
        if (!e && !se && !ne){
            return {x: position.x+1, y: position.y};
        }
    }

    #shiftCheck = [this.#checkNorth, this.#checkSouth, this.#checkWest, this.#checkEast];
    #shiftIndex = 0;
    #updateShift = () => this.#shiftIndex = ((this.#shiftIndex +1) %4);

    #proposeHelper(position: Position, addProposal: ((curr: Position, propose: Position) => void)){
        if (!this.#checkAllAround(position)){
            for(let i = 0; i<4; i++){
                let index = (i+this.#shiftIndex)%4;
                const propose = this.#shiftCheck[index](position);
                if (propose != null){
                    addProposal(position, propose);
                    return;
                }
            }
        }

        addProposal(position, position);
    }

    round = () =>{
        const proposalWho = new Map<string, Position[]>();
        const proposalPosition = new Map<string, Position>();
        const addProposal = (currentPosition: Position, proposed: Position) =>{
            const proposalKey = this.#toKey(proposed.x,proposed.y);
            const proposeList = proposalWho.get(proposalKey) ?? [];
            proposeList.push(currentPosition);
            proposalWho.set(proposalKey, proposeList);
            proposalPosition.set(proposalKey, proposed);
        }

        for(let position of this.#visited.values()){
            this.#proposeHelper(position, addProposal);
        }

        this.#visited = new Map();
        for(let pair of proposalWho.entries()){
            if (pair[1].length === 1){
                const {x,y} = proposalPosition.get(pair[0]) as Position;
                this.#setPosition(x,y);
            }else {
                for(let {x,y} of pair[1]){
                    this.#setPosition(x,y);
                }
            }
        }
        this.#updateShift();
        //this.#printHelper();
    }

    rectangle = () => {
        let minX = Number.MAX_SAFE_INTEGER, maxX = Number.MIN_SAFE_INTEGER,
        minY = Number.MAX_SAFE_INTEGER, maxY = Number.MIN_SAFE_INTEGER;

        for (let position of this.#visited.values()){
            minX = Math.min(position.x, minX); 
            minY = Math.min(position.y, minY);
            maxX = Math.max(position.x, maxX);
            maxY = Math.max(position.y, maxY);
        }

        return ((maxY-minY+1) * (maxX - minX+1)) - this.#visited.size;
    }

    #printHelper(){
        let minX = Number.MAX_SAFE_INTEGER, maxX = Number.MIN_SAFE_INTEGER,
        minY = Number.MAX_SAFE_INTEGER, maxY = Number.MIN_SAFE_INTEGER;

        for (let position of this.#visited.values()){
            minX = Math.min(position.x, minX); 
            minY = Math.min(position.y, minY);
            maxX = Math.max(position.x, maxX);
            maxY = Math.max(position.y, maxY);
        }

        for(let y=maxY; y>=minY; y--){
            let line = ""
            for(let x=minX; x<=maxX; x++){
                line+=this.#hasPosition(x,y) ? "#" : '.';
            }
            console.log(line);
        }
        console.log("----\n\n")
        console.log(this.#shiftIndex);

    }
}

const fileRaw = await readFile('input/day23.txt', { encoding : 'utf-8'});
const lines =  fileRaw.split(/\r?\n/);

function part1(lines: string[]){
    const simulation = new Simulation(lines);
    for(let i=0; i<10; i++){
        simulation.round();
    }
    return simulation.rectangle();
}

function part2(lines: string[]){

}


const answer1 = part1(lines);
const answer2 = part2(lines);
console.log(`part 1: ${answer1}\npart 2: ${answer2}`);