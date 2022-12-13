import { readFile } from 'fs/promises';
//first recursive type 
type List = number[] | List[];
interface ListPair{
    first: List
    second: List;
}

function rigthtOrder(first: List, second: List): boolean | undefined{
    const maxIter = Math.min(first.length, second.length);
    for(let i=0; i<maxIter; i++){
        let fVal = first[i], sVal = second[i];
        if (typeof fVal === "number" && typeof sVal === "number"){
            if (fVal < sVal){
                return true;//right order
            }
            if (fVal > sVal){
                return false;
            }
        } else if (typeof fVal === "number"){
            const compare = rigthtOrder([fVal], sVal as List);
            if (compare != null){
                return compare;
            }
        } else if (typeof sVal === "number"){
            const compare = rigthtOrder(fVal as List, [sVal]);
            if (compare != null){
                return compare;
            }
        } else{
            const compare = rigthtOrder(fVal, sVal);
            if (compare != null){
                return compare;
            }
        }
    }

    if (first.length === second.length){
        return undefined;
    }
    return first.length < second.length;
}

const part1 = (list: ListPair[]) =>
    list.map((pair, index) => ([rigthtOrder(pair.first, pair.second), index+1 ] as [boolean, number]))
    .filter(([rightOrder, index]) => rightOrder)
    .reduce((p,c) => p+c[1], 0);

function part2(list: ListPair[]){
    const allList = list.map(pair => [pair.first, pair.second]).flat(1).concat([[[2]]], [[[6]]]);
    const sorted = allList.sort((a, b) => {
        const rightOrder = rigthtOrder(a,b);
        if (rightOrder == null)
            return 0;
        return rightOrder ? -1 : 1;
    });
    
    const twoPosition = sorted.findIndex(elem => elem[0] && Array.isArray(elem[0]) && elem[0]?.[0] === 2 )+1;
    const sixPosition = sorted.findIndex(elem => elem[0] && Array.isArray(elem[0]) && elem[0]?.[0] === 6 )+1;

    return twoPosition*sixPosition;
}

const fileRaw = await readFile('input/day13.txt', { encoding : 'utf-8'});
const listPair = fileRaw.split(/\r?\n\r?\n/)
                .map(lines => {
                    const [first, second] = lines.split(/\r?\n/).map(eval)
                    
                    return {
                        first,
                        second,
                    }as ListPair
                });//first use of eval in these challenges :P 
const answer1 = part1(listPair);
const answer2 = part2(listPair);


console.log(`part 1: ${answer1}\npart 2: ${answer2}`);