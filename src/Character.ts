import Archetype, { Mage } from './Archetypes';
import Energy from './Energy';
import Fighter, { SimpleFighter } from './Fighter';
import Race, { Elf } from './Races';
import getRandomInt from './utils';

export default class Character implements Fighter {
  private _race: Race;
  private _archetype: Archetype;
  private _maxLifePoints: number;
  private _lifePoints: number;
  private _strength: number;
  private _defense: number;
  private _dexterity: number;
  private _energy: Energy;

  constructor(private _name: string) {
    this._dexterity = getRandomInt(1, 10);
    this._race = new Elf(_name, this._dexterity);
    this._archetype = new Mage(_name);
    this._maxLifePoints = (this._race.maxLifePoints / 2);
    this._lifePoints = this._maxLifePoints;
    this._strength = getRandomInt(1, 10);
    this._defense = getRandomInt(1, 10);
    this._energy = {
      type_: this._archetype.energyType,
      amount: getRandomInt(1, 10),
    };
  }

  public get race(): Race { return this._race; }

  public get archetype(): Archetype { return this._archetype; }

  public get lifePoints(): number { return this._lifePoints; }
  
  public get strength(): number { return this._strength; }
  
  public get defense(): number { return this._defense; }
  
  public get dexterity(): number { return this._dexterity; }

  public get energy(): Energy { return { ...this._energy }; }
  
  receiveDamage(attackPoints: number): number {
    const damage = attackPoints - this._defense;
    if (damage > 0) this._lifePoints -= damage;
    if (this._lifePoints <= 0) this._lifePoints = -1;
    return this._lifePoints;
  }

  attack(enemy: Fighter | SimpleFighter): void {
    enemy.receiveDamage(this._strength);
  }

  levelUp(): void {
    this._maxLifePoints += getRandomInt(1, 10);
    this._strength += getRandomInt(1, 10);
    this._dexterity += getRandomInt(1, 10);
    this._defense += getRandomInt(1, 10);
    this._energy.amount = 10;

    if (this._maxLifePoints > this.race.maxLifePoints) {
      this._maxLifePoints = this.race.maxLifePoints;
    }

    this._lifePoints = this._maxLifePoints;
  }

  special(enemy: Fighter): void {
    switch (getRandomInt(1, 4)) {
      case 1:
        console.log('Roubo de vida com dano');
        enemy.receiveDamage((this._strength * 3));
        this._lifePoints += (this._strength * 3);
        break;
      case 2:
        console.log('Subir de nível');
        this.levelUp();
        break;
      case 3:
        console.log('Ataque final');
        enemy.receiveDamage((this._strength * 999));
        break;
      default:
        console.log('Você contra golpeou? IMPOSSIVEL!');
        this._lifePoints -= (this._strength * 3);
    }
  }
}