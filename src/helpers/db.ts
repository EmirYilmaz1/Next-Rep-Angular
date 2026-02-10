import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";
import { faker } from "@faker-js/faker";

export const db: { connection: Database | null} = {
  connection: null
};

// --- DEFINICIJE TABLICA (Schema) ---

export const roleTableDef = {
  name: 'roles',
  columns: {
    role_id: { type: 'INTEGER', primaryKey: true, autoincrement: true },
    name: { type: 'TEXT', unique: true },
    description: { type: 'TEXT' }
  }
};

export const userTableDef = {
  name: 'users',
  columns: {
    user_id: { type: 'INTEGER', primaryKey: true, autoincrement: true },
    ROLE_role_id: { type: 'INTEGER', notNull: true },
    username: { type: 'TEXT', unique: true, notNull: true },
    email: { type: 'TEXT' },
    name: { type: 'TEXT', notNull: true },
    surname: { type: 'TEXT', notNull: true },
    registrationDate: { type: 'DATE', default: 'CURRENT_TIMESTAMP' },
    userWeightKilograms: { type: 'INTEGER' },
    userHeightCentimeters: { type: 'INTEGER' },
    userDOB: { type: 'DATE' },
    userSEX: { type: 'INTEGER' }
  },
  foreignKeys: [{ column: 'ROLE_role_id', references: 'roles(role_id)' }]
};

export const equipmentTableDef = {
  name: 'equipment',
  columns: {
    equipment_id: { type: 'INTEGER', primaryKey: true, autoincrement: true },
    name: { type: 'TEXT', notNull: true },
    description: { type: 'TEXT', notNull: true },
    alternatives: { type: 'TEXT' }
  }
};

export const workoutTableDef = {
  name: 'workouts',
  columns: {
    workout_id: { type: 'INTEGER', primaryKey: true, autoincrement: true },
    name: { type: 'TEXT', notNull: true },
    description: { type: 'TEXT' },
    type: { type: 'INTEGER' },
    durationMinutes: { type: 'INTEGER' }
  }
};

export const exerciseTableDef = {
  name: 'exercises',
  columns: {
    exercise_id: { type: 'INTEGER', primaryKey: true, autoincrement: true },
    EQUIPMENT_equipment_id: { type: 'INTEGER' },
    MUSCLE_GROUP_id: { type: 'INTEGER', notNull: true },
    name: { type: 'TEXT', notNull: true },
    description: { type: 'TEXT' }
  },
  foreignKeys: [
    { column: 'EQUIPMENT_equipment_id', references: 'equipment(equipment_id)' },
    { column: 'MUSCLE_GROUP_id', references: 'muscle_groups(group_id)' }
  ]
};

export const workoutExerciseTableDef = {
  name: 'workout_exercises',
  columns: {
    workout_id: { type: 'INTEGER', notNull: true },
    exercise_id: { type: 'INTEGER', notNull: true },
    sequence_order: { type: 'INTEGER', notNull: true },
    plannedSets: { type: 'INTEGER' },
    plannedReps: { type: 'INTEGER' },
    plannedWeight: { type: 'INTEGER' }
  },
  primaryKey: ['workout_id', 'exercise_id'],
  foreignKeys: [
    { column: 'workout_id', references: 'workouts(workout_id)' },
    { column: 'exercise_id', references: 'exercises(exercise_id)' }
  ]
};

export const workoutHistoryTableDef = {
  name: 'workout_history',
  columns: {
    history_id: { type: 'INTEGER', primaryKey: true, autoincrement: true },
    USER_user_id: { type: 'INTEGER', notNull: true },
    WORKOUT_workout_id: { type: 'INTEGER', notNull: true },
    date: { type: 'DATETIME', notNull: true },
    durationMinutes: { type: 'INTEGER' },
    notes: { type: 'TEXT' }
  },
  foreignKeys: [
    { column: 'USER_user_id', references: 'users(user_id)' },
    { column: 'WORKOUT_workout_id', references: 'workouts(workout_id)' }
  ]
};

export const exerciseLogTableDef = {
  name: 'exercise_log',
  columns: {
    log_id: { type: 'INTEGER', primaryKey: true, autoincrement: true },
    WORKOUT_HISTORY_history_id: { type: 'INTEGER', notNull: true },
    EXERCISE_exercise_id: { type: 'INTEGER', notNull: true },
    set_number: { type: 'INTEGER', notNull: true },
    weight: { type: 'INTEGER' },
    reps: { type: 'INTEGER' }
  },
  foreignKeys: [
    { column: 'WORKOUT_HISTORY_history_id', references: 'workout_history(history_id)' },
    { column: 'EXERCISE_exercise_id', references: 'exercises(exercise_id)' }
  ]
};

