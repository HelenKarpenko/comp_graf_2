import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Fractal, FractalTypes } from '../core/models';
import { FractalService } from '../core/services/fractal.service';
import { environment } from '../../environments/environment';
import { timestamp } from 'rxjs/operators';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.css']
})
export class SandboxComponent implements OnInit {

  fractalParamForm: FormGroup;
  fractalTypes: string[];
  fractal: Fractal = new Fractal();
  statId: string;
  linkPicture: string='https://icon-library.net/images/spinner-icon-gif/spinner-icon-gif-10.jpg';
  base64Image: string;
  timeStamp: number;

  isLoadingResults = false;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private fractalService: FractalService
  ) { }

  ngOnInit() {
    this.setFormValue();
    this.fractalTypes = Object.values(FractalTypes);
    this.getFractal();

    console.log("ngOnInit");
    console.log(this.fractal);
  }

  getFractal() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.isLoadingResults = true;

      this.fractalService.getById(id)
        .subscribe((res: any) => {
          console.log(res.data);
          this.fractal.id = res.data.id;
          this.fractal.type = res.data.type;
          this.fractal.width = res.data.width;
          this.fractal.height = res.data.height;
          this.fractal.centerX = res.data.randomInstance.preset.centerX;
          this.fractal.centerY = res.data.randomInstance.preset.centerY;
          this.fractal.maxZ = res.data.randomInstance.preset.maxZ;
          this.fractal.color = res.data.randomInstance.preset.color;
          this.fractal.power = res.data.randomInstance.preset.power;

          this.statId = this.fractal.id;
          this.setFormValue();
          this.updateLinkPicture();
        }, err => {
          console.log(err);
          this.isLoadingResults = false;
        });
    } else {
      this.isLoadingResults = false;
      this.fractal.type = FractalTypes.MANDELBROT;
      this.fractal.color = '#000000';
      this.setFormValue();
    }
  }

  setFormValue() {
    this.fractalParamForm = this.formBuilder.group({
      type: [this.fractal.type, Validators.required],
      width: [this.fractal.width, [Validators.required, Validators.min(0)]],
      height: [this.fractal.height, [Validators.required, Validators.min(0)]],

      isRndCenterX: [true],
      centerX: [{ value: this.fractal.centerX, disabled: true }, Validators.required],
      isRndCenterY: [true],
      centerY: [{ value: this.fractal.centerY, disabled: true }, Validators.required],
      isRndMaxZ: [true],
      maxZ: [{ value: this.fractal.maxZ, disabled: true }, Validators.required],
      isRndColor: [true],
      color: [{ value: this.fractal.color, disabled: true }, Validators.required],
      isRndPower: [true],
      power: [{ value: this.fractal.power, disabled: true }, [Validators.required, Validators.min(1.75)]],
    });
  }

  onGenerate() {
    console.log('onGenerate');
    console.log(this.fractalParamForm.value);
    this.isLoadingResults = true;
    this.fractalService.createFractal(this.fractalParamForm.value)
      .subscribe((res: any) => {
        console.log(res);
        const id = res.data.id;
        this.statId = id;
        this.isLoadingResults = false;
        setInterval(() => {
          this.updateLinkPicture();
        }, 3000)
      }, (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
      })
  }

  disableEnableInput(isRand: boolean, input: string) {
    console.log(isRand);
    console.log(input);

    if (isRand === true)
      this.fractalParamForm.get(input).disable();
    else
      this.fractalParamForm.get(input).enable();
  }

  updateLinkPicture() {
    this.linkPicture = `${environment.api_url}/image-presets/random-image/${this.statId}`;
    fetch(this.linkPicture)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onload = () => {
          this.base64Image = reader.result.toString();
        };
        reader.readAsDataURL(blob);
      })
  }

  downloadImage() {
    const downloadLink = document.createElement("a");
    const fileName = `fractal-${new Date().toLocaleDateString}.png`;

    downloadLink.href = this.base64Image;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
