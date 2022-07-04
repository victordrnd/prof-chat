import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthenticateGuard extends AuthGuard('jwt') {}