export const muscleGroupTableDef = {
  name: 'muscle_groups',
  columns: {
    group_id: { type: 'INTEGER', primaryKey: true, autoincrement: true },
    name: { type: 'TEXT', notNull: true, unique: true }
  }
};

// --- HELPER FUNKCIJE ---

function createTableStatement(def: any): string {
  const cols = Object.entries(def.columns).map(([name, opts]: [string, any]) => {
    let colDef = `${name} ${opts.type}`;
    if (opts.primaryKey) colDef += ' PRIMARY KEY';
    if (opts.autoincrement) colDef += ' AUTOINCREMENT';
    if (opts.notNull) colDef += ' NOT NULL';
    if (opts.unique) colDef += ' UNIQUE';
    if (opts.default !== undefined) colDef += ` DEFAULT ${opts.default}`;
    return colDef;
  });    
  if(def.primaryKey) {
    cols.push(`PRIMARY KEY (${def.primaryKey.join(', ')})`);
  }
  if(def.foreignKeys) {
    def.foreignKeys.forEach((fk: any) => {
      cols.push(`FOREIGN KEY (${fk.column}) REFERENCES ${fk.references}`);
    });
  }
  return `CREATE TABLE IF NOT EXISTS ${def.name} (\n ${cols.join(',\n ')} \n);`;
}

// --- GLAVNA INITIALIZACIJA ---

export async function openDb(): Promise<void> {
  // Pazi: Koristi mapu db ako postoji, inače root
  db.connection = await open({
    filename: process.env.DBFILE || './db/data.sqlite3',
    driver: sqlite3.Database
  });
  
  const { user_version } = await db.connection.get('PRAGMA user_version;') 
  
  if(!user_version) { 
    console.log('⚡ Initializing new database...');
    await db.connection!.exec('PRAGMA user_version = 1;');
    await createSchemaAndData();
  } else {
    console.log('Database already exists (version ' + user_version + ')');
  }
  
  await db.connection.exec('PRAGMA foreign_keys = ON'); 
}

export async function createSchemaAndData(): Promise<void> {
  // 1. Kreiranje tablica
  const tables = [
    roleTableDef, userTableDef, equipmentTableDef, muscleGroupTableDef,
    workoutTableDef, exerciseTableDef, workoutExerciseTableDef,
    workoutHistoryTableDef, exerciseLogTableDef
  ];

  for (const t of tables) {
    await db.connection!.run(createTableStatement(t));
  }
  console.log('✅ All tables created.');

  // 2. Roles
  const defaultRoles = [
    [0, 'Admin', 'Full system access'],
    [1, 'Management', 'Manage workouts/exercises'],
    [2, 'Regular', 'Basic user access'],
    [3, 'Premium', 'Advanced features']
  ];
  for (let role of defaultRoles) {
    await db.connection!.run(
      'INSERT OR IGNORE INTO roles (role_id, name, description) VALUES (?, ?, ?)',
      ...role
    );
  }

  // 3. Muscle Groups (Fixno 6)
  const muscleGroupsList = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
  for (const groupName of muscleGroupsList) {
    await db.connection!.run('INSERT OR IGNORE INTO muscle_groups (name) VALUES (?)', groupName);
  }

  // 4. Equipment (Fixno 5)
  const equipmentList = [
    ['Dumbbell', 'Short bar weights', 'Kettlebell'],
    ['Barbell', 'Long bar', 'Dumbbell'],
    ['Bench', 'Flat bench', 'Floor'],
    ['Pull-up Bar', 'Chin up bar', 'Tree'],
    ['Cable Machine', 'Pulleys', 'Bands']
  ];
  for (const item of equipmentList) {
    await db.connection!.run(
      'INSERT OR IGNORE INTO equipment (name, description, alternatives) VALUES (?, ?, ?)',
      item[0], item[1], item[2]
    );
  }

  // 5. Exercises (Smanjeno na 7 bitnih)
  const exercisesData = [
    ['Bench Press', 'Chest', 'Barbell'],
    ['Squat', 'Legs', 'Barbell'],
    ['Deadlift', 'Back', 'Barbell'],
    ['Pull-up', 'Back', 'Pull-up Bar'],
    ['Dumbbell Curls', 'Arms', 'Dumbbell'],
    ['Shoulder Press', 'Shoulders', 'Dumbbell'],
    ['Plank', 'Core', 'Bench'] // ili bez opreme
  ];
  
  for (const ex of exercisesData) {
     // Nađi ID-eve
     const grp = await db.connection!.get('SELECT group_id FROM muscle_groups WHERE name = ?', ex[1]);
     const eq = await db.connection!.get('SELECT equipment_id FROM equipment WHERE name = ?', ex[2]);
     
     await db.connection!.run(
      `INSERT INTO exercises (EQUIPMENT_equipment_id, MUSCLE_GROUP_id, name, description) VALUES (?, ?, ?, ?)`,
      eq?.equipment_id || null, grp?.group_id, ex[0], faker.lorem.sentence()
     );
  }
  console.log('✅ 7 Basic Exercises created');

  // 6. Workouts (Smanjeno na 4 bitna)
  const workoutsData = ['Full Body A', 'Full Body B', 'Upper Body', 'Lower Body'];
  for (let i = 0; i < workoutsData.length; i++) {
    await db.connection!.run(
      `INSERT INTO workouts (name, description, type, durationMinutes) VALUES (?, ?, ?, ?)`,
      workoutsData[i], 'Standard routine', 1, 60
    );
  }
  
  // Linkaj vježbe u treninge (random ali validno)
  const workoutIds = (await db.connection!.all('SELECT workout_id FROM workouts')).map(r => r.workout_id);
  const exerciseIds = (await db.connection!.all('SELECT exercise_id FROM exercises')).map(r => r.exercise_id);
  
  for (const wId of workoutIds) {
    const shuffled = exerciseIds.sort(() => 0.5 - Math.random()).slice(0, 4); // Svaki trening 4 vježbe
    let order = 1;
    for (const exId of shuffled) {
       await db.connection!.run(
        `INSERT INTO workout_exercises (workout_id, exercise_id, sequence_order, plannedSets, plannedReps, plannedWeight) VALUES (?, ?, ?, ?, ?, ?)`,
        wId, exId, order++, 3, 10, 50
       );
    }
  }

  // 7. Users (Samo 10 fake usera + glavni profili će se kreirati kroz createAppUserProfile iz index.ts)
  // Ovdje kreiramo samo extra random usere ako treba
  for (let i = 0; i < 5; i++) {
     await createAppUserProfile(faker.internet.username(), faker.person.firstName(), faker.person.lastName(), 2);
  }

  console.log('✅ Base data ready. Waiting for main profiles to seed history...');
}

