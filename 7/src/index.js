import { SeaBattleGame } from "./game/SeaBattleGame.js";

const game = new SeaBattleGame();
game.start().catch(console.error);
