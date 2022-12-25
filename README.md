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

BFS - Breath First Search.

Just breath first search the solution for part 1. I see people online talking about A* or Dijkra's algorithm. That's overkill and they don't really understand graph algorithms if people resort to that. Use BFS if the graph has equal edges. 

#### Part 2 is correct for my input but may not be universally correct

My first thought was to reverse the traversal (from E to a vs part 1's S to E), but that would be more code.

I noticed all my `a` heights were in the left hand side so I did a hack in my code where I kept the same BFS and just set the cost of each newly encountered `a` to 0. Surprisingly that gave me the correct answer and I solved it pretty fast. However, that solution will not always work, it only worked because my optimum path was a subset of the regular path. There are positions in the graph that will break that logic. i.e. if the most optimal `a` is to the right most node past `E` from `S`.

I might revisit this with a correct solution in a different branch for correctness, but this is advent of code. I only really care about MY solution.

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

### Day 16

This problem originally stumped me because I didn't know about all pairs shortest path, but knew I needed it.
I had to read about Floyd's Algorithm which is super straight forward and awesome example of DP.

#### Part 1

1. Create a Graph like structure with the valves
2. Find All-Pairs-Shortest-Path for each valve with weight !== 0
3. Iterate through all possible combinations of the weighted valve nodes 

Runtime is O(V^3) + O(V!)...which is pretty bad, but our V's are pretty small. In my case there are 15 and it ran in < 1 second.

#### Part 2

I use a greedy algorithm to determine if the elephant or I should move.

I have a memoized table of function parameters, if we are in a state that is NOT optimal. Backout. I think this is callled backtracking.

My solution works in 6 seconds on my input. It's a bit ugly since I had to squeeze some more performance by using Arrays and numbers instead of Map/Object and strings. I have a more reable branch with code that runs a bit slower but is easier to follow.

### Day 17

#### Part 1

Implement the simulations. I used Object Oriented Design to create a class called Simulation. I used enums to make it easier to read things.

#### Part 2

In the simulation you can find a cycle. The cycle can be detected by the combonation of 2 things: airflowIndex and the deltas of all the columns.
My code may be a better indicator of how to find the cycle. After you find the cycle you want to do as follows:

``` typescript
    const { startCycle, cycleEnd, cycleHeight } = simulation.findCycle(); //find the start, end, and cycle height
    const nonCycleHeight = simulation.process(startCycle-1); //find the height prior to the cycle start
    const cycle = BigInt(cycleEnd-startCycle); //  calculate the cycle length
    const divisible = (1_000_000_000_000n - BigInt(startCycle)) / cycle; //find how many times the cycle can fit in rock iterations
    const remainder = (1_000_000_000_000n - BigInt(startCycle)) % cycle; // NOTE we subtract the start cycle it's not included since prior to this the cycle hasn't started :P
    const remainderHeight = simulation.process(Number(remainder)+startCycle) - simulation.process(Number(startCycle)); //we find the remainder. NOTE: you need to take into account the simulation state starting from the cycle. i.e. Don't do simulation.process(remainder), since your airflow and initial state wont be correct. the remainder takes into account the cycle state.
    return divisible*BigInt(cycleHeight)+BigInt(remainderHeight)+BigInt(nonCycleHeight);//our equation :P 
```

### Day 18

#### Part 1

Created a pretty simple algorithm called `adjacent`. if the diff of 1 axis is 1, and the rest are equal we return true.

each point has 6 sides. If 2 points are adjacent just subtract those 2 sides from the total.

#### Part 2

Remark - My first solution failed since I thought we only cared about gaps of size 1 cubed, but we care about empty space within ocupied points(squares).

I created a BFS algorithm with a twist, if we are outside a given range we (0-Max.Point(X,Y,Z)) then we return false and the visited points. We then memoized the `status` of the visited points so if we revisit them in the future we don't have to do the entire Bfs algorithm again.

If we are successful, We memoize the visited points with status true.

This day was wayyyyy easier than day 17 and 16 which is weird to me. 

### Day 19

Originally, this problem stumped me because although I knew there were permutations, I thought it was too big to brute force and didn't know of a backtracking way to do this. 

It has a lot of trial and error and I'm not confident that my solution is a general solution.

I did this brute forcing with some heuristics for path pruning (don't go down this path).

Here is my heuristics: (IDK if they are right, but I got the right answer for my input)
1. If you can make a geode robot...make it. No other option is optimal.
2. If you can't make a geode robot but have enough obsidian...wait don't do anything for a turn til you have more obsidian.
3. If you can make an obsidian robot...make it. No other option is optimal.
4. If you can't make an obsidian robot but have enough obsidian...wait don't do anything for a turn til you have more obsidian.
5. It is not optimal to sit on more ore when you can make things
6. It is not optimal to make more ore robots than the max cost of the highest recipe.

On my machine it ran in ~30 seconds. It might take longer on different machines.

### Day 20

I created a circular Link List. 
We move left if we're negative. We move right if we're positive.

#### Part 2

I modified the original algorithm. 
If our value is negative we move left by Math.abs(Num) %(length-1).
If our value is positive we move right by Num % (length-1);

The trick is the modulus of length-1. The reason for this is that we do not count OURSELVES when we are iterating.

### Day 21

#### Part 1

My original implementation just contained closure. You can look at the previous commit for it.

Since part 2 was introduced, I ended up removing the closure to not hide away (leftArg, rightArg and operation). Aside from that it's pretty straight forward.

#### Part 2 

This one was a bit trickier. 

- I started with a function to determine which branch contained the "humn"(me) monkey. I flagged ever node on the branch that contained it.
- I created a recursive helper function called solveForMe which works backwords. We're solving for "humn" which is X. Thankfully we only have one reference.
- We have the following instruction (first operation second) = Value
    - if first contains "humn", we evaluate solveForMe(Value inverseOperator secondEval, first);
    - if second contains "humn", we evaluate solveForMe(Value inverseOperator firstEval, second);
    - I grabbed a piece of paper and wrote down the different inverse operations. They require a bit of thinking.
- Our base case is if we find "humn" we return the value that we should be equal to.

#### Remarks

I was tempted to cheese this challenge by printing out a string with "X" for "humn" and plugging it in to wolframalpha to solve but that wouldn't be a challenge.


### Day 22

#### Part 1

I created a graph with the correct Up, Down, Left, Right Neighbors to wrap around the grid. It was tedius. I wonder if there was a more efficient way to do it. I used a Map to contain every node, but still had to iterate (rows*maxColumn)

#### Part 2

I drew and cut out a paper cube.
I hardcoded all the reorientations and moves specific to my input. This is NOT a general solution, but it solves my problem because I'm just a humble coder and not some mathematician.

### Day 23

#### Part 1

Create the simulation with a Map instead of a multi dimensional array. 
We have a proposal dictionary that takes in (string position) => (position[]), so we keep track of all the proposal for a new coordinate.
If the array has more than 1 element don't do anything.

Follow the defined rules (I didn't read them correctly so I lost time).

#### Part 2

Add a flag to check if the position has changed. This was a relatively small change with my first implementation.
We just checked the proposal dictionary and made sure the key and sole position in the position array don't match.


### Day 24

We're almost done!

#### Part 1

We create a simulation. Each minute we update the map and iterate through all our candidate positions.
We optimize a little bit by having a set of visited positions.
We also have to take into account waiting at the entrance/exit(for part 2)
We end when we reach the end. Simple graph traversal.

#### Part 2

Thankfully this was really easy because we retained state. We reverse the order to return (start at exit at the most optimal minute), and then run our function from part 1 when we reach the entrance again.


### Day 25

The problem is sorta a weird variant of the Classic toRomanNumeral and fromRomanNumeral.

- we first converted all the string to numbers
- we then summed the values
- we then converted to the snafu string

Converting from the string to number is pretty straight forward working right to left with a switch case.

Converting from number to string was a bit tougher. I knew I wanted to mod and divide by 5, but getting the negatives to play well took a lot of tinkering. Originally I had `"210-="`, but I failed naturally because the modded values didn't correspond correctly. 
I rethought the problem to `"012=-"`, 0 to 2 makes sense. = and - don't initially but do if you add 5 to the rolling sum.


### Epilogue

Finally...it's over. I get to relax, and enjoy my winter break :)
I'm glad I went through this journey. There were times I thought about quitting, but stuck through it. 

My college roommate Tom asked me, "Why do you do advent of code? Seems like a waste of time."

I think I can answer it. 

The greatest strength of advent of code is the community. 200_000 people started on the first problem. Every night there is a new one introduced. It's cool that there is a subreddit of people who share memes and joke about the problems we answer.

People in the community find different reasons to participate:

- Some want to become stronger programmers with more code confidence
- Some want to be challenged
- Some want to learn/improve on a language
- Some make the challenge harder on themselves: like the dude using Excel to solve the problems :o 
- Some like to make visualizations.
- Some want to solve problems.

I want to solve problems, and I like the memes people make. They push me to want to finish this. Next year I probably wont participate, but I'm glad I finished 2017, 2021, and 2022 with 50 stars and in total I have `220` stars spanning the rest of the years.