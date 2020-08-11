# Project Title

A dual player mine sweeper game. 

#### Rules 
* A game cannot be started until 2 players have joined the game. 
* A player cannot make a move until its their own chance. Players chance will come, once the other player has made his move. 
* A flag can be marked with *Right Click* on a cell. Although you cannot alter a flag which is marked by the other player. To distinguish properly, a player will see all their marked flags in *RED* and those of the other player's in *BLACK*

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

###### Next Plans: 
* Add a custom level where create API can take input of number of rows and columns
* Refactor code to have Validators and Decorators implemented on the methods 
* Pull out the interface / Types / Enums to a common place so that both the API and Web APP can refer to the same place.
* To send the response in a JWT format which can then further be decided with a public key


###### Issues faced: 
* While writing tests, mongo save document mocking was not working. Thus have skipped tests along those for future fixes
 
## Client

The players will interact with the client with an underlying communication with APIs behind the scene. I have tried to keep the feel of the game as it was used to be. 

###### Tech stack: 
Typescript, React JS

###### UI Limitations: 
* Works only for Beginner Level i.e 9x9. Although API is made to handle all the combinations. 
* Client must not be refreshed while the game is in progress, else either it will connect itself to the game or a new game would be started
* Client is tested on Chrome browser as of now. 

###### Next Plans
* Ask the user to enter their name, rather than naming them as Player 1 and Player 2
* Make the client capable to handle intermediate/ expert levels of the game 
* Push notifications to 2nd player when 1st player has made the move, and vice versa

## Timelines 

There were multiple places which took longer to implement than others. Below is the break up of the whole application on time basis 
* Server setup - 0.5 Hours
* MongoDB schema design - 0.5 Hours
* Server logic Implementation - 2.5 Hours
* Server testing - 1.5 Hours
* Web app setup - 0.5 Hours
* Web app broadcast logic - 1 Hour
* Web app flow implementation - 1 Hour
* Web app styling - 1 Hour

