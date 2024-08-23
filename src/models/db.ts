import Dexie, { Table } from 'dexie';
import { Routine } from './Routine';


export class RoutineClass extends Dexie {
  routines!: Table<Routine>

  constructor() {
    super('testRoutineTest');
    this.version(1).stores({
      routines: '++id, content, done',
    });
  }
}

export const db = new RoutineClass();