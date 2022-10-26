import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { Response } from 'express'
import { MateService } from 'src/mate/application/mate.service'
import { AuthService } from '../application/auth.service'
import { MailDto } from '../dto/mail.dto'
import ReqWithUser from '../dto/passport.req.dto'
import { CreateUserDto } from '../dto/user.create.dto'
import KakaoGuard from '../passport/auth.kakao.guard'
import { LocalGuard } from '../passport/auth.local.guard'
import { NaverGuard } from '../passport/auth.naver.guard'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mateService: MateService,
  ) {}

  @Post()
  async localSave(@Body() req: CreateUserDto, @Res() res) {
    const user = await this.authService.localSave(req)
    const token = await this.authService.gwtJwtWithIdx(user.idx)
    res.cookie('accessToken', token, {
      expires: new Date(Date.now() + 86400e3),
    })
    res.send(user)
  }

  @UseGuards(LocalGuard)
  @Post('/local')
  async localLogin(@Req() req: ReqWithUser, @Res() res: Response) {
    const { user } = req
    const token = await this.authService.gwtJwtWithIdx(user.idx)
    res.cookie('accessToken', token, {
      expires: new Date(Date.now() + 86400e3),
    })
    res.send({ user, token })
  }

  @Get('/kakao')
  @HttpCode(200)
  @UseGuards(KakaoGuard)
  async kakaoLogin() {
    return HttpStatus.OK
  }

  @Get('/kakao/callback')
  @HttpCode(200)
  @UseGuards(KakaoGuard)
  async kakaoCallBack(@Req() req, @Res() res: Response) {
    const token = await this.authService.kakaoLogin(req.user)
    res.cookie('accessToken', token, {
      expires: new Date(Date.now() + 86400e3),
    })
    const mate = await this.mateService.findMateById(req.user)
    return mate
      ? res.redirect('http://localhost:5173')
      : res.redirect('http://localhost:5173/auth/info')
  }

  @Get('/naver')
  @HttpCode(200)
  @UseGuards(NaverGuard)
  async naverLogin() {
    return HttpStatus.OK
  }

  @Get('/naver/callback')
  @HttpCode(200)
  @UseGuards(NaverGuard)
  async naverCallBack(@Req() req, @Res() res: Response) {
    const token = await this.authService.naverLogin(req.user)
    res.cookie('accessToken', token, {
      expires: new Date(Date.now() + 86400e3),
    })
    const mate = await this.mateService.findMateById(req.user)
    return mate
      ? res.redirect('http://localhost:5173')
      : res.redirect('http://localhost:5173/auth/info')
  }

  @Post('/mail')
  async sendMail(@Body() req: MailDto) {
    return this.authService.sendMail(req.email)
  }
}
