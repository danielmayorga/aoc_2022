import { readFile } from 'fs/promises';

type Command = number | 'L' | 'R';
enum Direction{
    Right = 0, 
    Down = 1,
    Left = 2,
    Up = 3,
}

interface Node{
    row: number;
    column: number;
    isWall: boolean;
    neighbors: Node[];
}

interface Traveler{
    direction: Direction;
    currentNode: Node;
}

class Graph{
    #firstNode!: Node;
    #toKey = (row: number, column: number) => row+","+column;
    #reOrient = (direction: Direction, command: 'L' | 'R'): Direction =>
            (command === 'L') ?
            (direction+3) % 4 :
            (direction+1) % 4 ;
    #next = (direction: Direction, currentNode: Node) => 
        currentNode.neighbors[direction];

    constructor(rawGraph: string){
        const rawRows = rawGraph.split(/\r?\n/);
        const nodeMap = new Map<string, Node>();//maps row+column to node
        let maxColumn = 0;
        //create nodes and add entries to nodeMap, topMap, and leftMap
        for (let row=0; row<rawRows.length; row++){
            const rawRow = rawRows[row];
            maxColumn = Math.max(rawRow.length, maxColumn);
            for (let column =0; column < rawRow.length; column++){
                const char = rawRow[column];
                if (char !== ' '){
                    const node: Node = {
                        row,
                        column,
                        isWall: char === "#",
                        neighbors: new Array(4)
                    };
                    nodeMap.set(this.#toKey(row,column), node);
                }
            }
        }

        for(let row =0; row<rawRows.length; row++){
            let leftMost: Node|undefined =  undefined;
            let rightMost: Node|undefined = undefined;
            for(let column =0; column<maxColumn; column++){
                const node = nodeMap.get(this.#toKey(row,column));
                leftMost ??= node;
                if (node != null){
                    rightMost =node;
                    node.neighbors[Direction.Left] = nodeMap.get(this.#toKey(row,column-1)) as Node;
                    node.neighbors[Direction.Right] = nodeMap.get(this.#toKey(row,column+1)) as Node;
                }
            }
            leftMost!.neighbors[Direction.Left] = rightMost as Node;
            rightMost!.neighbors[Direction.Right] = leftMost as Node;
        }

        for(let column =0; column<maxColumn; column++){
            let topMost: Node|undefined =  undefined;
            let bottomMost: Node|undefined = undefined;
            for(let row =0; row<rawRows.length; row++){
                const node = nodeMap.get(this.#toKey(row,column));
                topMost ??= node;
                if (node != null){
                    bottomMost =node;
                    node.neighbors[Direction.Up] = nodeMap.get(this.#toKey(row-1,column)) as Node;
                    node.neighbors[Direction.Down] = nodeMap.get(this.#toKey(row+1,column)) as Node;
                }
            }
            topMost!.neighbors[Direction.Up] = bottomMost as Node;
            bottomMost!.neighbors[Direction.Down] = topMost as Node;
        }

        for (let column =0; column<maxColumn; column++){
            this.#firstNode ??= nodeMap.get(this.#toKey(0, column)) as Node;
        }
    }

    travel = (commands: Command[]) => {
        const traveler: Traveler = {
            direction: Direction.Right,
            currentNode: this.#firstNode,
        };

        for (let command of commands){
            switch(command){
                case 'L':
                case 'R':
                    traveler.direction = this.#reOrient(traveler.direction, command);
                    break;
                default: 
                    for(let i=0; i<command; i++){
                        const next = this.#next(traveler.direction, traveler.currentNode);
                        if(next.isWall){
                            break;
                        }
                        traveler.currentNode = next;
                    }
            }
        }

        return  ((traveler.currentNode.row+1)*1000)+
                ((traveler.currentNode.column+1)*4)+
                traveler.direction;
    }
}

interface CubeTraveler{
    node: CubeNode;
    direction: Direction;
}

interface CubeNode{
    row: number;
    column: number;
    isWall: boolean;
}

class CubeGraph{
    #firstNode!: CubeNode;
    #nodeMap =  new Map<string, CubeNode> ();
    #toKey = (row: number, column: number) => row+","+column;
    #getNode = (row: number, column: number) => this.#nodeMap.get(this.#toKey(row,column)) as CubeNode;
    #setNode = (row: number, column: number, node: CubeNode) => this.#nodeMap.set(this.#toKey(row,column), node);
    #reOrient = (direction: Direction, command: 'L' | 'R'): Direction =>
            (command === 'L') ?
            (direction+3) % 4 :
            (direction+1) % 4 ;
    #next(traveler: CubeTraveler): CubeTraveler{
        const { node: { row, column }, direction}  = traveler;
        /** hardcode overflow - I'm not a math guy, just a humble code monkey
         *      A  B
         *      F
         *   D  C
         *   E
         * 
         * we'll standarize Up, Down, Left, Right neighbors
         * 
         * Everytime we cross a boundary we'll need to reorient ourselves
         * We had 14 different combinations and I had 2 bugs when I originally wrote this that cost me an hour
         */
        //A to E
        if (row ===0 && column <100 && direction === Direction.Up){
            const node = this.#getNode(100+column,0);
            if (node.isWall) return traveler;
            return ({
                node,
                direction: Direction.Right,
            });
        }
        //E to A
        if (column===0 && row >= 150 && direction === Direction.Left){
            const node = this.#getNode(0,row-100);
            if (node.isWall) return traveler;
            return({
                node,
                direction: Direction.Down,
            })
        }
        //A to D
        if (column===50 && row<50 && direction === Direction.Left){
            const node = this.#getNode(149-row,0);
            if (node.isWall) return traveler;
            return({
                node,
                direction: Direction.Right
            })
        }
        //D to A
        if (column===0 && row>=100 && row<150 && direction === Direction.Left){
            const node = this.#getNode(149-row,50);
            if (node.isWall) return traveler;
            return({
                node,
                direction: Direction.Right
            })
        }
        //B to E
        if (row===0 && column>=100 && direction === Direction.Up){
            const node = this.#getNode(199,column-100);
            if (node.isWall) return traveler;
            return({
                node,
                direction: Direction.Up
            })
        }
        //E to B
        if (row===199 && direction === Direction.Down){
            const node = this.#getNode(0,column+100);
            if (node.isWall) return traveler;
            return({
                node,
                direction: Direction.Down
            })
        }
        //B to C
        if (column ===149 && direction === Direction.Right){
            const node = this.#getNode(149-row,99);
            if (node.isWall) return traveler;
            return({
                node,
                direction: Direction.Left
            })
        }
        //C to B
        if (column === 99 && row>=100 && direction === Direction.Right){
            const node = this.#getNode(149-row,149);
            if (node.isWall) return traveler;
            return({
                node,
                direction: Direction.Left
            })
        }
        //B to F
        if (column>=100 && row === 49 && direction === Direction.Down){
            const node = this.#getNode(column-50,99);
            if (node.isWall) return traveler;
            return({
                node,
                direction: Direction.Left
            });
        }
        //F to B
        if (row >= 50 && row<=99 && column===99 && direction === Direction.Right){
            const node = this.#getNode(49,50+row);
            if (node.isWall) return traveler;
            return({
                node,
                direction: Direction.Up
            });
        }
        //C to E
        if(row===149 && column>=50 && direction === Direction.Down){
            const node = this.#getNode(100+column,49);
            if (node.isWall) return traveler;
            return({
                node,
                direction: Direction.Left
            });
        }
        //E to C
        if(row>=150 && column===49 && direction === Direction.Right){
            const node = this.#getNode(149,row-100);
            if (node.isWall) return traveler;
            return({
                node,
                direction: Direction.Up
            });
        }
        //D to F
        if(column <= 49 && row===100 && direction=== Direction.Up){
            const node = this.#getNode(50+column,50);
            if (node.isWall) return traveler;
            return({
                node,
                direction: Direction.Right
            });
        }
        //F to D
        if(column===50 && row>=50 && row<100 && direction===Direction.Left){
            const node = this.#getNode(100,row-50);
            if (node.isWall) return traveler;
            return({
                node,
                direction: Direction.Down
            });
        }

        //not crossing any boundaries
        let newRow = row;
        let newColumn = column;
        switch(direction){
            case Direction.Up:
                newRow--;
                break;
            case Direction.Down:
                newRow++;
                break;
            case Direction.Left:
                newColumn--;
                break;
            case Direction.Right:
                newColumn++;
                break;
        }

        const next = this.#getNode(newRow, newColumn);
        if (next.isWall) return traveler;
        return { node: next, direction};
    }

    constructor(rawGraph: string){
        const rawRows = rawGraph.split(/\r?\n/);
        //create nodes and add entries to nodeMap, topMap, and leftMap
        for (let row=0; row<rawRows.length; row++){
            const rawRow = rawRows[row];
            for (let column =0; column < rawRow.length; column++){
                
                const char = rawRow[column];
                if (char !== ' '){
                    const node: CubeNode = {
                        row,
                        column,
                        isWall: char === "#",
                    };
                    this.#firstNode ??= node;
                    this.#setNode(row,column, node);
                }
            }
        }
    }

    travel = (commands: Command[]) => {
        let traveler: CubeTraveler = {
            direction: Direction.Right,
            node: this.#firstNode,
        };

        for (let command of commands){
            switch(command){
                case 'L':
                case 'R':
                    traveler.direction = this.#reOrient(traveler.direction, command);
                    break;
                default:
                    let prev = traveler; 
                    for(let i=0; i<command; i++){
                        traveler = this.#next(traveler);
                        if (traveler === prev){
                            break;
                        }
                        prev = traveler;
                    }
            }
        }

        return  ((traveler.node.row+1)*1000)+
                ((traveler.node.column+1)*4)+
                traveler.direction;
    }
}

function part1(commands: Command[], graph: Graph){
    return graph.travel(commands);
}

function part2(commands: Command[], graph: CubeGraph){
    return graph.travel(commands);
}

const fileRaw = await readFile('input/day22.txt', { encoding : 'utf-8'});
const [rawGrid, rawCommands] = fileRaw.split(/\r?\n\r?\n/);
const commands:Command[] = [...rawCommands.matchAll(/(\d+|[LR])/g)]
                            .map(match =>{
                                if ((match[1])==='L' ||(match[1]) === 'R'){
                                    return match[1];
                                }
                                return Number(match[1]);
                            });


const graph = new Graph(rawGrid);
const answer1 = part1(commands, graph);
const cubeGraph = new CubeGraph(rawGrid);
const answer2 = part2(commands, cubeGraph);

console.log(`part 1: ${answer1}\npart 2: ${answer2}`);