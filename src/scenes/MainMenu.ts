import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene {
  declare background: GameObjects.Image;
  declare logo: GameObjects.Image;
  declare title: GameObjects.Text;

  constructor() {
    super('MainMenu');
  }

  create() {
    this.background = this.add.image(384, 384, 'background');

    this.logo = this.add.image(370, 300, 'logo');

    this.title = this.add
      .text(370, 460, 'Main Menu', {
        fontFamily: 'Arial Black',
        fontSize: 38,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center',
      })
      .setOrigin(0.5);

    this.input.once('pointerdown', () => {
      this.scene.start('Game');
    });
  }
}
