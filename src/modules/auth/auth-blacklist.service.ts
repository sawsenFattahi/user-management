import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthBlacklistService {
  private blacklistedTokens = new Set<string>();

  addToken(token: string): void {
    this.blacklistedTokens.add(token);
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }
}
