import { Component, Input, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy{
@Input() modalID = '';
  constructor(public modal: ModalService, public el : ElementRef) { }

  ngOnInit(): void {
    //element ref used to manipulate dom
    //appendchild add a node to the end of list of child
    document.body.appendChild(this.el.nativeElement)
  }
  ngOnDestroy(): void {
      document.body.removeChild(this.el.nativeElement)
  }

  closeModel(){
    this.modal.toggleModal(this.modalID);
  }

}
