import { readFile } from 'fs/promises';

class VisibleEntry{
    #visible = new Set<number>();
    setVisible = (row: number, column: number) => {
        let position = row*grid[0].length+column;
        this.#visible.add(position);
    }
    get count(){
        return this.#visible.size;
    }
}

/**
 * Runtime O(Row*Column) we keep track of our previous largest tree in 4 directions (Up, Down, Left, Right)
 * if we are bigger than the previous larget tree, we are visible and now the new previous largest tree
 * @param grid 
 * @returns visible trees
 */
function part1(grid: number[][]){
    var visibleEntry = new VisibleEntry();
    const rowLength = grid.length;
    const columnLength = grid[0].length;
    /**
     * Iterates through with dx/dy changes, if the row and column iterators are out of bounds stops
     * This is a little more complex and not my original submission, but I've revisited this code
     * in order to cut down repetition
     * @param rowStart starting position of row
     * @param columnStart - starting position of column
     * @param dx - alteration of row
     * @param dy - alteration of column
     */
    function iterate(rowStart: number, columnStart: number, dx: number, dy: number){
        //always keep track of your previous largest tree. If you are bigger, you are visible.
        let previousLargestTree = grid[rowStart][columnStart];
        //the initial position is always visible
        visibleEntry.setVisible(rowStart, columnStart);
        for(
            let row = rowStart, column = columnStart; //initialize
            row >=0  && row<rowLength && column >= 0 && column < columnLength; //condition
            row+=dx, column+=dy // update
            ){ 
            const current = grid[row][column];
            //if you are bigger than the previous largest tree, you are visible AND 
            //you are now the previous largest tree
            if (current > previousLargestTree){
                visibleEntry.setVisible(row,column);
                previousLargestTree = current;
            }
        }
    }

    for(let row=0; row< grid.length; row++){
        //left to right
        iterate(row, 0, 0, 1);
        //right to left
        iterate(row,columnLength-1, 0, -1);
    }
    for(let column=0; column <grid[0].length; column++){
        //top to bottom
        iterate(0, column, 1, 0);
        //bottom to top
        iterate(rowLength-1, column, -1, 0);
    }
    return visibleEntry.count;
}


/**
 * Runtime O(Row*Column*(Row+Column)) naive approach - go through each column entry and compute the score.
 * 
 * Remarks: I can optomize for O(Row*Column*10) => O(Row*Column) by keeping track of the index of the last occuring tree height
 * that way we dont have to iterate and check each neighboring cell multiple times instead we just check each tree height taller than it and take the the closest value
 * However, that makes this more complex to read, and for this challenge I don't benefit from the speed boost.
 * @param grid 
 * @returns largest score
 */
function part2(grid: number[][]){
    const rowLength = grid.length;
    const columnLength = grid[0].length;
    /**
     * Trying to cut back on repetition at the cost of complexity
     * This isn't my original submission, but a refactor. 
     * Check original git commit to see a more verbose...yet easier to understand solution
     * @param value value of cell
     * @param rowStart starting row position
     * @param columnStart starting column position
     * @param dx alteration to row each iteration
     * @param dy alteration to column each iteration
     * @returns score of that axis
     */
    function scoreHelper(value: number, rowStart: number, columnStart: number, dx: number, dy: number){
        let score = 0;
        for(
            let row = rowStart, column = columnStart; //initialize
            row >=0  && row<rowLength && column >= 0 && column < columnLength; //condition
            row+=dx, column+=dy // update
        ){
            score++;
            if (grid[row][column] >= value){
                break;
            }
        }
        return score;
    }

    function scenicScore(row: number, column: number){
        const value = grid[row][column];
        //check visible trees to the left
        const left = scoreHelper(value, row-1, column, -1, 0);
        //check visible trees to the right
        let right = scoreHelper(value, row+1, column, 1, 0);
        //check visible trees atop
        let atop = scoreHelper(value, row, column-1, 0, -1);
        //check visible trees below
        let below = scoreHelper(value, row, column+1, 0, 1);
        //calculate score
        return atop*left*right*below;
    }

    let max = 0;
    for (let row =0; row< rowLength; row++){
        for (let column=0; column<columnLength; column++){
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