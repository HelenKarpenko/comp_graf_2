import { Component, OnInit } from '@angular/core';
import { FractalService } from '../core/services/fractal.service';
import { Fractal } from '../core/models/fractal';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-labrary',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {

  fractals: Fractal[] = [];
  isLoadingResults = false;
  linkPicture: string;

  constructor(private fractalService: FractalService) { }

  ngOnInit() {
    this.linkPicture = `${environment.api_url}/image-presets/random-image`;

    console.log(this.linkPicture);

    this.fractalService.getAll()
    .subscribe((res: any) => {
      console.log(res);
      this.fractals = res.data;
      console.log(this.fractals);
      this.isLoadingResults = false;
    }, err => {
      console.log(err);
      this.isLoadingResults = false;
    });
  }

}
