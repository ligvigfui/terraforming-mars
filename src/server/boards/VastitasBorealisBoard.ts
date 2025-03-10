import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {SpaceName} from '../SpaceName';
import {Board} from './Board';
import {IPlayer} from '../IPlayer';
import {Space} from './Space';
import {BoardBuilder} from './BoardBuilder';
import {SerializedBoard} from './SerializedBoard';
import {Random} from '../../common/utils/Random';
import {GameOptions} from '../game/GameOptions';
import {SpaceType} from '../../common/boards/SpaceType';
import {VASTITAS_BOREALIS_BONUS_TEMPERATURE_COST} from '../../common/constants';
import {SpaceId} from '../../common/Types';
import {MarsBoard} from './MarsBoard';

export class VastitasBorealisBoard extends MarsBoard {
  public static newInstance(gameOptions: GameOptions, rng: Random): VastitasBorealisBoard {
    const builder = new BoardBuilder(gameOptions.venusNextExtension, gameOptions.pathfindersExpansion);

    const PLANT = SpaceBonus.PLANT;
    const STEEL = SpaceBonus.STEEL;
    const DRAW_CARD = SpaceBonus.DRAW_CARD;
    const HEAT = SpaceBonus.HEAT;
    const TITANIUM = SpaceBonus.TITANIUM;
    const TEMPERATURE = SpaceBonus.TEMPERATURE;

    // y=0
    builder.land(STEEL, STEEL).land(PLANT).land().land().land(TITANIUM, TITANIUM);
    // y=1
    builder.land(STEEL, STEEL).land(STEEL).land().land().land(TITANIUM).land(PLANT);
    // y=2
    builder.land(TITANIUM).land().land().land().land(DRAW_CARD).ocean(PLANT, DRAW_CARD).ocean(PLANT);
    // y=3
    builder.land(STEEL, TITANIUM).land(STEEL, DRAW_CARD).land(STEEL).ocean(HEAT, HEAT).ocean(HEAT, HEAT).ocean().ocean(PLANT, PLANT).land(STEEL, PLANT);
    // y=4
    builder.land().land().land().ocean(HEAT, HEAT).land(TEMPERATURE).doNotShuffleLastSpace().land(STEEL).land().land(PLANT).ocean(TITANIUM);
    // y=5
    builder.land(PLANT).land().land(PLANT).ocean(HEAT, HEAT).land(HEAT, HEAT).land().land(PLANT).land(TITANIUM, PLANT);
    // y=6
    builder.land(PLANT, PLANT).land().ocean().land().land(STEEL, PLANT).land(PLANT).land(PLANT, PLANT);
    // y=7
    builder.ocean(PLANT).land().land(DRAW_CARD).land(STEEL).land().land(PLANT, PLANT);
    // y=8
    builder.ocean(PLANT, PLANT).land().land(PLANT).land(PLANT, PLANT).land(STEEL, PLANT);

    if (gameOptions.shuffleMapOption) {
      builder.shuffle(rng);
    }

    const spaces = builder.build();
    return new VastitasBorealisBoard(spaces);
  }

  public static deserialize(board: SerializedBoard, players: Array<IPlayer>): VastitasBorealisBoard {
    return new VastitasBorealisBoard(Board.deserializeSpaces(board.spaces, players));
  }

  private filterVastitasBorealis(player: IPlayer, spaces: ReadonlyArray<Space>) {
    return player.canAfford(VASTITAS_BOREALIS_BONUS_TEMPERATURE_COST, {tr: {temperature: 1}}) ? spaces : spaces.filter((space) => space.id !== SpaceName.VASTITAS_BOREALIS_NORTH_POLE);
  }

  public override getSpaces(spaceType: SpaceType, player: IPlayer): ReadonlyArray<Space> {
    return this.filterVastitasBorealis(player, super.getSpaces(spaceType, player));
  }

  public override getAvailableSpacesForCity(player: IPlayer): ReadonlyArray<Space> {
    return this.filterVastitasBorealis(player, super.getAvailableSpacesForCity(player));
  }

  public override getAvailableSpacesOnLand(player: IPlayer): ReadonlyArray<Space> {
    return this.filterVastitasBorealis(player, super.getAvailableSpacesOnLand(player));
  }

  public override getAvailableSpacesForGreenery(player: IPlayer): ReadonlyArray<Space> {
    return this.filterVastitasBorealis(player, super.getAvailableSpacesForGreenery(player));
  }

  public override getVolcanicSpaceIds(): Array<SpaceId> {
    return [
      SpaceName.ELYSIUM_MONS_VASTITAS_BOREALIS,
      SpaceName.ALBA_FOSSAE,
      SpaceName.CERANIUS_FOSSAE,
      SpaceName.ALBA_MONS,
    ];
  }
}
