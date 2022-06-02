table: users

username: VARCHAR(255)
email: VARCHAR(255)
password: VARCHAR(255)

sequelize model:create --name user --attributes username:string,email:string,password:string

---
table: books

userId(FK): INTEGER
Title: VARCHAR(255)
Author: VARCHAR(255)
Book Cover url: VARCHAR(255)

sequelize model:create --name book --attributes userId:integer,title:string,author:string,book_cover_url:string

---
table: tags

userId(FK): INTEGER
Read: boolean
Tag: string

sequelize model:create --name tag --attributes userId:integer,read:boolean,tag:string

---
join table: tagsbooks
userId(FK):INTEGER
bookId(FK):INTEGER

sequelize model:create --name tagsBooks --attributes userId:integer,bookId:integer

---
#### Stretch
table: comments

userId: INTEGER
bookId: INTEGER
comment: text







---
### Stretch
sequelize model:create --name comment --attributes userId:integer,bookId:number,tag:string

