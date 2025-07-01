import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductSaleslocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  address: string;

  @Column()
  addressDetail: string;

  @Column({ type: 'decimal', precision: 9, scale: 6 }) // 총 9자리에 소수점 6자리까지 되는 숫자로 타입을 지정하겠다는뜻
  lat: number;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  lng: number;

  @Column()
  meetingTime: Date;
}
