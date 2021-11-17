import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailService {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'thependailynews@gmail.com',
      pass: 'thependaily',
    },
  });
  constructor() {
    this.sendMail(
      'nguyenthaitan9@gmail.com',
      'aaaaaaaaa',
      'STUDENT',
      'aaaaaa',
      'ssssss',
      'Tân Nguyễn',
      'nguyentan@gmail.com',
      'ABC',
    );
  }

  async sendMail(
    email: string,
    classId: string,
    role: string,
    classroomCode: string,
    inviteCode: string,
    inviterName: string,
    inviterEmail: string,
    classTitle: string,
  ) {
    await this.transporter.sendMail({
      from: '"No Reply" <thependailynews@gmail.com>',
      to: email,
      subject: `Class Invitation - ${new Date(
        Date.now(),
      ).toLocaleDateString()}`,
      html: `<p>${inviterName} (${inviterEmail}) want to invite you to join class "${classTitle}" as a "${role}".</p><br><a target="_blank" rel="noopener noreferrer" href="https://nguyendonghuynhlang26123.github.io/classroom.frontend/#/classes/join?classId=${classId}&role=${role}&code=${classroomCode}${inviteCode}">Click here to accept.</a>`,
    });
  }
}
