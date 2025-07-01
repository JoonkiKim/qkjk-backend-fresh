import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FilesService } from './files.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver()
export class FilesResolver {
  constructor(
    private readonly filesService: FilesService, //
  ) {}

  @Mutation(() => String)
  uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload, // FileUpload은 타입스크립트 타입이고, GraphQLUpload으로 그랲큐엘 타입을 또 지정해줘야됨
    // file이라는 Args로 브라우저에서 파일을 받아오기
  ): string {
    return this.filesService.upload({ file });
  }
}
