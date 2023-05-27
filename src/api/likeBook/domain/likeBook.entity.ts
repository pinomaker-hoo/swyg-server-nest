import User from 'src/api/auth/domain/user.entity'
import Book from 'src/api/book/domain/book.entity'
import { BaseTimeEntity } from 'src/common/entity/BaseTime.Entity'
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'tbl_like' })
export class LikeBook extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  idx: number

  @ManyToOne((type) => User, (user) => user.likeBook)
  user: User

  @ManyToOne((type) => Book, (book) => book.likeBook)
  book: Book
}
