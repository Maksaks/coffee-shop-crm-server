import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ConfigService } from '@nestjs/config';

export const getMailConfig = async (
  configService: ConfigService,
): Promise<any> => {
  const transport = configService.get<string>('MAILEL_TRANSPORT');
  const mailName = configService.get<string>('MAILEL_FROM_NAME');
  const mailAddress = transport.split(':')[1].split('//')[1];

  return {
    transport,
    defaults: {
      from: `"${mailName}" <${mailAddress}>`,
    },
    template: {
      adapter: new EjsAdapter(),
      options: {
        strict: false,
      },
    },
  };
};
