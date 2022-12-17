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
    #airflow: string;
    #airflowIndex = 0;

    constructor(airflow: string){
        this.#airflow = airflow;
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
        return  x < 7                &&
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

    process = (rocks: number) => {
        //clear out the arrays
        for (let i =0; i< this.#shaft.length; i++){
            this.#shaft[i] = new Array(rocks*4).fill(false);
        }

        //initialize max height
        let maxHeight = 0;
        
        //helper function to get starting position
        const getStartingPosition = () =>{
            return { x: 2, y: maxHeight+3}
        }

        let airflow = this.#initAirflow();
        for(let rock=0; rock<rocks; rock++){
            let {x, y} = getStartingPosition();
            while(true){
                if (airflow === AirflowDirection.Left){
                    this.#check(x-1,y) ? x-- : x;
                }else{//right :P 
                    this.#check(x+1, y) ? x++: x;
                }

                if (!this.#check(x, y-1)){
                    this.#setPiece(x,y);
                    maxHeight = Math.max(maxHeight, this.#calculateHeight(x,y)+1);
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
        return maxHeight;
    }

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


    #cycleSet = new Map<string, { height: number, rock: number}>();
    #cycleHelper(maxHeight: number, rock: number){
        let deltaString = String(this.#airflowIndex)+",";
        deltaString += this.#shaft.map(column =>{
            for (let y = maxHeight; y>0; y--){
                if (column[y]){
                    return maxHeight-y;
                }
            }
            return 0;
        }).join(",");

        if (!this.#cycleSet.has(deltaString)){
            this.#cycleSet.set(deltaString, { height: maxHeight, rock});
            //we haven't found a cycle
            return undefined;
        }
        const { height, rock: startCycle}= this.#cycleSet.get(deltaString) as {height: number, rock: number};

        return { startCycle, maxHeight: height};//we have a cycle
    }

    findCycle = () => {
        //clear out the arrays
        for (let i =0; i< this.#shaft.length; i++){
            this.#shaft[i] = new Array(1_000_000*4).fill(false);
        }

        //initialize max height
        let maxHeight = 0;
        
        //helper function to get starting position
        const getStartingPosition = () =>{
            return { x: 2, y: maxHeight+3}
        }

        let airflow = this.#initAirflow();
        for(let rock=1; rock<10_000; rock++){
            let {x, y} = getStartingPosition();
            while(true){
                if (airflow === AirflowDirection.Left){
                    this.#check(x-1,y) ? x-- : x;
                }else{//right :P 
                    this.#check(x+1, y) ? x++: x;
                }

                if (!this.#check(x, y-1)){
                    this.#setPiece(x,y);
                    maxHeight = Math.max(maxHeight, this.#calculateHeight(x,y)+1);
                    airflow = this.#nextAirflow();
                    break;
                }
                y--;
                airflow = this.#nextAirflow();
            }
            this.#updatePiece();
            let cycleData = this.#cycleHelper(maxHeight, rock)
            if (cycleData){
                return { startCycle: cycleData.startCycle, cycleEnd: rock, cycleHeight: maxHeight-cycleData.maxHeight };
            }
        }

        throw new Error("No cycle found")
    }
}

const part1 = (airflow: string) =>
    new Simulation(airflow).process(2022);

//
function part2(airflow: string){
    const simulation = new Simulation(airflow);
    const { startCycle, cycleEnd, cycleHeight } = simulation.findCycle();
    const nonCycleHeight = simulation.process(startCycle-1);
    const cycle = BigInt(cycleEnd-startCycle);
    const divisible = (1_000_000_000_000n - BigInt(startCycle)) / cycle;
    const remainder = (1_000_000_000_000n - BigInt(startCycle)) % cycle;
    const remainderHeight = simulation.process(Number(remainder)+startCycle) - simulation.process(Number(startCycle));
    return divisible*BigInt(cycleHeight)+BigInt(remainderHeight)+BigInt(nonCycleHeight);

}

const fileRaw = await readFile('input/day17.txt', { encoding : 'utf-8'});
const airflow = fileRaw.trim();

const answer1 = part1(airflow);
const answer2 = part2(airflow);

console.log(`part 1: ${answer1}\npart 2: ${answer2}`);