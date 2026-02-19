---
title: "JWT Implementation Checklist (NestJS)"
description: "Checklist for implementing JWT in a NestJS project"
pubDate: "Feb 19 2026"
categories: ["Backend"]
---

#### Secret Key

Can be verified by the server – only someone with the secret key can generate a valid signature.

```bash title="Generate secret key"
openssl rand -base64 32
```

#### Install Packages

```bash
pnpm add bcrypt jsonwebtoken @nestjs/jwt @nestjs/passport passport passport-jwt
pnpm add -D @types/bcrypt @types/jsonwebtoken @types/passport-jwt
```

#### Keep JWT Payload Minimal

```ts title="src/auth/auth.service.ts"
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

interface UserPayload {
  username: string;
  userId: string;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: UserPayload) {
    const payload = { username: user.username, sub: user.userId };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
```

#### HttpOnly Cookie

A cookie with the HttpOnly flag cannot be accessed via JavaScript, protecting sensitive tokens (like JWTs) from **XSS attacks**.

```ts title="src/auth/auth.controller.ts"
import type { Response } from 'express';

@Post('signin')
async signIn(@Request() req, @Res() res: Response) {
  const { accessToken } = await this.authService.signIn(req.user);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24, // 24h in ms
  });

  res.json({ success: true });
}
```

#### Passport Strategy

Register `JwtModule` and set up a strategy to validate the token on protected routes.

```ts title="src/auth/auth.module.ts"
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "15m" },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

```ts title="src/auth/jwt.strategy.ts"
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extract JWT from HttpOnly cookie instead of Authorization header
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.accessToken ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { sub: string; username: string }) {
    // Return value is attached to req.user
    return { userId: payload.sub, username: payload.username };
  }
}
```

```ts title="src/auth/jwt-auth.guard.ts"
import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
```

###### Usage on protected-route

```ts title="src/app.controller.ts"
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user;
}
```

#### Refresh Token (optional)

Access tokens should be short-lived (15m). A refresh token is long-lived and used to issue new access tokens without re-authentication.

**Flow:** client sends refresh token → server validates and issues new access token.

Store the refresh token **hashed** in the DB and rotate it on every use.

```ts title="src/auth/auth.service.ts"
import * as bcrypt from 'bcrypt';

async generateTokens(userId: string, username: string) {
  const [accessToken, refreshToken] = await Promise.all([
    this.jwtService.signAsync(
      { sub: userId, username },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' }
    ),
    this.jwtService.signAsync(
      { sub: userId },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' }
    ),
  ]);
  return { accessToken, refreshToken };
}

async storeRefreshToken(userId: string, refreshToken: string) {
  const hash = await bcrypt.hash(refreshToken, 10);
  // Save hash to DB against userId (replace previous)
  await this.usersService.updateRefreshToken(userId, hash);
}

async refresh(userId: string, refreshToken: string) {
  const user = await this.usersService.findById(userId);
  if (!user?.refreshTokenHash) throw new ForbiddenException();

  const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
  if (!matches) throw new ForbiddenException();

  // Rotate: issue new tokens and store new hash
  const tokens = await this.generateTokens(userId, user.username);
  await this.storeRefreshToken(userId, tokens.refreshToken);
  return tokens;
}

async logout(userId: string) {
  // Invalidate refresh token by clearing hash in DB
  await this.usersService.updateRefreshToken(userId, null);
}
```

###### Refresh Endpoint

```ts title="src/auth/auth.controller.ts"
@Post('refresh')
async refresh(@Req() req: Request, @Res() res: Response) {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) throw new UnauthorizedException();

  // Decode to get userId (no verify – strategy does that)
  const payload = this.jwtService.decode(refreshToken) as { sub: string };
  const tokens = await this.authService.refresh(payload.sub, refreshToken);

  res.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 15, // 15m
  });

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
  });

  res.json({ success: true });
}
```
