import { readFile } from 'fs/promises';

interface LinkListItem{
    value: number;
    originalPosition: number;
    prev: LinkListItem|undefined;
    next: LinkListItem|undefined;
}

//find element the node with the zero value
function findZero(item: LinkListItem){
    while(item.value!==0){
        item = item.next as LinkListItem;
    }
    return item;
}

//iterate right of item by X moves 
function iterate(item: LinkListItem, moves: number){
    for(let i=0; i<moves; i++){
        item = item.next as LinkListItem;
    }
    return item;
}

//Debug Helper, when I was originally writing part 1 I needed a good way to print out the current state
//VS Code doesn't present the data in the watch tab well.
function DebugHelper(item: LinkListItem, length: number){
    let result = "";
    for(let i=0; i<length; i++){
        result+= item.value +", ";
        item = item.next as LinkListItem;
    }
    console.log(result);
}

/**
 * Solution for both parts
 * @param lines original unmix numeric list
 * @param mixCount how many times to mix
 * @param multiple multiply unmix list by X number
 */
function solution(lines: number[], mixCount: number, multiple: number){
    //create a circulat link list
    const linkListArray = lines.map((value, originalPosition) =>(
        {
             value: value*multiple, 
             originalPosition
        } as LinkListItem
    ));
    const start = linkListArray[0], end = linkListArray[linkListArray.length-1];
    start.prev = end;
    end.next = start;
    for (let i=1; i<linkListArray.length; i++){
        linkListArray[i].prev = linkListArray[i-1];
        linkListArray[i-1].next = linkListArray[i];
    }

    //let's define the mix algorithm
    function mix(currentNode: LinkListItem, length: number){
        let num = currentNode.value;
        const iterate = currentNode;
        if (num > 0){
            num = num%(length-1);
            for(let i=0; i<num; i++){
                //swap
                let A = iterate.prev as LinkListItem;
                let B = iterate as LinkListItem;
                let C = iterate.next as LinkListItem;
                let D = iterate.next!.next as LinkListItem;

                B.next = D;
                D.prev = B;

                B.prev = C;
                C.next = B;

                A.next = C;
                C.prev = A;
            }
        }else{
            num = Math.abs(num) % (length-1);
            for (let i=0; i<num; i++){
                let A = iterate.prev!.prev as LinkListItem;
                let B = iterate.prev as LinkListItem;
                let C = iterate as LinkListItem;
                let D = iterate.next as LinkListItem;

                B.next = D;
                D.prev = B;

                B.prev = C;
                C.next = B;

                A.next = C;
                C.prev = A;
            }
        }
    }
    for(let i=0; i<mixCount; i++){
        for (let currentNode of linkListArray){
            mix(currentNode, linkListArray.length);
            //DebugHelper(start, mixListArray.length);
        }
    }

    //find the zero node and iterate forward X amount
    const zeroNode = findZero(start);
    return [1000,2000,3000].map(iteration =>{
        const iterateCount = iteration%linkListArray.length;
        return iterate(zeroNode, iterateCount).value;
    }).reduce((sum, curr) => sum+curr, 0);
}



const fileRaw = await readFile('input/day20.txt', { encoding : 'utf-8'});
const array = fileRaw.split(/\r?\n/).map(num => Number(num));

const answer1 = solution(array, 1, 1);
const answer2 = solution(array, 10, 811589153);

console.log(`part 1: ${answer1}\npart 2: ${answer2}`);