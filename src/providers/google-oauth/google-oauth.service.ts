import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleOauthService extends OAuth2Client {
  constructor(
    configService: ConfigService,
  ) {
    const clientId = configService.get<string>('oauth.google.clientID');
    const clientSecret = configService.get<string>('oauth.google.clientSecret');

    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth clientID or clientSecret is not defined in the configuration.');
    }

    super({
      clientId,
      clientSecret,
      redirectUri: 'postmessage',
    });
  }
}
