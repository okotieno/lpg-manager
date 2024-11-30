import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  selector: 'lpg-root',
  template: `<router-outlet></router-outlet>`,
  styles: ``,
})
export class AppComponent {
  title = 'dealer';
}
