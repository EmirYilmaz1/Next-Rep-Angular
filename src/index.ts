//1=M 0=A 2=R 3=P
import express from 'express';  
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
//import cors from 'cors';

import { config } from 'dotenv';

import { APP_VERSION } from './shared/version';
import { errorHandler } from './helpers/errors';
import { openDb as openSysDb } from './helpers/sysdb';
import { openDb, createAppUserProfile } from './helpers/db';
import { authRouter, initAuth } from './helpers/auth';
import { uploadRouter } from './helpers/fileupload';
import { usersRouter } from './api/users';
import { equipmentRouter } from './api/equipments';
import { exercisesRouter } from './api/exercises';
import { workoutsRouter } from './api/workouts';
import { historyRouter } from './api/history';
import { muscleGroupsRouter } from './api/muscle-groups';
import { analyticsRouter } from './api/analytics';

config({ quiet: true });

const app = express();

const apiUrl = process.env.APIURL || '/api';

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = ['http://localhost:4200', 'http://localhost:3000'];
  
  if (allowedOrigins.includes(origin || '')) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');
  res.header('Access-Control-Expose-Headers', 'set-cookie');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,      //15 minutes
  limit: 300,                    
  standardHeaders: 'draft-8',
  legacyHeaders: false
});
app.use(globalLimiter);


const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: {
    code: 429,
    message: 'Too many API requests. Please try again later.'
  },
  standardHeaders: 'draft-8',
  legacyHeaders: false
});
app.use(apiUrl, apiLimiter);


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: {
    code: 429,
    message: 'Too many login attempts. Please try again later.'
  },
  standardHeaders: 'draft-8',
  legacyHeaders: false
});
app.use('/api/auth', authLimiter);


// log http requests
app.use(morgan(process.env.MORGANTYPE || 'tiny'));

// static files (angular app)
const frontendPath = process.env.FRONTEND || './frontend/dist/frontend/browser';
app.use(express.static(frontendPath));

// static uploaded files
app.use('/uploads', express.static(process.env.UPLOADSDIR || './uploads'));

// automatic parsing of json payloads
app.use(express.json());

async function main() {
  await openSysDb();
  console.log('System database connected');

  await initAuth(app);
  console.log('Initialize authorization framework');

  await openDb();
  console.log('Main database connected');
  
  // auth router
  app.use('/api/auth', authRouter);
  
  // file upload router
  app.use(apiUrl + '/upload', uploadRouter);

  // import and install api routers //HTPP CALLS
  app.use(apiUrl + '/users', usersRouter);
  app.use(apiUrl + '/equipment', equipmentRouter);
  app.use(apiUrl + '/exercises', exercisesRouter);
  app.use(apiUrl + '/workouts', workoutsRouter);
  app.use(apiUrl + '/history', historyRouter);
  app.use(apiUrl + '/muscle-groups', muscleGroupsRouter);
  app.use(apiUrl + '/analytics', analyticsRouter);
  

  // install our error handler (must be the last app.use)
  app.use(errorHandler);

  console.log("Seeding user profiles...");
    
    const profiles = [
      { u: 'admin', n: 'Admin', s: 'System' },
      { u: 'management', n: 'Big', s: 'Boss' },
      { u: 'user', n: 'John', s: 'Doe' },
      { u: 'premium', n: 'Arnold', s: 'Schwarzenegger' }
    ];

    for (const p of profiles) {
      try {
        await createAppUserProfile(p.u, p.n, p.s);
      } catch (e) {
      }
    }
    console.log("Profiles checks complete.");

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(path.resolve(frontendPath), 'index.html'));
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

console.log(`Backend ${APP_VERSION} is starting...`);
main().catch(err => {
  console.error('ERROR startup failed due to', err);
})