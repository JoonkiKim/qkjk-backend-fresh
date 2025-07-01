import {
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApolloError } from 'apollo-server-core';
import { AxiosError } from 'axios';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown) {
    // default예외
    const error = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: '예외가 발생했어요',
    };

    // 아래는 http예외일때 에러 잡아내는 코드
    if (exception instanceof HttpException) {
      error.status = exception.getStatus();
      error.message = exception.message;
    }

    // axios에러일때 잡아내는 코드
    if (exception instanceof AxiosError) {
      error.status = exception.response.status;
      error.message = exception.response.data.message;
    }

    // 우리는 graphql을 사용하기 때문에 ApolloError를 감싸서 보내줘야된다 -> app.module쪽에 설정도 해줘야된다(formatError를 등록해줘야됨). main.ts에도 등록해줘야된다
    console.log('에러 보낸다~');
    throw new ApolloError(error.message, error.status.toString());

    // console.log('=========');
    // console.log('예외가 발생했어요');
    // console.log('예외내용: ', message);
    // console.log('예외코드: ', status);

    // console.log('=========');
  }
}

// Catch안에 아무것도 안써주면 모든 예외를 통합할 수 있다
// 그러고 default이외의 에러는 if문으로 잡아주면 되는거임

// @Catch(HttpException)
// export class HttpExceptionFilter implements ExceptionFilter {
//   catch(exception: HttpException) {
//     const status = exception.getStatus();
//     const message = exception.message;

//     console.log('=========');
//     console.log('예외가 발생했어요');
//     console.log('예외내용: ', message);
//     console.log('예외코드: ', status);

//     console.log('=========');
//   }
// }
