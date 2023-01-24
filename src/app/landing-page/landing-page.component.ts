import { Component, OnInit } from '@angular/core';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class LandingPageComponent implements OnInit {
  displayResponsive: any;
  position: any;
  uploadedFiles: any[] = [];
  cardData: any;
  items: any;
  status: any = 'Current Week Menu';

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService, private httpClient: HttpClient) { }
  // https://jsonblob.com/api/956612631322705920
  // https://jsonblob.com/api/956277143109910528
  ngOnInit(): void {
    this.httpClient.get('https://jsonblob.com/api/956612631322705920').subscribe((res: any) => {
      console.log(res);
      this.cardData = res.weekOne;
      this.items = res;
    });
  }
  /**
   * Function for import files model
   */
  showResponsiveDialog() {
    this.displayResponsive = true;
  }

  /**
  * functionality to upload excel data
  * @param event
  */
  onUpload(event: any) {
    console.log(event.files);

    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        for (let file of event.files) {
          this.uploadedFiles.push(file);
        }
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'File Uploaded Successfully!' });
        this.displayResponsive = false;     
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'File upload Unsuccessful!' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });
    // this.messageService.add({ severity: 'info', summary: 'File Uploaded Successfully!', detail: '' });
  }

  /**
   * Filter data based in weeks and month
   * @param event 
   */
  filterData(event: any) {
    this.cardData = [];
    this.status = `${event.target.value} Menu`;
    console.log(event.target.value);
    if (event.target.value === 'Week One') {
      this.cardData = this.items.weekOne;
    } if (event.target.value === 'Week Two') {
      this.cardData = this.items.weekTwo;
    } if (event.target.value === 'Week Three') {
      this.cardData = this.items.weekThree;
    } if (event.target.value === 'Week Four') {
      this.cardData = this.items.weekFour;
    } if (event.target.value === 'First Month') {
      const x = this.items.weekOne.concat(this.items.weekTwo, this.items.weekThree, this.items.weekFour);
      x.map((x: any) => this.cardData.filter((a: any) => a.itemName == x.itemName).length > 0 ? null : this.cardData.push(x));
    } if (event.target.value === 'Second Month') {
      this.cardData = this.items.monthTwo;
    } if (event.target.value === 'All') {
      const x = this.items.weekOne.concat(this.items.weekTwo, this.items.weekThree, this.items.weekFour, this.items.monthTwo);
      x.map((x: any) => this.cardData.filter((a: any) => a.itemName == x.itemName).length > 0 ? null : this.cardData.push(x));
    }
  }

}
