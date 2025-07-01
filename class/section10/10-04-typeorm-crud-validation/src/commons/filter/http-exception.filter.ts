import { Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException) {
    const status = exception.getStatus();
    const message = exception.message;

    console.log('=========');
    console.log('예외가 발생했어요');
    console.log('예외내용: ', message);
    console.log('예외코드: ', status);

    console.log('=========');
  }
}

// 이렇게 exceptionfilter를 만들어주고 나서 main.ts에 등록해줘야된다
// app.useGlobalFilters(new HttpExceptionFilter());

// - `@Catch(HttpException)`: 에러 관련된 내용이 들어가 있음을 NestJS 에게 알려주기 위한 데코레이터를 사용 하였습니다.

// - `catch` : Exception 상황 발생시 비즈니스 로직에 try ~ catch 문이 없더라도 자동으로 에러가 catch 문으로 들어옵니다.

//     - `exception: HttpException` : exception으로 들어오는 값을 HttpException 타입스크립트로 정의해주었습니다.

// *** `implements ExceptionFilter` : class 에서 타입을 정의 해주기 위해 implements 사용해 주었습니다.
// 꼭 만들어야되는 '함수'를 정의하는 방법이 implements이고, 그거에 대한 타입을 지정해주는게 nestjs에서 제공해주는 ExceptionFilter라는 타입을 선언해준거다

//     - `ExceptionFilter` : nestjs에서 제공하는 try-catch역할을 하게 만들어주는 인터페이스로 catch 함수가 반드시 존재해야하는 타입입니다. 따라서 catch 문을 작성하지 않으면 에러가 발생합니다.
