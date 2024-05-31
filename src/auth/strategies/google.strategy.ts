import { PassportStrategy } from '@nestjs/passport';

import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDataGoogleAuthInterface } from '@src/interfaces/users/userDataGoogleAuth.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_AUTH_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_AUTH_CLIENT_SECRET'),
      callbackURL: configService.get('NODE_ENV') == 'production'
        ? configService.get('GOOGLE_AUTH_CALLBACK_URL_PROD')
        : configService.get('GOOGLE_AUTH_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    console.log('!!! accessToken = ', accessToken)
    console.log('!!! refreshToken = ', refreshToken)
    console.log('!!! profile = ', profile)

    const { name, emails, photos } = profile;
    const user: UserDataGoogleAuthInterface = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
