package app

import (
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func COnnexion() {
	db, errors := gorm.Open(sqlite.Open("database.db"), &gorm.Config{})

	if errors != nil {
		log.Fatalf("failed to connect to the database: %v", errors)
	}

	db.AutoMigrate()
	DB = db
}
