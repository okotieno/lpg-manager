// import { AuthService } from './services/auth.service';
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addAccessTokenInterceptor: (req: HttpRequest<unknown>, next: HttpHandlerFn) => Observable<HttpEvent<any>>
  = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {

  // const accessToken = inject(AuthService).accessToken();

  // if (accessToken?.length > 0) {
  //   req = req.clone({
  //     headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
  //   });
  // }

  return next(req);
};
