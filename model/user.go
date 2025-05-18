package model

import "time"

type User struct {
	Id         int       `gorm:"primaryKey" json:"id"`
	Username   string    `gorm:"unique;not null" json:"username"`
	Password   string    `gorm:"not null" json:"password"`
	HashedPass string    `gorm:"not null" json:"hashed_pass"`
	Status     string    `gorm:"not null" json:"status"`
	Is_expired bool      `gorm:"not null" json:"is_expired"`
	Created_at time.Time `gorm:"autoCreateTime" json:"created_at"`
	Updated_at time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

type AdminRes struct {
	Id         int       `json:"id"`
	Username   string    `json:"username"`
	Status     string    `json:"status"`
	Created_at time.Time `json:"created_at"`
	Updated_at time.Time `json:"updated_at"`
}

type VisitorResponse struct {
	Id         int       `json:"id"`
	Username   string    `json:"username"`
	Password   string    `json:"password"`
	Status     string    `json:"status"`
	Is_expired bool      `json:"is_expired"`
	Created_at time.Time `json:"created_at"`
	Updated_at time.Time `json:"updated_at"`
}

type UserInput struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Status   string `json:"status"`
}

type UList struct {
	Admin   AdminRes          `json:"admin"`
	Visitor []VisitorResponse `json:"visitor"`
}
