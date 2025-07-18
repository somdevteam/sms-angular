export interface Student {
  studentid: number;
  rollNumber: number;
  firstname: string;
  middlename: string;
  lastname: string;
  Sex: string;
  dob: string; // Use Date if you plan to handle it as a Date object
  bob: string;
  fullName: string;
  studentClass: StudentClass[]; // Array of classes the student is enrolled in
}

export interface StudentClass {
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
