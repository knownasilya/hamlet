import { Cameras, GameObjects, Scene, Tilemaps } from 'phaser';

export class Game extends Scene {
  declare camera: Cameras.Scene2D.Camera;
  declare background: GameObjects.Image;
  declare msg_text: GameObjects.Text;
  declare map: Tilemaps.Tilemap;

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
      key: 'level1',
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
      }
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
}
