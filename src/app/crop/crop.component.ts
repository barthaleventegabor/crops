import { Component } from '@angular/core';
import { CropApi } from '../shared/crop-api';
import { ProducerApi } from '../shared/producer-api';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crop',
  imports: [ReactiveFormsModule],
  templateUrl: './crop.component.html',
  styleUrl: './crop.component.css',
})
export class CropComponent {

  crops: any;
  producers: any;
  addMode = true;
  cropForm: any;
  showModal = false

  constructor(
    private cropApi: CropApi,
    private producerApi: ProducerApi,
    private builder: FormBuilder
  ) { }

  ngOnInit() {
    this.cropForm = this.builder.group({
      id: '',
      name: '',
      type: '',
      proteinContent: '',
      producerId: ''
    })
    this.getCrops()
    this.getProducers()
  }

  getCrops() {
    this.cropApi.getCrops().subscribe({
      next: (res: any) => {
        this.crops = res.data
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }
  getProducers() {
    this.producerApi.getProducers().subscribe({
      next: (res: any) => {
        this.producers = res.data
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }

  save() {
    if(this.addMode) {
      this.startCreateCrop()
    } else {
      this.startUpdateCrop()
    }
  }
  startCreateCrop() {
    console.log(this.cropForm.value)
    this.cropApi.createCrop(this.cropForm.value).subscribe({
      next: (res: any) => {
        this.getCrops()
        this.cropForm.reset()
        console.log(res)
        this.showModal = false
        if(res.success){
          Swal.fire({
            title: "Létrehozva",
            text: "A termény létrehozva",
            icon: "success"
          });
        }else{
          Swal.fire({
            title: "A termény létrehozása sikertelen!",
            text: "A termény nem lett létrehozva",
            icon: "error"
          });
        }

      },
      error: (err: any) => {
        console.log(err)
          Swal.fire({
            title: "A termény létrehozása sikertelen!",
            text: "A termény nem lett létrehozva",
            icon: "error"
          });
      }
    })
  }
  startUpdateCrop() {
    console.log('Update ...')
    console.log(this.cropForm.value)
    this.cropApi.updateCrop(this.cropForm.value).subscribe({
      next: (res: any) => {
        this.getCrops()
        this.cropForm.reset()
        console.log(res)
        this.addMode = true
        this.showModal = false
        if(res.success){
          Swal.fire({
            title: "Frissítve",
            text: "A termény frissítve",
            icon: "success"
          });
        }else{
          Swal.fire({
            title: "A termény frissítése sikertelen!",
            text: "A termény nem lett frissítve",
            icon: "error"
          });
        }
        
      },
      error: (err: any) => {
        console.log(err)
          Swal.fire({
            title: "A termény frissítése sikertelen!",
            text: "A termény nem lett frissítve",
            icon: "error"
          });
      }
    })
  }

  startEditCrop(crop: any) {
    this.showModal = true
    this.addMode = false
    this.cropForm.patchValue(crop)

  }

  deleteCrop(id: number) {
    this.cropApi.deleteCrop(id).subscribe({
      next: (res: any) => {
        this.getCrops()
        console.log(res)
        if(res.success){
          Swal.fire({
            title: "Törölve!",
            text: "A termény törölve",
            icon: "success"
          });
        }else{
          Swal.fire({
            title: "Törlés sikertelen!",
            text: "A termény nem lett törölve",
            icon: "error"
          });
        }
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }

  startDeleteCrop(id:number){
    Swal.fire({
      title: "Biztos vagy benne?",
      text: "Nem lehet visszavonni!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Igen, törlöm!",
      cancelButtonText : "Mégsem!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteCrop(id)
      }
    });
  }
  
  cancel() {
    this.cropForm.reset()
    this.addMode = true
    this.showModal = false
  }

  setShowModal(){
    this.showModal = true
  }
}
