package controller

import (
	"encoding/json"
	"net/http"

	"github.com/ptdrpg/homePlexe/lib"
)

func (c *Controller) MoviesList(w http.ResponseWriter, r *http.Request) {
	res := lib.GetAllPath()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}
