import { Component } from '@angular/core';
import { ProducerApi } from '../shared/producer-api';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { count } from 'rxjs';

@Component({
  selector: 'app-producer',
  imports: [ReactiveFormsModule],
  templateUrl: './producer.component.html',
  styleUrl: './producer.component.css',
})
export class ProducerComponent {
  producers!: any
  producerForm: any
  addMode = true
  constructor(
    private api: ProducerApi,
    private builder: FormBuilder
  ){}

  ngOnInit(){
    
    this.producerForm = this.builder.group({
      id: 0,
      name: '',
      country: '',
      yearOfFoundation: '',
      capacityHectare: ''
    })
    this.getProducers()
  }

  getProducers(){
    this.api.getProducers().subscribe({
      next: (res: any) => {
        console.log(res.data)
        this.producers = res.data
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }
  save(){
    if(this.addMode) {
      this.addProducer()
    } else {
      this.updateProducer()
    }
  }

  addProducer(){
    console.log("Add...")
    console.log(this.producerForm.value)
    this.api.createProducer(this.producerForm.value).subscribe({
      next: (res: any) => {
        console.log(res)
        this.addMode = true
        this.producerForm.reset()
        this.getProducers()
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }

  updateProducer(){
    console.log("Update...")
    this.api.updateProducer(this.producerForm.value).subscribe({
      next: (res: any) => {
        console.log(res)
        this.addMode = true
        this.producerForm.reset()
        this.getProducers()
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }

  editProducer(producer: any){
    console.log(producer)
    this.addMode = false
    this.producerForm.patchValue(producer)
  }

  deleteProducer(id:number){
    this.api.deleteProducer(id).subscribe({
      next: (res: any) => {
        console.log(res)
        this.getProducers()
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }

}
