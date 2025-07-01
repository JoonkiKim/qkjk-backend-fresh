// product.subscriber.ts

import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Product } from './product.entity';

// EventSubscriber()는 트리거라는걸 선언해주는 부분
@EventSubscriber()
// Subscriber의 타입은 무조건 EntitySubscriberInterface로 해준다
export class ProductSubscriber implements EntitySubscriberInterface {
  // Product에 변경이 일어나면 자동으로 실행되게 해주는게 listenTo()
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
    // 자기자신(this)를 subscribers에 등록해준다는 뜻
  }
  listenTo() {
    return Product;
  }

  // Subscriber가 작동하는 조건을 적어주면 되는건데
  // 예를 들어 아래의 afterInsert의 경우 insert가 된 이후에 아래의 함수가 실행된다는뜻
  // beforeInsert 등등 많이 있음
  afterInsert(event: InsertEvent<any>): void | Promise<any> {
    console.log(event); // event.entity.price, event.entity.isSoldout, ...
    // event에는 우리가 createProduct에서 등록한 내용이 들어옴

    // 그 안에 내용 뽑아오려면 event.entity. 으로 가져와야됨
    const id = event.entity.id;
    const name = event.entity.name;
    const description = event.entity.description;
    const price = event.entity.price;
    const isSoldout = event.entity.isSoldout;

    console.log(`${id} ${name} ${description} ${price} ${isSoldout}`); // 이렇게 받아온 데이터를 빅쿼리나 엘라스틱서치에 담기
    // 우리는 상품테이블에 막 데이터를 넣으면 되고, 이 트리거를 통해 빅쿼리나 엘라스틱서치에 로그가 다 남아있다 -> 나중에 그 로그를 통해서 데이터 분석을 해볼 수 있다!

    //[주의사항]
    // 1. 트리거는 언제 사용하면 안될까?
    // 트랜잭션으로 연결된 중요한 내용들은 사용하면 안된다

    // 2. 어떤 것들을 사용하면 좋을까?
    // 메인 로직에 큰 피해를 안끼치는 로직들...(통계 계산하기(하지만 이때 .count()는 비효율적이니까 쓰지말기), 로그 쌓아놓기)
    // 예를 들어 Payment에 데이터가 입력되면 User테이블에 trigger로 데이터가 입력되어라! 라고 하면 안되는거임. 그건 트랜잭션으로 연결해야지, 트리거로 연결하면 안되는거임
    // 트리거는 로그를 단순하게 쌓거나, 통계처리 하는 메인 로직에서 벗어난 것들을 만들때 필요한거임
    // 그리고 여기서의 통계는 전체 데이터를 싹 다 조회해서 하는 통계가 아니라, 부분적으로 하는거임. 예를 들어 전체 합계가 5000으로 계산되어있다면 1000이 추가되었을떄 그 계산된 5000이라는 값에 1000을 더하는거임. 전체를 다 가져와서 더하는게 아니라
  }
}
