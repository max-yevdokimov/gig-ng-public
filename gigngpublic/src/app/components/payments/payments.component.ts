import { Component, OnInit } from '@angular/core';
import { Grid } from 'src/app/shared/grid';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Payment } from 'src/app/shared/payment';

@Component({
    templateUrl: './payments.component.html',
})
export class PaymentsComponent implements OnInit {
    paymentForm: FormGroup;
    payments: Payment[];
    private gridData: Grid;
    constructor() { }

    ngOnInit(): void {
        this.initForm();
        this.loadPayments();
    }

    codeGenerated($event: Grid) {
        this.gridData = $event;
    }

    savePayment() {
        if (this.paymentForm.valid) {
            console.log(this.paymentForm.value);
            this.payments.push({
                amount: this.paymentForm.value.amount,
                name: this.paymentForm.value.name,
                grid: this.gridData
            })
            localStorage.setItem('payments', JSON.stringify(this.payments));
        }
    }

    private initForm() {
        this.paymentForm = new FormGroup({
            amount: new FormControl(null, Validators.required),
            name: new FormControl(null, Validators.required)
        });
    }

    private loadPayments() {
        const json = localStorage.getItem('payments');
        if (json) {
            this.payments = JSON.parse(json);
        } else {
            this.payments = [];
        }
    }
}
