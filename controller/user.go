package controller

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/ptdrpg/homePlexe/lib"
	"github.com/ptdrpg/homePlexe/model"
)

type UserList struct {
	Data model.UList `json:"data"`
}

type CreateResponse struct {
	Message string `json:"message"`
}

func (c *Controller) GetAllUsers(w http.ResponseWriter, r *http.Request) {
	users, err := c.R.GetAllUsers()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var admin model.AdminRes
	var res []model.VisitorResponse
	for i := 0; i < len(users); i++ {
		if users[i].Status == "visitor" {
			res = append(res, model.VisitorResponse{
				Id:         users[i].Id,
				Username:   users[i].Username,
				Password:   users[i].Password,
				Status:     users[i].Status,
				Is_expired: users[i].Is_expired,
				Created_at: users[i].Created_at,
				Updated_at: users[i].Updated_at,
			})
		} else if users[i].Status == "admin" {
			admin.Id = users[i].Id
			admin.Username = users[i].Username
			admin.Status = users[i].Status
			admin.Created_at = users[i].Created_at
			admin.Updated_at = users[i].Updated_at
		}
	}

	data := UserList{
		Data: model.UList{
			Admin:   admin,
			Visitor: res,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func (c *Controller) CreateUser(w http.ResponseWriter, r *http.Request) {
	var user model.UserInput
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if user.Status != "admin" && user.Status != "visitor" {
		http.Error(w, "Invalid user status", http.StatusBadRequest)
		return
	}

	hashedPass, err := lib.HashPass(user.Password)
	if err != nil {
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return
	}

	newUser := model.User{
		Username:   user.Username,
		Status:     user.Status,
		Password:   user.Password,
		HashedPass: hashedPass,
		Is_expired: false,
	}

	if err := c.R.CreateUser(&newUser); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	res := CreateResponse{
		Message: "user successfuly created",
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}

func (c *Controller) ActualiseUser(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		http.Error(w, "Invalid param", http.StatusBadRequest)
		return
	}
	user, err := c.R.GetUserById(id)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}
	if user.Is_expired {
		user.Is_expired = false
	} else {
		user.Is_expired = true
	}

	if err := c.R.Reabilite(id, user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	res := CreateResponse{
		Message: "user successfuly reabilited",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}

func (c *Controller) DeleteUser(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		http.Error(w, "Invalid param", http.StatusBadRequest)
		return
	}

	if err := c.R.DeleteUser(id); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	res := CreateResponse{
		Message: "user successfuly deleted",
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}
