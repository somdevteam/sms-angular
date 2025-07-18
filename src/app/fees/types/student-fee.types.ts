// First, let's define proper interfaces for the response structure
export interface ResponsibleInfo {
  responsibleid: number;
  responsiblename: string;
  phone: string;
  phone2: string;
  address: string;
}

export interface StudentClassInfo {
  studentClassId: number;
  classId: number;
  className: string;
  sectionId: number;
  sectionName: string;
  classSectionId: number;
  levelClassId: number;
  levelId: number;
  levelName: string;
  levelFee: number;
  isActive: boolean;
}

export interface StudentFeeInfo {
  studentid: number;
  rollNumber: string;
  firstname: string;
  middlename: string;
  lastname: string;
  Sex: string;
  dob: string;
  bob: string;
  fullName: string;
  studentClass: StudentClassInfo[];
}

export interface StudentOption {
  label: string;
  student: StudentFeeInfo;
}
