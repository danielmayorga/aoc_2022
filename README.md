# Advent of Code 2022 in Typescript with Node

- Working on VSCode so I use launch.json to run my typescript code
-`src/` contains the source code with the typescript solutions
-`input/` contains the puzzle input in txt files

## Editorial - My comments on each day's problem

Here are my thoughts on each days problems:

### Day 1

Pretty straightforward question. On day one I tried to write more functional code than I normally do. Part 2 saw a lot of condenced code.

#### Parsing the input

Why have `\r?\n` in the regex to split chunks?

Windows machines will create a newline with `\r\n` while my macbook will create newlines with `\n`. I hop between both computers so I've just gotten in the habit of it.

The input is grouped with empty newlines seperating collections of "calories".

We split on these empty newlines, so we can have a input of `number[][]`. Each elves calorie collection.

### Day 2

It's pretty straight foward implementation of the game logic. Not much to say. Part 2 had some interesting math to reduce a lot of code, I'll write about it below.

#### Style

In general I worked with enums more in order to make the code a lot more readable. 

#### Interesting Code - Part 2

The Lose and Win conditions are interesting. 

We have the following array of size 3.

`[Rock(1), Paper(2), Scisors(3)]`

Elements to the left (wrapping included) will always lose to the current element i.e. (Paper will beat Rock, Rock will beat Scisors, and Scisors will beat paper).

The opposite happens when you right (wrapping included).

We can use the modulus operator `%` to go to the next left or right element. You can read the code to see the logic.

### Day 3

We're using `Set` vs the naive approach of comparing length 1 strings (javascript doesn't have `char` so everything is a `string`). We get a better runtime. O(N) vs O((N/2)*(N/2)) => O(N^2)

### Day 4

We used a `regex` to parse the data and converted each line to an object that implements an interface we defined called `Range`. We used an `object` vs `[number, number]` for readability. `range.start` is easier to read/understand vs `range[0]`.

Aside from that it's just a problem of overlapping ranges.

### Day 5

This day was fun to parse. I think parsing was the most time consuming part of this day's challenge.

#### Part 1
When we move element from one stack to another we pop it from the stack and put it directly to the other stack.

#### Part 2 - Temp Array
When we move elements we put them in a temp array and then reverse the temp array. Then we add the temp array to the stack.

### Day 6

This is a classic problem: First Window of Size X with unique characters(sometimes this question is asked with numbers). There are probably better explanations online but I'll try.

We have a O(N) runtime solution that is applicable to both parts.

We have two data structures:

- A `Set` to keep track of our unique characters
- A `Queue` (`Array` in javascript) that acts as our window.

When we iterate through the characters. We check if the character is already in our `Set`.

- If the character **isn't** in the `Set`, we add it to the queue and add it to our set.
- If the character **is** in the `Set`, we keep on dequeue'ing elements and remove the dequeue'd element from our `Set` as well with `Set.delete`. We keep doing this until our new character is NOT in the set. Afterwards, we go back to the logic in the bullet point above.

We have one general solution with a parameter for Window size. Part 1 is size 4 and Part 2 is size 14

### Day 7

We created the tree like structure. Thankfully the input allowed us to parse it relatively easily.

We use recursion AND a `Map` in a helper function called `getFolderBytes`. 
The Map acted as a memo where it stored the bytes per tree node (I didn't use name because we have the object PLUS name could be used multiple times there is no guarentee the name will be unique per entire file system).

Then part 1 and 2 are just utilizing the map of tree nodes to size to fulfill their requirements.

### Day 8

#### Part 1
Part 1 is optimal. The runtime is O(NM). We iterate 4 times through the grid: left, right, up, down. We keep our previous largest number. If your current position is larger than the previous number it is visible. Update your previous largest number and continue the logic. 

This is better than brute force Which is O(N^2M + NM^2)

#### Part 2

We brute force it. So we have runtime of O(NM(N+M))

In retrospect, I think we can optimize this solution to be O(NM).
We could keep an array from 1-9 with the previous occurance of a given height. That way we don't have to traverse any axis more than once. Our runtime would be O(NM*9) => O(NM). 

Thankfully, brute force isn't too bad since most of the time you break out earlier through the logic of the problem.


### Day 9

We have a helper function called `move` which will move one knot(`Position`) compared to the position of another knot(`Position`) of the rope.

Originally, I had a bug because I didn't take into account a certain type of diagonal movement.

Aside from that we use a `Set` to keep track of the visited spaces by the tail. We return `Set.size`

### Day 10

This one is a little more involved. We iterate through `cycles` with a for loop with the variable `cycle` as our iterator we don't use the for loop increment segment since we could go through 2 cycles depending on the command we are assigned.

We have a fancy math calculation to make sure cycles reside in (20,60,100,...,220). 

isSpriteVisible is a helper function we've added to solve for part 2. We also have our cycles go all the way to 240 so we can display all the sprites for our output.

We have a function that helps us print out the solution for part2 called `printout` which prints 40 characters per line.

### Day 11

My favorite day so far for a few reasons:

We have a more object oriented approach vs most other day's functional approaches. We manipulate monkey objects and we utilize `closure` to simulate the action of moving an inspected item to another monkey in the same containing array.

Parsing is fun here. I'll let you read the code. It's a bit more involved, but complicated.

#### The Gimmic: GCD Greated Common Divisor

We can't use big ints (depite my code being littered with big int, it's not necessary). 

