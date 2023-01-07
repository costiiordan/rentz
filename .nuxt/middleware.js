const middleware = {}

middleware['game'] = require('../middleware/game.ts')
middleware['game'] = middleware['game'].default || middleware['game']

middleware['init'] = require('../middleware/init.ts')
middleware['init'] = middleware['init'].default || middleware['init']

middleware['subgame'] = require('../middleware/subgame.ts')
middleware['subgame'] = middleware['subgame'].default || middleware['subgame']

export default middleware
