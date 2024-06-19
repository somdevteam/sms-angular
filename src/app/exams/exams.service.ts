import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { SnackbarService } from '@shared/snackbar.service';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ExamsService {

    constructor(
        private apiService: ApiService,
        private snackBar: SnackbarService,
    ) { }

    getExams() {
        return this.apiService.sendHttpGetRequest('/exams')
            .pipe(
                map((resp) => {
                    const { data } = resp;
                    return data;
                })
            );
    }

    addExamInfo(payload: any) {
        return this.apiService.sendHttpPostRequest('/exam-info', payload)
            .pipe(
                map((resp) => {
                    const { message, data } = resp;
                    this.snackBar.successDialog('success', message)
                    return data;
                })
            );
    }

    findExamsByBranch(branchId: number) {
        return this.apiService.sendHttpGetRequest(`/exams/findexamsbybranch?branchId=${branchId}`)
            .pipe(
                map((resp) => {
                    const { data } = resp;
                    return data;
                })
            );
    }

}