We can get the greated common divisor for every monkey's Test (Which are all prime numbers for me :P so the GCD is the multiple of everything).

We use the `modulo` `%` operator to reduce the since each time we perform an operation. If we don't do this we'll balloon our bigints and run extremely slowly maybe even run out of memory.

### Day 12

DFS - Depth First Search.

Just depth first search the solution for part 1. I see people online talking about A* or Dijkra's algorithm. That's overkill and they don't really understand graph algorithms if people resort to that. 

#### Part 2 is correct for my input but may not be universally correct

My first thought was to reverse the traversal (from E to S vs part 1's S to E), but that would be more code.

I noticed all my `a` heights were in the left hand side so I did a hack in my code where I kept the same DFS and just set the cost of each newly encountered `a` to 0. Surprisingly that gave me the correct answer and I solved it pretty fast. However, that solution will not always work. There are positions in the graph that will break that logic. i.e. if the most optimal `a` is to the right most node past `E` from `S`.

I might revisit this with a correct solution, but this is advent of code. I only really care about MY solution.

### Day 13

Halfway point.

Day 13 saw me using some interesting things: recursive typing (typescript) and `eval`.

I used `eval` to convert the arrays to real arrays. I used the recursive type to properly type the arrays.

This problems logic resides in recursive helper function `rigthtOrder`. 
It compares two arrays and returns 

- true if it is in the right order. 
- false if it is in the wrong order.
- undefined if the comparison is equal.

You are handling ternary logic in the fuction and want to short circuit when you have a boolean output, but want to continue if you have an undefined output.

#### part 2 

We use `rightOrder` to sort. 

### Day 14

Created a Simulation class with a primary method called `addSand` that returns true if sand was added, return false otherwise.

The simluation uses a 2-dimensional array of size 500. The size is arbitrary and we could have made it smaller if we got the min/max of the lines.

We have a recursive method called `dropSand`. That returns true if sand was dropped or was sent to the void. It returns false if you can not set sand. We use this boolean nature to short circuit some logic.

How do we keep track if a change occurred? a `Set`. If the set size changes after dropSand we know it didn't go to the void.

#### part 2
We added 2 bits of logic to our general solution:

- if we try to add sand and the source's location is already occupied then return false.
- we add the additional condition of Max Y height + 2 will always return true for `hasElement` since the line is infinite.

### Day 15

Instead of the naive approach creating some arbitrary axis and filling each intermediate space, I used Ranges(Intervals) to solve this problem.

I checked if ranges overlap, and if so I merged them. This reduces the space required and I also believe time complexity.

#### Part 1

In part 1, I created ranges for the X positions on Y = 2_000_000.

Then I merged the ranges that I could. With these reduced ranges, I summed their intervals and BAM we have the answer.

#### Part 2

In part 2, I did do a sorta naive approach. I still use ranges, but I iterate from Y = 0 to Y = 4_000_000.

I have a helper function to find the available x position for a given range if it exists. 

once i find the availble x position in a given y position. I just do the "frequency tuning" algorithm defined in part 2 and call it a day. 

While I'm confident in the performance of part 1, part 2 has me curious if there is a better approach. On my machine, with my input both parts ran together in ~1 second.
