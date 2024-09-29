import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { z, ZodError } from 'zod';
import { zValidator } from '@hono/zod-validator';

import { HTTPException } from 'hono/http-exception';

import usersData from './data.json';
import { wait } from './utils/wait';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

const app = new Hono();

app.use('*', logger(), cors());

app.get(
  '/users',
  zValidator(
    'query',
    z.object({
      email: z.string().email(),
      number: z.string().optional(),
    }),
    (result, c) => {
      if (!result.success) {
        throw new ZodError(result.error.issues);
      }
    }
  ),
  async (c) => {
    await wait(5000);

    const query = c.req.valid('query');

    const filteredUsers = usersData.filter((d) =>
      query.number ? d.email === query.email && d.number === query.number : d.email === query.email
    );

    return c.json(filteredUsers);
  }
);

app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

app.onError((err, c) => {
  console.log('Error', err);

  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  if (err instanceof ZodError) {
    return c.json({ error: err.flatten().fieldErrors }, 500);
  }

  return c.json({ error: err.message }, 500);
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
