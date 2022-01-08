import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

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
    await this.mailerService.sendMail({
      from: '"No Reply" <thependailynews@gmail.com>',
      to: email,
      subject: `Class Invitation - ${new Date(
        Date.now(),
      ).toLocaleDateString()}`,
      html: `<p>${inviterName} (${inviterEmail}) want to invite you to join class "${classTitle}" as a "${role}".</p><br><a target="_blank" rel="noopener noreferrer" href="${process.env.FRONT_END_HOST}classes/join?classId=${classId}&role=${role}&code=${classroomCode}${inviteCode}">Click here to accept.</a>`,
    });
  }

  async sendResetPassMail(email: string, password: string) {
    await this.mailerService.sendMail({
      from: '"No Reply" <thependailynews@gmail.com>',
      to: email,
      subject: `Reset password - ${new Date(Date.now()).toLocaleDateString()}`,
      html: `<p>New password: ${password}</p>`,
    });
  }
}
