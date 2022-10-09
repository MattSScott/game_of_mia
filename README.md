# The Game of Mia

This is a distributed systems approach to the 'Game of Mia', a drinking game I learned during my time in Denmark. Thank you Rasmus for all of your help, both academic and not :)

## To Launch:

1. Deploy the server by navigating to `mia_server`
   1. Run `npm install` to grab the dependencies. 
   2. Run `node index.js`
2. Launch the client by navigating to `mia_client` 
   1. Run `npm install` to grab the dependencies. 
   2. Run `npm start`

## To Play:

1. Create a room by entering text into the form and pressing `create room`
2. Have others join the room by entering the same string (case sensitive) and pressing `join room`. The room capacity is limited to 4, but this may be made dynamic in the future.
3. Whoever created the room will be the host, and simply has to press `start` to place all room members in a game.

## The Rules:

1. Roll the dice to see if you beat the current best score (a new round has this set to 0 by default)
2. If you beat the score, great! You can either submit this score to the next player, or lie about it and submit a higher score.
3. If you do not beat the score, then you have to lie about it and hope that the next player doesn't catch you!
4. If you think that the previous player has lied, then call. If they did indeed lie, they lose a life, or else you will!
5. Introduce beer at your own risk :)
