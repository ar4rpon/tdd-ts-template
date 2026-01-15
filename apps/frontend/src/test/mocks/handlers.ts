import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' });
  }),

  http.get('/api', () => {
    return HttpResponse.json({ message: 'Hello World!' });
  }),
];