// Ova funkcija se poziva iz index.ts za kreiranje glavnih profila (admin, user, premium...)
// OVDJE dodajemo i povijest treninga njima!
export async function createAppUserProfile(username: string, name: string, surname: string, role_id: number = 2): Promise<void> {
    // 1. Kreiraj/Nađi Usera
    try {
        await db.connection!.run(
          `INSERT INTO users (ROLE_role_id, username, name, surname) VALUES (?, ?, ?, ?)`,
          role_id, username, name, surname
        );
    } catch(e) { 
        // User already exists, ignore
        return; 
    }

    // 2. Ako je to jedan od naših testnih korisnika, generiraj mu bogatu povijest!
    const targetUsers = ['user', 'premium', 'admin', 'management'];
    if (targetUsers.includes(username)) {
        const user = await db.connection!.get('SELECT user_id FROM users WHERE username = ?', username);
        const workoutIds = (await db.connection!.all('SELECT workout_id FROM workouts')).map(r => r.workout_id);
        
        console.log(`⚡ Generating 20 workouts for ${username}...`);

        // Generiraj 20 treninga unazad 30 dana
        for (let i = 0; i < 20; i++) {
             const daysAgo = Math.floor(Math.random() * 30); // 0 do 30 dana unazad
             const wId = workoutIds[Math.floor(Math.random() * workoutIds.length)];
             
             // Insert History
             const res = await db.connection!.run(
                 `INSERT INTO workout_history (USER_user_id, WORKOUT_workout_id, date, durationMinutes, notes) 
                  VALUES (?, ?, date('now', ?), ?, ?)`,
                 user.user_id, wId, `-${daysAgo} days`, 45 + Math.random()*30, 'Auto generated log'
             );
             
             // Insert Logs (za taj history)
             // Dohvati vježbe tog treninga
             const exercises = await db.connection!.all('SELECT exercise_id FROM workout_exercises WHERE workout_id = ?', wId);
             
             for (const ex of exercises) {
                 await db.connection!.run(
                     `INSERT INTO exercise_log (WORKOUT_HISTORY_history_id, EXERCISE_exercise_id, set_number, weight, reps)
                      VALUES (?, ?, ?, ?, ?)`,
                     res.lastID, ex.exercise_id, 1, 60, 10
                 );
             }
        }
    }
}
