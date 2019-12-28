import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: '../404/notfound.component.html',
  styleUrls: ['../404/notfound.component.css']
})

export class NotFoundComponent implements OnInit {

  public href = "";

  constructor(private router: Router) { }

  ngOnInit() {
    this.href = this.router.url;
  }
}
