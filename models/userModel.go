package models

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type User struct {
	ID   uint    `gorm:"primary key:autoIncrement" json:"id"`
	Task *string `json:"Task"`
}

var DB *gorm.DB

func Init() {
	db, err := gorm.Open(postgres.New(postgres.Config{
		DSN: "host=localhost user=postgres dbname=crudapi password=Aaka$h1234 sslmode=disable",
	}))
	if err != nil {
		panic("Error:Failed to connect to database!")
	}

	db.AutoMigrate(&User{})

	DB = db
}
