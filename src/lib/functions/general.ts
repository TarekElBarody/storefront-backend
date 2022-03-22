import { User, ResUser } from '../../types/index';
import { Request } from 'express';
// Generate Local Date Now
export const dateNow = (): Date => {
  const gmtDate = new Date();
  const nowDate = new Date(
    gmtDate.getTime() - gmtDate.getTimezoneOffset() * 60 * 1000
  );
  return nowDate;
};

// safeString is a function that replace unsafe user input and replaced to to _
export const safeString = (str: string): string => {
  try {
    // ReqEXP to match letters and Numbers only
    const result = str.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return result;
  } catch (e) {
    return '';
  }

  return '';
};

export async function getRsUsers(users: User[]): Promise<ResUser[]> {
  const resUsers: ResUser[] = [];
  for (let i = 0; i < users.length; i++) {
    resUsers.push({
      id: users[i].id as number,
      first_name: users[i].first_name,
      last_name: users[i].last_name,
      birthday: users[i].birthday,
      email: users[i].email,
      mobile: users[i].mobile,
      role: users[i].role,
      created: users[i].created as Date
    });
  }
  return resUsers;
}

export async function getRsUser(user: User): Promise<ResUser> {
  return {
    id: user.id as number,
    first_name: user.first_name,
    last_name: user.last_name,
    birthday: user.birthday,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
    created: user.created as Date
  };
}

export function fingerPrint(req: Request): string {
  const data = req.ip + '.' + req.headers['user-agent'];
  const buff = Buffer.from(data, 'base64');
  const fp = buff.toString('ascii');
  return fp;
}

export function getAge(birthday: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const m = today.getMonth() - birthday.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }
  return age;
}
