import { Cameras, GameObjects, Scene, Tilemaps } from 'phaser';
import { Player } from '../Player';
import { GridPhysics } from '../utils/GridPhysics';
import { GridControls } from '../utils/GridControls';
import { Direction } from '../utils/Direction';

export class Game extends Scene {
  declare camera: Cameras.Scene2D.Camera;
  declare background: GameObjects.Image;
  declare msg_text: GameObjects.Text;
  declare map: Tilemaps.Tilemap;
  declare controls: Cameras.Controls.FixedKeyControl;
  declare gridPhysics: GridPhysics;
  declare gridControls: GridControls;

  constructor() {
    super('Game');
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x000000);

    // this.background = this.add.image(512, 384, 'background');
    // this.background.setAlpha(0.5);

    // Debug tile image
    // this.add.image(0, 0, 'tiles');

    const map = this.make.tilemap({
      key: 'tiled-map',
    });
    const tileset = map.addTilesetImage('Paint Tiles Demo', 'tiles');

    if (tileset) {
      const layer = map.createLayer(
        'Paint Layer 1/Tile Layer 1',
        tileset,
        -10,
        10,
      );

      if (layer) {
        layer.scale = 0.6;
        layer.setCollisionByProperty({ collides: true });
        layer.setDepth(1);

        // Debug layer, doesn't work?
        // const debugGraphics = this.add.graphics().setAlpha(0.75);
        // layer.renderDebug(debugGraphics, {
        //   tileColor: null, // Color of non-colliding tiles
        //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
        // });
      }
    }

    // Phaser supports multiple cameras, but you can access the default camera like this:
    const camera = this.cameras.main;

    camera.setZoom(1.5);

    // Set up the arrows to control the camera
    const cursors = this.input.keyboard?.createCursorKeys();

    if (cursors) {
      // this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
      //   camera: camera,
      //   left: cursors.left,
      //   right: cursors.right,
      //   up: cursors.up,
      //   down: cursors.down,
      //   speed: 0.5,
      // });

      // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
      camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

      const playerSprite = this.add.sprite(0, 0, 'player');
      playerSprite.setDepth(2);
      playerSprite.scale = 3;
      camera.startFollow(playerSprite);
      camera.roundPixels = true;
      const player = new Player(playerSprite, new Phaser.Math.Vector2(6, 6));

      this.gridPhysics = new GridPhysics(player, map);
      this.gridControls = new GridControls(this.input, this.gridPhysics);

      this.createPlayerAnimation(Direction.UP, 90, 92);
      this.createPlayerAnimation(Direction.RIGHT, 78, 80);
      this.createPlayerAnimation(Direction.DOWN, 54, 56);
      this.createPlayerAnimation(Direction.LEFT, 66, 68);
    }

    this.msg_text = this.add.text(
      512,
      384,
      'Make something fun!\nand share it with us:\nsupport@phaser.io',
      {
        fontFamily: 'Arial Black',
        fontSize: 38,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center',
      },
    );
    this.msg_text.setOrigin(0.5);

    // this.input.once('pointerdown', () => {
    //   this.scene.start('GameOver');
    // });
  }

  update(time: any, delta: number) {
    // Apply the controls to the camera each update tick of the game
    // this.controls.update(delta);
    this.gridControls.update();
    this.gridPhysics.update(delta);
  }

  private createPlayerAnimation(
    name: string,
    startFrame: number,
    endFrame: number,
  ) {
    this.anims.create({
      key: name,
      frames: this.anims.generateFrameNumbers('player', {
        start: startFrame,
        end: endFrame,
      }),
      frameRate: 10,
      repeat: -1,
      yoyo: true,
    });
  }
}
