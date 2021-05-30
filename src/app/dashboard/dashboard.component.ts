import { Component, OnInit, OnDestroy } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ArweaveService } from '../core/arweave.service';
import { Observable, Subscription, EMPTY } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserSettingsService } from '../core/user-settings.service';
import { ArwikiQuery } from '../core/arwiki-query';
import { Location } from '@angular/common';
import { ArwikiTokenContract } from '../core/arwiki-contracts/arwiki-token';
declare const window: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
	mainAddress: string = this._auth.getMainAddressSnapshot();
	balance: string = '';
	balancePST: string = '';
  balanceSubscription: Subscription = Subscription.EMPTY;
  balancePSTSubscription: Subscription = Subscription.EMPTY;
  loadingBalance: boolean = false;
  loadingBalancePST: boolean = false;
  loading: boolean = false;
  txmessage: string = '';
  lastTransactionID: Observable<string> = this._arweave.getLastTransactionID(
    this.mainAddress
  );;

  constructor(
  	private _snackBar: MatSnackBar,
  	private _arweave: ArweaveService,
    private _auth: AuthService,
    private _userSettings: UserSettingsService,
    private _location: Location,
    private _arwikiTokenContract: ArwikiTokenContract
  ) { }

  ngOnInit() {
    this.loadingBalance = true;
    this.balanceSubscription = this._arweave
      .getAccountBalance(this.mainAddress)
      .subscribe({
        next: (res: string) => {
          this.balance = res;
          this.loadingBalance = false;
        },
        error: (error) => {
          this.message(error, 'error');
          this.loadingBalance = false;
        }
      });

    this.loadingBalancePST = true;
    this.balancePSTSubscription = this._arwikiTokenContract
      .getBalance(this.mainAddress)
      .subscribe({
        next: (res: string) => {
          this.balancePST = res;
          this.loadingBalancePST = false;
        },
        error: (error) => {
          this.message(error, 'error');
          this.loadingBalancePST = false;
        }
      });

  }

  ngOnDestroy() {
    if (this.balanceSubscription) {
      this.balanceSubscription.unsubscribe();
    }
    if (this.balancePSTSubscription) {
      this.balancePSTSubscription.unsubscribe();
    }
  }

  /*
  *	Custom snackbar message
  */
  message(msg: string, panelClass: string = '', verticalPosition: any = undefined) {
    this._snackBar.open(msg, 'X', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: verticalPosition,
      panelClass: panelClass
    });
  }


  goBack() {
    this._location.back();
  }

}
