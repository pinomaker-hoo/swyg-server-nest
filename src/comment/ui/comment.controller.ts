import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import JwtGuard from 'src/auth/passport/auth.jwt.guard'
import { ApiResponse } from 'src/common/dto/api.response'
import { CommentService } from '../application/comment.service'

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/:id')
  @UseGuards(JwtGuard)
  async saveComment(@Body() body, @Req() req, @Param('id') reviewIdx: string) {
    const { user } = req
    const { text } = body
    const response = await this.commentService.saveComment(
      user,
      text,
      Number(reviewIdx),
    )
    return ApiResponse.of({
      data: response,
      message: 'Success Save Comment',
      statusCode: 200,
    })
  }

  @Get('/:id')
  async getComment(@Param('id') reviewIdx: string) {
    const response = await this.commentService.getCommentList(Number(reviewIdx))
    return ApiResponse.of({
      data: response,
      message: 'Success Find Comment',
      statusCode: 200,
    })
  }
}
