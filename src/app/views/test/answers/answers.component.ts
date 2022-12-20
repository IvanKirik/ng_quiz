import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../core/auth/auth.service";
import {UserInfoType} from "../../../../types/user-info.type";
import {TestService} from "../../../shared/service/test.service";
import {QuizType} from "../../../../types/quiz.type";
import {map} from "rxjs";

@Component({
  selector: 'answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.scss']
})
export class AnswersComponent implements OnInit {

  public userInfo!: UserInfoType;
  public quizzes!: QuizType;

  constructor(private router: Router,
              private authService: AuthService,
              private activatedRoute: ActivatedRoute,
              private testService: TestService) {
  }

  ngOnInit(): void {
    const info: UserInfoType | null = this.authService.getUserInfo();
    if (info) {
      this.userInfo = info;
    }

    this.activatedRoute.queryParams
      .subscribe(params => {
        this.testService.getRightAnswer(params['id'], this.userInfo.userId)
          .pipe(
            map((result) => (result.test))
          )
          .subscribe((data: QuizType) => {
            if (data) {
              this.quizzes = (data as QuizType);
            }
          })

      })


  }

}
