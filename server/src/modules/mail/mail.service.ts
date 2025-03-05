import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
  private templates: Record<string, { subject: string; body: string }> = {};

  constructor(private readonly mailerService: MailerService) {
    this.loadTemplates();
  }

  private loadTemplates() {
    try {
      const filePath = path.join(process.cwd(), 'assets/email-templates.json');

      if (!fs.existsSync(filePath)) {
        throw new InternalServerErrorException(
          `Email template file not found: ${filePath}`,
        );
      }

      const fileContent = fs.readFileSync(filePath, 'utf8');
      this.templates = JSON.parse(fileContent);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to load email templates: ' + error.message,
      );
    }
  }

  private parseTemplate(template: string, variables: Record<string, string>) {
    return template.replace(/\{\{(.*?)\}\}/g, (_, key) => variables[key.trim()] || '');
  }

  async sendMail(
    email: string,
    type: 'signup' | 'forgot-password',
    variables: Record<string, string>,
  ) {
    const template = this.templates[type];
    if (!template) {
      throw new InternalServerErrorException(`Email template "${type}" not found`);
    }

    const subject = this.parseTemplate(template.subject, variables);
    const body = this.parseTemplate(template.body, variables);

    await this.mailerService.sendMail({
      to: email,
      subject,
      text: body,
    });
  }
}
