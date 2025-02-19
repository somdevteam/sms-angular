import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { SnackbarService } from '@shared/snackbar.service';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ExamsService {
    private baseUrl = 'http://localhost:3000/api'; 
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
        return this.apiService.sendHttpPostRequest('/exams/addexaminfo', payload)
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
    updateExamInfo(examInfoId: number, payload: any) {
        return this.apiService.sendHttpUpdateRequest(`/exams/updatexaminfo`, examInfoId, payload)
            .pipe(
                map((resp) => {
                    const { message, data } = resp;
                    this.snackBar.successNotification(message)
                    return data;
                })
            );
    }

    findExamClasses(payload: any) {
        const { examInfoId, branchId } = payload;
        return this.apiService.sendHttpGetRequest(`/class/examclass?examInfoId=${examInfoId}&branchId=${branchId}`)
            .pipe(
                map((resp) => {
                    const { data } = resp;
                    return data;
                })
            );
    }

    addExamToClass(payload: any) {
        return this.apiService.sendHttpPostRequest('/exams/addclassexam', payload)
            .pipe(
                map((resp) => {
                    const { data } = resp;
                    return data;
                })
            );
    }

    getBranches(): Observable<any[]> {
        return this.apiService.sendHttpGetRequest('/branches');
      }
    
      getExamsByBranch(branchId: number): Observable<any> {
        return this.apiService.sendHttpGetRequest(`/exams/findexamsbybranch?branchId=${branchId}`);
      }
    
      getClassesByExam(examId: number): Observable<any[]> {
        return this.apiService.sendHttpGetRequest(`/exams/getclassbyexam?examId=${examId}`);
      }
    
      getSectionsByClass(classId: number): Observable<any[]> {
        return this.apiService.sendHttpGetRequest(`/sections/getsectionsbyclass?classId=${classId}`);
      }
    
      submitExamResult(data: any): Observable<any> {
        return this.apiService.sendHttpPostRequest('/exam-results', data);
      }



}
