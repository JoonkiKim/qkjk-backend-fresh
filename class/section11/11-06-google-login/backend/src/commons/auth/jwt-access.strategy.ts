import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor() {
    super({
      //   jwtFromRequest: (req) => {
      //     console.log(req);
      //     const temp = req.headers.authorization; // Bearer asdlkfjqlkwjf-09182hjkasdfklj-fasdklj
      //     const accessToken = temp.toLowercase().replace('bearer ', '');
      //     return accessToken;
      //   },
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_KEY,
    });
  }

  validate(payload) {
    console.log(payload); // { email: a@a.com, sub: sldkfjqiw-120ujasdljk }
    return {
      email: payload.email,
      id: payload.sub,
    };
  }
}
