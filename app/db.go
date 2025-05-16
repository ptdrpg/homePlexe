package app

import (
	"log"

	"github.com/ptdrpg/homePlexe/model"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func COnnexion() {
	db, errors := gorm.Open(sqlite.Open("database.db"), &gorm.Config{})

	if errors != nil {
		log.Fatalf("failed to connect to the database: %v", errors)
	}

	db.AutoMigrate(
		&model.User{},
	)
	DB = db
}
