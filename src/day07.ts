import { readFile } from 'fs/promises';

interface TreeNode{
    name: string;
    nodes: (TreeNode | File)[];
}

interface File{
    name: string;
    bytes: number;
}

const lsCommand = /\$ ls/;
const cdCommand = /\$ cd (\.\.|[a-zA-Z]+|\/)/;
const dirListing = /dir ([a-zA-Z]+)/;
const fileListing = /(\d+) ([a-zA-Z\.]+)/;

/** create tree object */
function createTree(lines: string[]){
    const root: TreeNode = { 
        name: '/',
        nodes: []
    };
    let stack = [root];
    let iterator = root;
    for(let i = 1; i< lines.length;){
        let line = lines[i];
        let match;
        if (match = line.match(lsCommand)){
            let j = i+1;
            for (; j < lines.length && lines[j][0] !== "$"; j++){
                line = lines[j];
                if ((match = line.match(dirListing)) && match.length >= 2){
                    iterator.nodes.push({ name: match[1], nodes: []} as TreeNode)
                }else if ((match = line.match(fileListing)) && match.length >= 3){
                    iterator.nodes.push({ name: match[2], bytes: Number(match[1])} as File);
                }else{
                    throw new Error("something went wrong with ls parsing");
                }
            }
            i=j;
        }else if ((match = line.match(cdCommand)) && match.length >= 2){
            if (match[1] === ".."){
                stack.pop();
                iterator = stack[stack.length - 1] ?? root;
            }else {//will be directory
                let name = match[1];
                iterator = iterator.nodes.find(node => node.name === name) as TreeNode;
                stack.push(iterator);
            }
            i++;
        }else{
            throw new Error("some parsing went wrong with command parsing");
        }
    }
    return root;
}


const fileRaw = await readFile('input/day07.txt', { encoding : 'utf-8'});
const lines = fileRaw.split(/\r?\n/);

let tree = createTree(lines);
/** returns a map with key being the treenode and value being bytes used for folder */
function getFolderBytes(root: TreeNode){
    let map = new Map<TreeNode, number>();
    function calculateSum(node: TreeNode){
        if (map.has(node)){
            return map.get(node) as number;
        }
        let sum = 0;
        for(let child of node.nodes){
            if ('bytes' in child ){
                sum+=child.bytes;
            } else{
                sum+=calculateSum(child);
            }
        }
        map.set(node, sum);
        return sum;
    }
    calculateSum(root);
    return map;
}

function part1(root: TreeNode){
    let map = getFolderBytes(root);
    const MAX_CUTOFF = 100_000;
    let result = 0;
    for (let bytes of map.values()){
        if (bytes < MAX_CUTOFF){
            result += bytes;
        }
    }
    return result;
}

function part2(root: TreeNode){
    const TOTAL_SPACE = 70_000_000;
    const REQUIRED_SPACE = 30_000_000;
    let map = getFolderBytes(root);
    const CURRENT_USED = map.get(root) as number;
    const AVAILABLE_SPACE = TOTAL_SPACE - CURRENT_USED;
    let minValue = CURRENT_USED;//if we delete everything
    for (let bytes of map.values()){
        let candidate = AVAILABLE_SPACE + bytes;
        if (candidate >= REQUIRED_SPACE){
            minValue = Math.min(bytes, minValue);
        }
    }
    return minValue;
}

const answer1 = part1(tree);
const answer2 = part2(tree);

console.log(`part 1: ${answer1}\npart 2: ${answer2}`)