import { readFile } from 'fs/promises';

interface MixItem{
    value: number;
    originalPosition: number;
    prev: MixItem|undefined;
    next: MixItem|undefined;
}

//find element after the number 0
function findZero(mixList: MixItem){
    while(mixList.value!==0){
        mixList = mixList.next as MixItem;
    }
    return mixList;
}

function iterate(item: MixItem, moves: number){
    for(let i=0; i<moves; i++){
        item = item.next as MixItem;
    }
    return item;
}

function findPosition(item: MixItem, originalPosition: number){
    while (item.originalPosition !== originalPosition){
        item = item.next as MixItem;
    }
    return item;
}

function DebugHelper(item: MixItem, length: number){
    let result = "";
    for(let i=0; i<length; i++){
        result+= item.value +", ";
        item = item.next as MixItem;
    }
    console.log(result);
}

function part1(lines: number[]){
    const mixListArray = lines.map((value, originalPosition) => ({ value, originalPosition} as MixItem));
    const start = mixListArray[0], end = mixListArray[mixListArray.length-1];
    start.prev = end;
    end.next = start;
    for (let i=1; i<mixListArray.length; i++){
        mixListArray[i].prev = mixListArray[i-1];
        mixListArray[i-1].next = mixListArray[i];
    }

    //let's define the mix algorithm
    function mix(currentNode: MixItem, length: number){
        let num = currentNode.value;
        const iterate = currentNode;
        if (num > 0){
            for(let i=0; i<num; i++){
                //swap
                let A = iterate.prev as MixItem;
                let B = iterate as MixItem;
                let C = iterate.next as MixItem;
                let D = iterate.next!.next as MixItem;

                B.next = D;
                D.prev = B;

                B.prev = C;
                C.next = B;

                A.next = C;
                C.prev = A;
            }
        }else{
            for (let i=num; i<0; i++){
                let A = iterate.prev!.prev as MixItem;
                let B = iterate.prev as MixItem;
                let C = iterate as MixItem;
                let D = iterate.next as MixItem;

                B.next = D;
                D.prev = B;

                B.prev = C;
                C.next = B;

                A.next = C;
                C.prev = A;
            }
        }
    }
    //mix once
    for (let originalPosition = 0; originalPosition< mixListArray.length; originalPosition++){
        const currentNode = findPosition(start,originalPosition);
        //do the mix
        mix(currentNode, mixListArray.length);
        //DebugHelper(start, mixListArray.length);
    }
    //find the zero node and iterate forward X amount
    const zeroNode = findZero(start);
    return [1000,2000,3000].map(iteration =>{
        const iterateCount = iteration%mixListArray.length;
        return iterate(zeroNode, iterateCount).value;
    }).reduce((sum, curr) => sum+curr, 0);
}

function part2(lines: number[]){

}


const fileRaw = await readFile('input/day20.txt', { encoding : 'utf-8'});
const array = fileRaw.split(/\r?\n/).map(num => Number(num));

const answer1 = part1(array);
const answer2 = part2(array);

console.log(`part 1: ${answer1}\npart 2: ${answer2}`);