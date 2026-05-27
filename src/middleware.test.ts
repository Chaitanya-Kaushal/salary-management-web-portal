import { NextRequest } from 'next/server';
import { middleware } from './middleware';

describe('auth middleware', () => {
  it('redirects unauthenticated user from /employees to /login', () => {
    const req = new NextRequest('http://localhost:3000/employees');

    const res = middleware(req);

    expect(res?.status).toBe(307);
    expect(res?.headers.get('location')).toContain('/login');
  });
});
