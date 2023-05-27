// ** Nest Imports
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'

// ** Passport Imports
import JwtGuard from 'src/api/auth/passport/auth.jwt.guard'

// ** Dto Imports
import { ApiResponse } from 'src/common/dto/api.response'
import RequestSaveQuizDto from '../dto/quiz.save.dto'

// ** Custom Module Imports
import QuizService from '../service/quiz.service'

@Controller('quiz')
export default class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('/:id')
  @UseGuards(JwtGuard)
  async saveQuiz(
    @Body() Body: RequestSaveQuizDto,
    @Req() req,
    @Param('id') id,
  ) {
    const { user } = req
    const response = await this.quizService.saveQuiz(
      user,
      Body.text,
      Body.answer,
      Number(id),
    )
    return ApiResponse.of({
      data: response,
      message: 'Success Save Quiz',
      statusCode: 200,
    })
  }

  @Get('/:id')
  async getQuizList(@Param('id') id: string) {
    const response = await this.quizService.getQuizListByBookIdx(Number(id))
    return ApiResponse.of({
      data: response,
      message: 'Success Find Quiz List',
      statusCode: 200,
    })
  }

  @Get('/quiz/:id')
  async getQuiz(@Param('id') id: string) {
    const response = await this.quizService.findQuizByIdx(Number(id))
    return ApiResponse.of({
      data: response,
      message: 'Success Find Quiz',
      statusCode: 200,
    })
  }
}