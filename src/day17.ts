import { readFile } from 'fs/promises';

enum RockPiece{
    Horizontal,
    Plus,
    ReverseL,
    Vertical,
    Block,
}

enum AirflowDirection{
    Left,
    Right,
}

class Simulation{
    #shaft: boolean[][] = new Array(7);
    #current: RockPiece = RockPiece.Horizontal;
    #maxHeight = 0;
    #airflow: string;
    #airflowIndex = 0;
    #currRocks = 0;
    #maxRocks: number;

    constructor(airflow: string, rocks: number){
        this.#airflow = airflow;
        this.#maxRocks = rocks;
        const maxHeight = rocks*4;
        for (let i =0; i< this.#shaft.length; i++){
            this.#shaft[i] = new Array(maxHeight).fill(false);
        }
        this.#process();
    }

    #updatePiece = () =>{
        this.#current = (this.#current + 1)%(RockPiece.Block+1) as RockPiece;
    }

    #initAirflow = () => {
        this.#airflowIndex = 0;
        return this.#airflow[this.#airflowIndex] === "<" ? AirflowDirection.Left : AirflowDirection.Right;
    }

    #nextAirflow = () => {
        this.#airflowIndex = (this.#airflowIndex + 1) % (this.#airflow.length);
        return this.#airflow[this.#airflowIndex] === "<" ? AirflowDirection.Left : AirflowDirection.Right;
    }

    #horizontalCheck = (x: number, y: number) =>{
        return  x+3 < 7              &&
                !this.#shaft[x][y]   &&
                !this.#shaft[x+1][y] &&
                !this.#shaft[x+2][y] &&
                !this.#shaft[x+3][y];
    }
    #plusCheck = (x: number, y: number) =>{
        return  x+2 < 7                &&
                !this.#shaft[x+1][y]   &&
                !this.#shaft[x][y+1]   &&
                !this.#shaft[x+1][y+1] &&
                !this.#shaft[x+2][y+1] &&
                !this.#shaft[x+1][y+2];
    }
    #reverseLCheck = (x: number, y: number) =>{
        return  x+2 < 7                &&
                !this.#shaft[x][y]     &&
                !this.#shaft[x+1][y]   &&
                !this.#shaft[x+2][y]   &&
                !this.#shaft[x+2][y+1] &&
                !this.#shaft[x+2][y+2];
    }
    #verticalCheck = (x: number, y: number) =>{
        return  x < 7              &&
                !this.#shaft[x][y]   &&
                !this.#shaft[x][y+1] &&
                !this.#shaft[x][y+2] &&
                !this.#shaft[x][y+3];
    }
    #blockCheck = (x: number, y: number) =>{
        return  x+1 < 7              &&
                !this.#shaft[x][y]   &&
                !this.#shaft[x+1][y] &&
                !this.#shaft[x][y+1] &&
                !this.#shaft[x+1][y+1];
    }

    #check : ((x: number, y: number) => boolean)= (x: number, y: number) => {
        if (y < 0 || x < 0) return false;//can't go through the floor or left wall
        switch(this.#current){
            case RockPiece.Horizontal:
                return this.#horizontalCheck(x,y);
            case RockPiece.Plus:
                return this.#plusCheck(x,y);
            case RockPiece.ReverseL:
                return this.#reverseLCheck(x,y);
            case RockPiece.Vertical:
                return this.#verticalCheck(x,y);
            case RockPiece.Block:
                return this.#blockCheck(x,y);
            default:
                throw new Error(`We shouldn't get here`);
        }
    }

    #calculateHeight = (x: number, y: number) => {
        switch(this.#current){
            case RockPiece.Horizontal:
                return y;
            case RockPiece.Plus:
                return y+2;
            case RockPiece.ReverseL:
                return y+2;
            case RockPiece.Vertical:
                return y+3;
            case RockPiece.Block:
                return y+1;
            default: 
                throw new Error(`We shouldn't get here`);
        }
    }

    #setHorizontal = (x: number, y: number ) =>{
        this.#shaft[x][y] = true;
        this.#shaft[x+1][y] = true;
        this.#shaft[x+2][y] = true;
        this.#shaft[x+3][y] = true;
    }
    #setPlus = (x: number, y: number ) =>{
        this.#shaft[x+1][y] = true;
        this.#shaft[x][y+1] = true;
        this.#shaft[x+1][y+1] = true;
        this.#shaft[x+2][y+1] = true;
        this.#shaft[x+1][y+2] = true;
    }
    #setReverseL = (x: number, y: number ) =>{
        this.#shaft[x][y] = true;
        this.#shaft[x+1][y] = true;
        this.#shaft[x+2][y] = true;
        this.#shaft[x+2][y+1] = true;
        this.#shaft[x+2][y+2] = true;
    }
    #setVertical = (x: number, y: number ) =>{
        this.#shaft[x][y] = true;
        this.#shaft[x][y+1] = true;
        this.#shaft[x][y+2] = true;
        this.#shaft[x][y+3] = true;
    }
    #setBlock = (x: number, y: number ) =>{
        this.#shaft[x][y] = true;
        this.#shaft[x+1][y] = true;
        this.#shaft[x][y+1] = true;
        this.#shaft[x+1][y+1] = true;
    }

    #setPiece = (x: number, y: number) =>{
        switch(this.#current){
            case RockPiece.Horizontal:
                return this.#setHorizontal(x,y);
            case RockPiece.Plus:
                return this.#setPlus(x,y);
            case RockPiece.ReverseL:
                return this.#setReverseL(x,y);
            case RockPiece.Vertical:
                return this.#setVertical(x,y);
            case RockPiece.Block:
                return this.#setBlock(x,y);
            default: 
                throw new Error(`We shouldn't get here`);
        }
    }

    #getStartingPosition = () =>{
        return { x: 2, y: this.#maxHeight+3}
    }

    #process = () => {
        let airflow = this.#initAirflow();
        for(this.#currRocks; this.#currRocks<this.#maxRocks; this.#currRocks++){
            let {x, y} = this.#getStartingPosition();
            while(true){
                if (airflow === AirflowDirection.Left){
                    this.#check(x-1,y) ? x-- : x;
                }else{//right :P 
                    this.#check(x+1, y) ? x++: x;
                }

                if (!this.#check(x, y-1)){
                    this.#setPiece(x,y);
                    this.#maxHeight = Math.max(this.#maxHeight, this.#calculateHeight(x,y)+1);
                    airflow = this.#nextAirflow();
                    break;
                }
                y--;
                airflow = this.#nextAirflow();
            }
            this.#updatePiece();
        }
        //debug helper 
        //this.#printSimulation();
    }

    maxHeight = () => this.#maxHeight;

    #printSimulation(){
        let output = "";

        for(let y=this.#shaft[0].length; y>=0; y--){
            output += "|";
            for(let x=0; x<7; x++){
                output += (this.#shaft[x][y] ? "#" : ".");
            }
            output += "|\n";
        }   
        output += "+-------+";
        console.log(output);
    }
}

const part1 = (airflow: string, rocks: number) =>
    new Simulation(airflow, rocks).maxHeight();

function part2(airflow: string, rocks: number){

}

const fileRaw = await readFile('input/day17.txt', { encoding : 'utf-8'});
const airflow = fileRaw.trim();

const answer1 = part1(airflow, 2022);
const answer2 = part2(airflow, 2022);

console.log(`part 1: ${answer1}\npart 2: ${answer2}`);