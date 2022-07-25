import {expect} from 'chai';
import {ArchaeBacteria} from '../../../src/cards/base/ArchaeBacteria';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('ArchaeBacteria', function() {
  let card : ArchaeBacteria; let player : Player; let game : Game;

  beforeEach(function() {
    card = new ArchaeBacteria();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    (game as any).temperature = -12;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    card.play(player);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
  });
});
