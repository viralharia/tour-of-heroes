import { Component } from '@angular/core';
import { MessageServiceService } from '../message-service.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-messages-component',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './messages-component.component.html',
  styleUrl: './messages-component.component.css'
})
export class MessagesComponentComponent {
  constructor(public messageService:MessageServiceService){}
}
