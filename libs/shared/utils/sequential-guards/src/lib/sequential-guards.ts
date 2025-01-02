import { inject, Injector, runInInjectionContext } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { concatMap, from, last, Observable, of, takeWhile } from 'rxjs';

export function runGuardsInOrder(...guards: CanActivateFn[]): CanActivateFn {
  return (route, state) => {
    const injectionContext = inject(Injector);
    // Convert an array into an observable.
    return from(guards).pipe(
      // For each guard, fire canActivate and wait for it to complete.
      concatMap((guard) => {
        return runInInjectionContext(injectionContext, () => {
          var guardResult = guard(route, state);
          if (guardResult instanceof Observable) {
            return guardResult;
          } else if (guardResult instanceof Promise) {
            return from(guardResult);
          } else {
            return of(guardResult);
          }
        });
      }),
      // Don't execute the next guard if the current guard's result is not true.
      takeWhile((value) => value === true, true),
      // Return the last guard's result.
      last()
    );
  };
}
