import { Direction } from './Direction';
import { Player, TILE_SIZE } from '../Player';

const Vector2 = Phaser.Math.Vector2;
type Vector2 = Phaser.Math.Vector2;

export class GridPhysics {
  private movementDirectionVectors: {
    [key in Direction]?: Vector2;
  } = {
    [Direction.UP]: Vector2.UP,
    [Direction.DOWN]: Vector2.DOWN,
    [Direction.LEFT]: Vector2.LEFT,
    [Direction.RIGHT]: Vector2.RIGHT,
  };

  private movementDirection: Direction = Direction.NONE;

  private readonly speedPixelsPerSecond: number = TILE_SIZE * 4;
  private tileSizePixelsWalked: number = 0;

  private lastMovementIntent = Direction.NONE;

  constructor(
    private player: Player,
    private tileMap: Phaser.Tilemaps.Tilemap,
  ) {}

  movePlayer(direction: Direction): void {
    this.movementDirection = direction;
    if (this.isMoving()) return;
    if (this.isBlockingDirection(direction)) {
      this.player.stopAnimation(direction);
    } else {
      this.startMoving(direction);
    }
  }

  update(delta: number) {
    if (this.isMoving()) {
      this.updatePlayerPosition(delta);
    }
    this.lastMovementIntent = Direction.NONE;
  }

  private isMoving(): boolean {
    return this.movementDirection != Direction.NONE;
  }

  private startMoving(direction: Direction): void {
    this.player.startAnimation(direction);
    this.movementDirection = direction;
    this.updatePlayerTilePos();
  }

  private updatePlayerPosition(delta: number) {
    const pixelsToWalkThisUpdate = this.getPixelsToWalkThisUpdate(delta);

    if (!this.willCrossTileBorderThisUpdate(pixelsToWalkThisUpdate)) {
      this.movePlayerSprite(pixelsToWalkThisUpdate);
    } else if (this.shouldContinueMoving()) {
      this.movePlayerSprite(pixelsToWalkThisUpdate);
      this.updatePlayerTilePos();
    } else {
      this.movePlayerSprite(TILE_SIZE - this.tileSizePixelsWalked);
      this.stopMoving();
    }
  }

  private updatePlayerTilePos() {
    this.player.setTilePos(
      this.player
        .getTilePos()
        .add(this.movementDirectionVectors[this.movementDirection] as any),
    );
  }

  private movePlayerSprite(pixelsToMove: number) {
    const directionVec = (
      this.movementDirectionVectors[this.movementDirection] as any
    ).clone();
    const movementDistance = directionVec.multiply(new Vector2(pixelsToMove));
    const newPlayerPos = this.player.getPosition().add(movementDistance);
    this.player.setPosition(newPlayerPos);

    this.tileSizePixelsWalked += pixelsToMove;
    this.tileSizePixelsWalked %= TILE_SIZE;
  }

  private getPixelsToWalkThisUpdate(delta: number): number {
    const deltaInSeconds = delta / 1000;
    return this.speedPixelsPerSecond * deltaInSeconds;
  }

  private stopMoving(): void {
    this.player.stopAnimation(this.movementDirection);
    this.movementDirection = Direction.NONE;
  }

  private willCrossTileBorderThisUpdate(
    pixelsToWalkThisUpdate: number,
  ): boolean {
    return this.tileSizePixelsWalked + pixelsToWalkThisUpdate >= TILE_SIZE;
  }

  private shouldContinueMoving(): boolean {
    return (
      // this.movementDirection == this.lastMovementIntent &&
      !this.isBlockingDirection(this.movementDirection)
    );
  }

  private isBlockingDirection(direction: Direction): boolean {
    return this.hasBlockingTile(this.tilePosInDirection(direction));
  }

  private tilePosInDirection(direction: Direction): Vector2 {
    return this.player
      .getTilePos()
      .add(this.movementDirectionVectors[direction] as any);
  }

  private hasBlockingTile(pos: Vector2): boolean {
    if (this.hasNoTile(pos)) return true;
    return this.tileMap.layers.some((layer) => {
      const tile = this.tileMap.getTileAt(pos.x, pos.y, false, layer.name);
      return tile && tile.properties.collides;
    });
  }

  private hasNoTile(pos: Vector2): boolean {
    return !this.tileMap.layers.some((layer) =>
      this.tileMap.hasTileAt(pos.x, pos.y, layer.name),
    );
  }
}
