import { Injectable } from '@nestjs/common';

@Injectable()
export class SimpleStringHasherService {
  private readonly seedRound1: number = 42;
  private readonly seedRound2: number = 31;
  private readonly seedRound3: number = 12;
  private readonly allowedChars: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  private computeLiteHash(value: string, seed: number): string {
    let hash = '';
    for (let i = 0; i < value.length; i++) {
      const charCode = value.charCodeAt(i);
      const modifiedCharCode = (charCode * seed + i) % this.allowedChars.length;
      hash += this.allowedChars[modifiedCharCode];
    }
    return hash.substring(0, 16);
  }

  /**
   * The main purpose of SimpleStringHasherService is to provide a simple low-compute hash, primarily used
   * for standard email user email confimation so that it is unecessary to store 1 time use hash value in the database.
   * 
   * @param stringInput - most likely email address of user confirming registration of standard login
   * @returns 
   */
  public generateHash(stringInput: string): string {
    let returnString: string = '';

    // add three iterations of simplehash with different seeds for length and some variety of seemingly randomness
    returnString += this.computeLiteHash(stringInput, this.seedRound1);
    returnString += this.computeLiteHash(stringInput, this.seedRound2);
    returnString += this.computeLiteHash(stringInput, this.seedRound3);

    return returnString;
  }
}
