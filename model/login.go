package model

type Login struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type Logres struct {
	Token string `json:"token"`
}
