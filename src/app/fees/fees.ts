export interface Payment {
  studentfeeid: number;
  amount: string;
  monthName: string;
  datecreated: string;
  dateupdated: string;
  rollNo: string;
  studentClass: {
    studentClassId: number;
    dateCreated: string;
    student: {
      studentid: number;
      rollNumber: number;
      firstname: string;
      middlename: string;
      lastname: string;
      Sex: string;
      dob: string;
      bob: string;
    };
    classSection: {
      classSectionId: number;
      dateCreated: string;
    };
  };
  studentFeeType: {
    paymenttypeid: number;
    type: string;
    amount: string;
  };
  paymentStateId: {
    paymentstateid: number;
    description: string;
  };
}
