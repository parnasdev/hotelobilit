import {Injectable} from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    constructor() {
    }

    custom(message: any): any {
        // icon : info-artwork , error , warning , question , success
        Swal.fire({
            position: 'bottom',
            title: message,
            toast: true,
            timerProgressBar: true,
            showConfirmButton: false,
            timer: 5000
        });
    }

    showMessageBig(message: string): any {
        // icon : info , error , warning , question , success
        Swal.fire({
            title: '',
            text: message,
            showConfirmButton: true,
        });
    }

    error(): void {
        this.custom('مشکلی رخ داده است');
    }

    invalid(): void {
        this.custom('لطفا اطلاعات را کامل وارد کنید');
    }

    notMatchPassword(): void {
        this.custom('رمز عبور یکسان نیست');
    }
}
