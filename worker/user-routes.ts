import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, RequestEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { PettyCashRequest, RequestStatus } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Ensure data is seeded on first request
  app.use('/api/*', async (c, next) => {
    await Promise.all([
      UserEntity.ensureSeed(c.env),
      RequestEntity.ensureSeed(c.env),
    ]);
    await next();
  });
  // --- USER ROUTES ---
  app.get('/api/users', async (c) => {
    const page = await UserEntity.list(c.env);
    return ok(c, page.items);
  });
  // --- REQUEST ROUTES ---
  app.get('/api/requests', async (c) => {
    const page = await RequestEntity.list(c.env);
    return ok(c, page.items);
  });
  app.post('/api/requests', async (c) => {
    const body = await c.req.json<Omit<PettyCashRequest, 'id' | 'history' | 'createdAt' | 'updatedAt' | 'status'>>();
    if (!isStr(body.requesterId) || !body.amount || !isStr(body.reason)) {
      return bad(c, 'requesterId, amount, and reason are required');
    }
    const requester = new UserEntity(c.env, body.requesterId);
    if (!(await requester.exists())) {
        return notFound(c, 'Requester not found');
    }
    const requesterData = await requester.getState();
    const now = new Date().toISOString();
    const newRequest: PettyCashRequest = {
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      history: [{
        status: 'pending',
        timestamp: now,
        updatedBy: requesterData.name,
      }],
      ...body,
    };
    const created = await RequestEntity.create(c.env, newRequest);
    return ok(c, created);
  });
  app.put('/api/requests/:id/status', async (c) => {
    const { id } = c.req.param();
    const { status, updatedById } = await c.req.json<{ status: RequestStatus, updatedById: string }>();
    if (!status || !updatedById) {
      return bad(c, 'status and updatedById are required');
    }
    const requestEntity = new RequestEntity(c.env, id);
    if (!(await requestEntity.exists())) {
      return notFound(c, 'Request not found');
    }
    const updater = new UserEntity(c.env, updatedById);
     if (!(await updater.exists())) {
        return notFound(c, 'User performing update not found');
    }
    const updaterData = await updater.getState();
    const updatedRequest = await requestEntity.mutate(req => {
      const now = new Date().toISOString();
      return {
        ...req,
        status,
        updatedAt: now,
        history: [...req.history, { status, timestamp: now, updatedBy: updaterData.name }],
      };
    });
    return ok(c, updatedRequest);
  });
}