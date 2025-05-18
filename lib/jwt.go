package lib

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt"
)

var secretKey = []byte("rP9aL8sB#yT1gHj!WzM0nKdXe@u")

type CustomClaims struct {
	UserID int    `json:"user_id"`
	Username string `json:"username"`
	Role   string `json:"role"`
	jwt.StandardClaims
}

func GenerateToken(userID int, role string, username string) (string, error) {
	claims := CustomClaims{
		UserID: userID,
		Role:   role,
		Username: username,
		StandardClaims: jwt.StandardClaims{
			Issuer:    "homePlexe",
			ExpiresAt: time.Now().Add(24 * time.Hour).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secretKey)
}

func JWTMiddleware(next http.Handler) http.Handler {
	excludedPaths := map[string]bool{
		"/api/v1/login":   true,
	}
	privatePaths := map[string]bool{
		"/api/v1/users": true,
	}
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		
		if excludedPaths[r.URL.Path] {
			next.ServeHTTP(w, r)
			return
		}
		authHeader := r.Header.Get("Authorization")
		if !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, "⛔ Token manquant ou invalide", http.StatusUnauthorized)
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		token, err := jwt.ParseWithClaims(tokenStr, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("⛔ Méthode de signature inattendue")
			}
			return secretKey, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "⛔ Token invalide ou expiré", http.StatusUnauthorized)
			return
		}

		// recup claims:
		claims, ok := token.Claims.(*CustomClaims)
		if !ok {
			http.Error(w, "⛔ invalid claims", http.StatusUnauthorized)
			return
		}

		if claims.ExpiresAt < time.Now().Unix() {
			http.Error(w, "⛔ expired token", http.StatusUnauthorized)
			return
		}

		if claims.Role != "admin" && privatePaths[r.URL.Path] {
			http.Error(w, "⛔ Acces refused", http.StatusForbidden)
			return
		}

		next.ServeHTTP(w, r)
	})
}
