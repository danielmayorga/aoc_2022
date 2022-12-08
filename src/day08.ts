import { readFile } from 'fs/promises';

function part1(grid: number[][]){
    let visible = new Set<number>();
    function setVisible(row: number, column: number){
        let position = row*grid[0].length+column;
        visible.add(position);
    }
    for(let row=0; row< grid.length; row++){
        //left to right
        let previous = grid[row][0];
        setVisible(row, 0);
        for(let column=1; column <grid[row].length; column++){
            const current = grid[row][column];
            if (current > previous){
                setVisible(row,column);
                previous = current;
            }
        }
        //right to left
        previous = grid[row][grid[row].length-1];
        setVisible(row, grid[row].length-1);
        for (let column=grid[row].length-2; column>=0; column--){
            const current = grid[row][column];
            if (current > previous){
                setVisible(row,column);
                previous = current;
            }
        }
    }
    for(let column=0; column <grid[0].length; column++){
        //top to bottom
        let previous = grid[0][column];
        setVisible(0, column);
        for(let row=1; row< grid.length; row++){
            const current = grid[row][column];
            if (current > previous){
                setVisible(row,column);
                previous = current;
            }
        }
        //bottom to top
        previous = grid[grid.length-1][column];
        setVisible(grid.length-1, column);
        for(let row=grid.length-2; row>=0; row--){
            const current = grid[row][column];
            if (current > previous){
                setVisible(row,column);
                previous = current;
            }
        }
    }
    return visible.size;
}

function part2(grid: number[][]){
    const rowSize = grid.length;
    const columnSize = grid[0].length;
    //gross brute force, I wanted to do some memoization but the logic I had broke down when 
    //the values were non-descending 5 -> 4 -> 2 -> 3 -> 4, I couldn't memoize for this
    //I can optomize for O(10) by using a map with last position of a height but don't want to write it
    function scenicScore(row: number, column: number){
        let value = grid[row][column];
        //check visible trees to the left
        let left = 0;
        for(let r =row-1; r >= 0; r--){
            left++;
            if (grid[r][column] >= value){
                break;
            }
        }
        //check visible trees to the right
        let right = 0;
        for(let r =row+1; r < rowSize; r++){
            right++;
            if (grid[r][column] >= value){
                break;
            }
        }
        //check visible trees atop
        let atop = 0;
        for(let c =column-1; c >= 0; c--){
            atop++;
            if (grid[row][c] >= value){
                break;
            }
        }
        //check visible trees below
        let below = 0;
        for(let c =column+1; c < columnSize; c++){
            below++;
            if (grid[row][c] >= value){
                break;
            }
        }
        return atop*left*right*below;
    }

    let max = 0;
    for (let row =0; row< rowSize; row++){
        for (let column=0; column<columnSize; column++){
            max = Math.max(scenicScore(row,column), max)
        }
    }
    return max;
}

const fileRaw = await readFile('input/day08.txt', { encoding : 'utf-8'});
const grid = fileRaw.split(/\r?\n/)
                    .map(line => line.split('').map(Number));

const answer1 = part1(grid);
const answer2 = part2(grid);

console.log(`part 1: ${answer1}\npart 2: ${answer2}`)