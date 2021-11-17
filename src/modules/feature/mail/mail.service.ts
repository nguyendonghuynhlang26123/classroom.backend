import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(
    email: string,
    classId: string,
    role: string,
    classroomCode: string,
    inviteCode: string,
  ) {
    await this.mailerService.sendMail({
      from: '"No Reply" <thependailynews@gmail.com>',
      to: email,
      subject: `Class Invitation - ${new Date(
        Date.now(),
      ).toLocaleDateString()}`,
      html: `<a target="_blank" rel="noopener noreferrer" href="http://localhost:3000/classes/join?classId=${classId}&role=${role}&code=${classroomCode}${inviteCode}">Click here to join class.</a>`,
    });
  }
}
