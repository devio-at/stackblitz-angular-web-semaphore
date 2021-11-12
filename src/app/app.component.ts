import { HttpClient } from "@angular/common/http";
import { Component, VERSION } from "@angular/core";
import { Semaphore } from "./await-semaphore";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  name = "Angular " + VERSION.major;
  semaphore = new Semaphore(100);

  // HttpClient sample from https://jasonwatmore.com/post/2019/09/06/angular-http-get-request-examples
  // and https://stackblitz.com/edit/angular-http-get-examples?file=app/components/get-request.component.ts
  constructor(private http: HttpClient) {}

  ngOnInit() {
    console.log("ngOnInit()");
  }

  private url = "https://api.npms.io/v2/search?q=scope:angular";
  private invalidUrl = "https://api.npms.io/v2/invalid-url";
  private longUrl =
    "https://l.staticblitz.com/ngcc/v3/10.1.5/@angular/forms@10.1.5";

  btnStart1Click() {
    console.log("btnStart1Click");
    this.semaphore.use(() => {
      return new Promise(resolve =>
        this.http.get<any>(this.url).subscribe(data => {
          console.log("btnStart1Click subscribe");
          resolve();
          console.log("btnStart1Click resolve");
        })
      );
    });
  }

  btnStart2Click() {
    console.log("btnStart2Click");
    this.semaphore.use(() => {
      return new Promise(resolve => {
        console.log("btnStart2Click subscribe");
        this.http.get<any>(this.invalidUrl).subscribe({
          next: data => {
            console.log("btnStart2Click success");
          },
          error: error => {
            console.log("btnStart2Click error + resolve");
            resolve();
          },
          complete: () => {
            // only if no error
            console.log("btnStart2Click complete + resolve");
            resolve();
          }
        });
        // alternatively call resolve() in .add(() => { resolve(); })
      });
    });
  }

  btnStart3Click() {
    console.log("btnStart3Click");
    this.semaphore.use(() => {
      return new Promise(resolve => {
        console.log("btnStart3Click subscribe");
        this.http.get<any>(this.longUrl).subscribe({
          next: data => {
            console.log("btnStart3Click success");
          },
          error: error => {
            console.log("btnStart3Click error + resolve");
            resolve();
          },
          complete: () => {
            console.log("btnStart3Click complete + resolve");
            resolve();
          }
        });
        // alternatively call resolve() in .add(() => { resolve(); })
      });
    });
  }

  btnAllClick() {
    this.btnStart1Click();
    this.btnStart2Click();
    this.btnStart3Click();
  }
}
