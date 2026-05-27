import { NextRequest } from 'next/server';
import { proxy } from './proxy';

describe('auth proxy', () => {
  it('redirects unauthenticated user from /employees to /login', () => {
    const req = new NextRequest('http://localhost:3000/employees');

    const res = proxy(req);

    expect(res?.status).toBe(307);
    expect(res?.headers.get('location')).toContain('/login');
  });
});
