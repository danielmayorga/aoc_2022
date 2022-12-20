import { readFile } from 'fs/promises';

//find element after the number 0
function afterZero(mixList: number[]){
    for(let i=0; i<mixList.length; i++){
        if (mixList[i]===0){
            const afterIndex = (i+1)%mixList.length;
            return mixList[afterIndex];
        }
    }
    throw new Error("this shouldn't happen, no zero?");
}

//convert a map's value and current position to key for cycle detection
function toKey(map: Map<number, number>, currPosition: number){
    let key = "";
    for (let i=0; i<map.size; i++){
        key+=map.get(i)+",";
    }
    key+=currPosition;
    return key;
}

function part1(lines: number[]){
    const originalPattern = lines;
    const mixList = [...lines];
    
    //we need a position map to keep track of the numbers
    //there may be duplicates
    const positionMap = new Map<number, number>();//position to index
    const indexMap = new Map<number, number>();//index to position
    for (let i=0; i<originalPattern.length; i++){
        positionMap.set(i,i);
        indexMap.set(i,i);
    }
    //let's do some cycle detection :P 
    var visited = new Set<string>();
    //let's define the mix algorithm
    function mix(position: number){
        const num = mixList[position];
        const newPosition = (num+position+mixList.length)%mixList.length;
        //TODO shifting part needs work
    }
    let result = 0;
    let cycleFound = false;
    // go through the cycles
    for (let i =1; i< 3001; i++){
        const originalPosition = (i-1)%mixList.length;
        const position = positionMap.get(originalPosition) as number;
        //cycle detection
        const key = toKey(positionMap, position);
        if (visited.has(key) && !cycleFound){
            //cycleFound = true;
        }
        visited.add(key);
        //do the mix
        mix(position);
        //calculate after zero
        if ((i%1000) === 0){
            const after = afterZero(mixList)
            result+=after;
        }
    }


    return result;
}

function part2(lines: number[]){

}


const fileRaw = await readFile('input/day20.txt', { encoding : 'utf-8'});
const array = fileRaw.split(/\r?\n/).map(num => Number(num));

const answer1 = part1(array);
const answer2 = part2(array);

console.log(`part 1: ${answer1}\npart 2: ${answer2}`);