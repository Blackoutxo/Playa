# PLAYA
### Playa is a neo-brutalist themed web-playable game website including some classics game like "Snake, Tetris". This website has local storage system for keeping your score for your own future use. The main page has global variable theme change in the settings icon which changes every theme of the games and the main page's itself. The game selection window arranges the game in grid layout instead of absolute positioning (The grid layout was added in Jul 5, '26), for future use for adding more games below the currently made ones.


### Here's the web link
[[Click here]](https://blackoutxo.github.io/Playa/)

### Here's the image of the main page

<img width="1365" height="616" alt="image" src="https://github.com/user-attachments/assets/11ca34b8-f344-46d6-b9ac-dc9e0fca9086" />

### The currently available games are :

## Snake (The snake appears buggy and is supposed to, It was how I made the game in my minecraft's mod's GUI screen, buggy, simple, fun)
### Snake is a one of the classic game where a small body of snake moves around a grid where it is guided towards apple where the snake eats the sugary apple and gets fat (He actually gets longer) and player play until the full grid is filled. The game is currently desktop supported only. This game has an loading screen made up of pure css and js, giving the feel of arcade machine. This game was ported from one of my old java projects into javascript.

### Controls: W (UP), A (Left), S (Down), D (RIGHT), Enter (Start / Re-start)

<img width="1365" height="620" alt="image" src="https://github.com/user-attachments/assets/c0a4c396-77cd-49e3-8522-0565221fe18c" />

## Gravity
### Gravity is simple minimalistic a space based physics game where a player uses currently given placeable planets (Blue circular objects), to overcome the effect of the heavenly bodies (red circular objects) and lead the moving body (comet) to the goal position. This game has buttons on its left and right side, where player hovers upon the left and right side the buttons appears to visit previous levels or get to the highest level the player has achieved till then. This game has semi-futuristic loading screen with its fitting sound. This game uses matter-js for physics based calculation.
### Controls: Space (Launching comet), Left-click (placing planets), Enter (Restart)
### Levels: 30

<img width="1366" height="610" alt="image" src="https://github.com/user-attachments/assets/a5b62e95-b5fc-4e6a-bc05-3396067131a1" />

## Tetris (The 'bugs' aren't bugs, they are meant to be there to represent my old mod's coding style ported from java)
###  Tetris is another classic game where falling pieces of block are arranged next to one another where a line is formed and the made line removes and you score and increases the speed as you clean the line. This game has a loading screen which is really simple with a half-fitting sfx sound for it. This game was also ported from the same old project into javascript. The java project being 2 files long was a bit hard to port it into javascript so had to use AI and its consultation to fix issues.
### Controls: Arrow up(Rotate), Arrow Left(Left), Arrow Right (Right), Arrow Down (Down), Space (instant down).

<img width="1366" height="620" alt="image" src="https://github.com/user-attachments/assets/57db2b10-4bcd-4238-bfe6-b138f772260e" />

## PI
### PI is a sequencing based game where players press the next-sequence number from num-pad or the numbers button or straight up the calculator button, the calculator features a button to reset the sequence and another button where you can see the next sequence for practicing. Players have to sequence upto 1000th digit of PI to win the game. This game might just be mobile friendly perhaps? This game has a sleek and modern-ish loading scree with the calculator being spawned up when the loading gradually fades into the abyss.
### Controls: Number button, num-pad buttons, calculator buttons, 

<img width="1366" height="615" alt="image" src="https://github.com/user-attachments/assets/2b31f2a9-fc40-47db-8a60-b0f7bb510522" />

## Minesweeper
### Minesweeper is another classic game where players logically and carefully deduct which cell might contain the bomb so as to win the game. This game improves one's deduction skills. The game has sleek animations when the selected cells are pressed and the same system to flag the cells. The game has 3 levels (Beginner, Intermediate, Expert). This game has a loading screen to select the levels with one button to go back to main-page. When selected a level an animation is played to load up the level same goes for pressing the back button. This game pops up back button when hovered over at left side and restart button pops up when hovered over the right side. The game used help of AI for some logics but not for design, animations and such.
### Controls: Left-click (Reveal cell), Right-click (Flag cell)

<img width="1366" height="616" alt="image" src="https://github.com/user-attachments/assets/1a38eae9-fd22-44ac-845f-b51f39f2d3c6" />

## Hangman
### Hangman is yet another classic game following the neo-brutalist theme of this website where players choose a topic they want to play about then answer each question carefully by given clues by the question or just answering it. The game is over when the stick figure man is completely made. This game has a loading screen where the header gradually builds and fills to create the full header. When selected a topic an animation is played and same goes for pressing the back button which appears when hovered over the left side and restart-button when hovered upon the right side.
### Controls: Keyboard keys (Any key pressed counts as a letter of its own so if you even press enter button it is registered as wrong input, if you press one of the letters included in the cells when the cell is filled your cell input is checked and lets you off to another level)
 
<img width="1366" height="617" alt="image" src="https://github.com/user-attachments/assets/b9bd2822-b672-43d1-9462-ad63b4acab69" />

## How does it work, and the motive towards it?

### The main motive towards this website and this type of animations and web-design style was that all the web-based game were kind of crappy looking and with low-end effort look and I wanted a website for those looking for these kind of (modern-ish) web-playable games. I tried my best to implement my vision to which I have succeeded. Smooth, sleek, animated, neo-brutalist themed....just matches what games were supposed to look like.

### Main page: 
The main page has a position __Fixed__ attribute navbar with z-index to the absolute max so that it overlaps anything, the settings button is an image which is flipped 360 degrees when pressed upon by a integer value so the animation reverses when opening it rotates 360 degrees and when pressed again to close it the image rotates back its previous rotation path by the same logic.

- ### Game selection Area: 
The game selection area was originally position : absolute and top, left value based but was recently updated to have grid display to display the games in a grid and for future use case.

- ### Loading screen: 
The loading screen has a hovering __Initializing__ box with a loading bar on its bottom which is animated by pure css, the loading bar's width value is set from 1 to 100 with linear-gradient method to really give it a nice touch. The screen is removed upwards by a set interval in its script which adds a class of the loading screen and moves it upwards.

### Snake game: 
This game works using __HTML CANVAS__, originally I had one of my old java projects including this game and I ported this into my web-playable game which was quite easy. This works by arrays and javascript math.random to generate the next apple in its grid. The direction of snake is changed upon the window event key listener and change the string for the game to continuosly listen to and react accordingly.

### Gravity game: 
I built this game to re-create what I had played recently of someone from hack-club. Their project was really awesome and really addictive. I don't know how and why but it was addicting and so I decided to re-create the game using my specialties but I can't find the original inspiration and I don't think this game is quite addictive as the one I had played before. This game is built using __lia-bru's matter-js__ web-based javascript physics engine to make the game. A huge number of levels data are stored in an array to load them easily instead of the hassle of one function for each or whatever. The attraction of the bodies is done by __matter-js's gravity-attractor__ plugin which helps in these sorts.

### Tetris game: 
This game also works using __HTML CANVAS__ which was ported from the same old java project into java-script really had some hassle making this one. Had to consult AI and later on successfully ported it into this web-playable game, uses similar set of input event listener like-wise of snake game to rotate the bodies. The block's like L, z..etc are generated by rng of numbers linked with those letters.

### PI:
 This game works using simple html, css, js tech-stack. The 1000 digits of PI is just stored in a string already which is counted one by one using for each to get the current digit and the next digits. This type of design was inpired by one of my friends which is really good at programming these sorts. The preview button just overlays an text content that makes it look transparent by matching the display background lol.

### Minesweeper: 
This game works in simple html, css, js tech-stack. The cells of the minesweeper are arranged by grid basis adjusted from js where player select the level and the grid number is laid out by the level data which is stored in an array for simplicity. A container is made in html to store these cells which is later added to fit out (level-based) needs. The bombs are randomly generated using math.random. While the flagging system is just exempt using right click default features and use our own of flagging the selected cell.

### Hangman: 
This game works in simple html, css, js tech-stack. The question, answers box are a different div element on side with the hanging post of hangman. The cells of the answering box area is generated by the breaking the word down and generate cells by how many letters are in the word. The initial loading screen's topic are made using display grid instead of absolute positioning which would be ABSOLUTE tedious. For future use case it was set up that way. The animation of the loading screen for the text is made using SVG text which is flexible for animating these kind of things. Each generated cell is assigned the value of the letters which is shown when the user actually presses the letters included in the answer.

## Setup Instructions
### If you want to locally run this website you can clone this repository into your IDE
For eg. in VS Code
```
git clone https://github.com/Blackoutxo/Playa
```
After cloning, you must have __LIVE SERVER__ extension installed in order to properly use the website. After installing the extension you should press 'Go live' button to then start the website,
and VOILA! you have PLAYA website running right from your desktop.
