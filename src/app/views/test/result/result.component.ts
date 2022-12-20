import { Component, OnInit } from '@angular/core';
import {TestService} from "../../../shared/service/test.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/dafaul-response.type";
import {PassTestResponseType} from "../../../../types/pass-test-response.type";

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  public result: string = '';
  private testId:  number = 0;

  constructor(private testService: TestService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    const userInfo = this.authService.getUserInfo();
    if(userInfo) {
      this.activatedRoute.queryParams
        .subscribe(params => {
          if(params['id']) {
            this.testService.getResult(params['id'], userInfo.userId)
              .subscribe(result => {
                if(result) {
                  if ((result as DefaultResponseType).error !== undefined) {
                    throw new Error((result as DefaultResponseType).message);
                  }
                  this.result = (result as PassTestResponseType).score + '/' + (result as PassTestResponseType).total;
                  this.testId = params['id'];
                }
              })
          }

        })
    }

  }

  public transition() {
    this.router.navigate(['/answers'], {queryParams: {id: this.testId}})
  }

}
