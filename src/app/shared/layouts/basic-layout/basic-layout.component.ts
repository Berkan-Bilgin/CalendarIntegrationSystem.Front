import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-basic-layout',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './basic-layout.component.html',
  styleUrl: './basic-layout.component.scss',
})
export class BasicLayoutComponent {}
