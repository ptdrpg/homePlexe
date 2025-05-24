package lib

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"sync"
)

var wg sync.WaitGroup
var videoPath []Episode
var allTitle []string
var mu sync.Mutex

type Serie struct {
	Title string
	Ep_list []string
}

type Response struct {
	List []Serie `json:"list"`
}

type Episode struct {
	Title string
	Path  string
}

func GetHomeDir() string {
	home, err := os.UserHomeDir()
	if err != nil {
		panic(err.Error())
	}
	return home
}

var videoExtensions = []string{".mp4", ".avi"}

func IsVideoFile(filename string) bool {
	for _, ext := range videoExtensions {
		if strings.HasSuffix(strings.ToLower(filename), ext) {
			return true
		}
	}
	return false
}

func scanDir(path string, jobs chan Episode) {
	defer wg.Done()
	var movie Episode

	entries, err := os.ReadDir(path)
	if err != nil {
		return
	}

	for _, entry := range entries {
		fullpath := filepath.Join(path, entry.Name())
		splitedPath := strings.Split(fullpath, "/")

		if entry.IsDir() {
			wg.Add(1)
			var is_there = false
			for _, title := range allTitle {
				if title == splitedPath[4] {
					is_there = true
				}
			}
			if !is_there {
				allTitle = append(allTitle, splitedPath[4])
			}
			go scanDir(fullpath, jobs)
		} else if IsVideoFile(fullpath) {
			var is_there = false
			for _, title := range allTitle {
				if title == splitedPath[4] {
					is_there = true
					movie.Title = splitedPath[4]
					movie.Path = fullpath
					jobs <- movie
				}
			}
			if !is_there {
				movie.Title = entry.Name()
				movie.Path = fullpath
				jobs <- movie
			}
		}
	}
}

func GetAllPath() Response {
	home := GetHomeDir()
	fullpath := filepath.Join(home, "Videos")
	jobs := make(chan Episode, 1000)
	go func() {
		for path := range jobs {
			mu.Lock()
			videoPath = append(videoPath, path)
			mu.Unlock()
		}
	}()

	fmt.Println("scanning from: ", fullpath)
	wg.Add(1)
	go scanDir(fullpath, jobs)

	wg.Wait()
	close(jobs)

	var allMovies []string
	for _, movie := range videoPath {
		var is_there = false
		for _, enregistred := range allMovies {
			if movie.Title == enregistred {
				is_there = true
			}
		}
		if !is_there {
			allMovies = append(allMovies, movie.Title)
		}
	}

	var res Response
	for _,saga := range allMovies {
		var tempSaga Serie
		tempSaga.Title = saga
		for _, movie := range videoPath {
			if movie.Title == saga {
				tempSaga.Ep_list = append(tempSaga.Ep_list, movie.Path)
			}
		}
		res.List = append(res.List, tempSaga)
	}

	return res
}
