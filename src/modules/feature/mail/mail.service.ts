import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {
    this.sendMail('nguyenthaitan9@gmail.com','aaaaaaaaa', 'STUDENT', 'aaaaaa', 'ssssss', 'Tân Nguyễn', 'nguyentan@gmail.com', 'ABC')
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
    await this.mailerService.sendMail({
      from: '"No Reply" <thependailynews@gmail.com>',
      to: email,
      subject: `Class Invitation - ${new Date(
        Date.now(),
      ).toLocaleDateString()}`,
      html: `<p>${inviterName} (${inviterEmail}) want to invite you to join class "${classTitle}" as a "${role}".</p><br><a target="_blank" rel="noopener noreferrer" href="http://localhost:3000/classes/join?classId=${classId}&role=${role}&code=${classroomCode}${inviteCode}">Click here to accept.</a>`,
    });
  }
}
