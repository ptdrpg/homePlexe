package repository

import "github.com/ptdrpg/homePlexe/model"

func (r *Repository) GetAllUsers() ([]model.User, error) {
	var users []model.User
	if err := r.DB.Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func (r *Repository) IsAdminAlreadyExist() (bool, error) {
	var user model.User
	if err := r.DB.Where("status = ?", "admin").First(&user).Error; err != nil {
		return false, err
	}
	return true, nil
}

func (r *Repository) CreateUser(user *model.User) error {
	if err := r.DB.Create(user).Error; err != nil {
		return err
	}
	return nil
}

func (r *Repository) Reabilite(id int, user model.User) (model.User, error) {
	if err := r.DB.Model(&user).Where("id = ?", id).Updates(user).Error; err != nil {
		return model.User{}, err
	}
	return user, nil
}

func (r *Repository) DeleteUser(id string) error {
	var user model.User
	if err := r.DB.Where("id = ?", id).Delete(user).Error; err != nil {
		return err
	}

	return nil
}
