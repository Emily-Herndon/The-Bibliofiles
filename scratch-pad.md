table: users

username: VARCHAR(255)
email: VARCHAR(255)
password: VARCHAR(255)

table: books

userId(FK): INTEGER
Title: VARCHAR(255)
Author: VARCHAR(255)
Subject/genre: VARCHAR(255)
Book Cover url: VARCHAR(255)

table: tags

userId(FK): INTEGER
Read: boolean
Tag: string

join table: tagsbooks
userId(FK):INTEGER
bookId(FK):INTEGER

---
#### Stretch
table: comments

userId: INTEGER
bookId: INTEGER
comment: text



sequelize model:create --name user --attributes username:string,email:string,password:string

sequelize model:create --name savedBook --attributes userId:integer,title:string,author:string,subject:string,book_cover_url:string,read:boolean

sequelize model:create --name tag --attributes userId:integer,bookId:integer,tag:string


---
### Stretch
sequelize model:create --name comment --attributes userId:integer,bookId:number,tag:string



