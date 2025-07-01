import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, InsertResult, ObjectLiteral, Repository } from 'typeorm';
import { Allergy } from './entities/allergy.entity';
import {
  IAllergiesServiceBulkInsert,
  IAllergiesServiceFindByName,
} from './interfaces/allergies-service.interface';
@Injectable()
export class AllergiesService {
  constructor(
    @InjectRepository(Allergy)
    private readonly allergiesRepository: Repository<Allergy>,
  ) {}

  findByNames({
    allergyNames,
  }: IAllergiesServiceFindByName): Promise<Allergy[]> {
    return this.allergiesRepository.find({
      where: { name: In([...allergyNames]) },
      // 이거의 '결과'로 기존 값의 id,name을 받을 수 있음(리턴값의 타입에 따라)
    });
  }

  // 한번에 넣는 bulkInsert니까 이름을 이렇게 해준다
  bulkInsert({ names }: IAllergiesServiceBulkInsert): Promise<InsertResult> {
    return this.allergiesRepository.insert([...names]);
    // insert안에 배열이 들어가있으면 bulk insert
    // bulk-insert는 save()로 불가능
  }
  // 이거의 '결과'로 새로 저장된 id를 받을 수 있음(InsertResult의 identifier타입을 통해)

  async updateAllergies(
    allergies: { name: string }[],
  ): Promise<(Allergy | ObjectLiteral)[]> {
    const allergyNames = allergies.map((el) => el.name).filter((name) => name); // null값 제거

    // ✅ 기존 알러지를 DB에서 조회
    const prevAllergies = await this.findByNames({ allergyNames });

    // ✅ DB에서 찾은 기존 값(`prevAllergies`)과 비교하여 중복 제거
    const newAllergies = await this.bulkInsert({
      names: allergies
        .filter(
          (el) =>
            el.name && !prevAllergies.some((prev) => prev.name === el.name), // ✅ 기존 DB 값 기준으로 중복 체크
        )
        .map((el) => ({ name: el.name })),
    });

    const insertAllergies = [...prevAllergies, ...newAllergies.identifiers];

    return insertAllergies;
  }
}
