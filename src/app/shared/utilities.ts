export function createFullName(firstName: string, middleName: string, lastName: string): string {
  firstName = trimString(firstName);
  middleName = trimString(middleName);
  lastName = trimString(lastName);

  let fullName = `${firstName} ${middleName} ${lastName}`.trim();

  if (fullName) {
    fullName = trimString(fullName).toLowerCase();
  }

  return fullName.replace(/[^a-zA-Z0-9\/ ]/g, '');
}

// Helper function to trim strings
export  function trimString(str: string): string {
  return str ? str.replace(/\s\s+/g, ' ').trim() : '';
}

export function  formatDate(date: Date | null): string | null {
  if (!date) return null;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
