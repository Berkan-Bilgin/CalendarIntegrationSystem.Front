import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService } from '../browser/services/local-storage.service';

// HttpInterceptorFn: Angular tarafında HTTP isteklerini dinleyen ve araya giren bir yapıdır.

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // req: HTTP isteği
  // next: Sonraki adım

  const localStorageService = inject(LocalStorageService);

  let headers = req.headers.set(
    'Authorization',
    `Bearer ${localStorageService.get('token')}`,
  );

  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    headers = headers.set('Content-Type', 'application/json');
  }

  const newReq = req.clone({ headers });

  return next(newReq);
};
