package controller

import (
	"encoding/json"
	"net/http"

	"github.com/ptdrpg/homePlexe/lib"
	"github.com/ptdrpg/homePlexe/model"
)

func (c *Controller) Login(w http.ResponseWriter, r *http.Request) {
	var input model.Login
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	user, err := c.R.GetUserByusername(input.Username)
	if err != nil {
		http.Error(w, "⛔ User not found", http.StatusUnauthorized)
		return
	}
	if user.Is_expired {
		http.Error(w, "⛔ User expired", http.StatusUnauthorized)
		return
	}

	is_pass_valid := lib.CheckPass(input.Password, user.HashedPass)
	if !is_pass_valid {
		http.Error(w, "⛔ Invalid password", http.StatusUnauthorized)
		return
	}

	token, err := lib.GenerateToken(user.Id, user.Status, user.Username)
	if err != nil {
		http.Error(w, "⛔ Failed to generate token", http.StatusInternalServerError)
		return
	}

	res := model.Logres{
		Token: token,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}
