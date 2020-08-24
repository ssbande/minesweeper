# Minesweeper-SB

A dual player mine sweeper game. 

#### Rules 
* A game cannot be started until 2 players have joined the game. 
* A player cannot make a move until its their own chance. Players chance will come, once the other player has made his move. 
* A flag can be marked with *Right Click* on a cell. Although you cannot alter a flag which is marked by the other player. To distinguish properly, a player will see all their marked flags in *GREEN* and those of the other player's in *RED*

* A Game can be marked over in below conditions: 
  1. One of the player has exited the room, the other player would be a winner 
  2. One of the player clicked on the Bomb cell, the other player would be a winner
  3. All of the flags are utilised ( both players combined ). In this case the player who has more correct bomb locations would be a winner 

###### inspiration: https://hackmd.io/BCEgwE9vSmKUhRgm3L6j9A

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to start up the application

```
* Docker 
* Node JS
```

### Installing

Once you have all the pre-requisites in place, just navigate to the working directory of the app and run the below command

```
npm install 
npm start
```

This will do 4 steps
* Pull latest mongo DB image
* Instantiate a DB instance for us 
* Start the API server at http://localhost:5000
* Start the web server at http://localhost:3000 where you can see the UI

## Running the tests

```
npm run test:server
```

## Server

API server is responsible for all the logic right from creating a mine-field to the time one of the two players have won the game. 

There are 6 endpoints exposed to be utilised
| Name | Method | Endpoint |
| --- | --- | --- |
| Create Game | POST | /api/v1/createGame/**:level** |
| JoinGame | PUT | /api/v1/**:gameId**/join |
| Get Info | GET | /api/v1/**:gameId**/info |
| Get Status | GET | /api/v1/**:gameId**/status |
| Make Move | PUT | /api/v1/**:gameId**/move |
| Remove Player | DELETE | /api/v1/**:gameId**/remove/**:id** |

###### Tech stack: 
Typescript, Express, Jest 

## Client

The players will interact with the client with an underlying communication with APIs behind the scene. I have tried to keep the feel of the game as it was used to be. 

###### Tech stack: 
Typescript, React JS

