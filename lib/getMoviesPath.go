package lib

import (
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"sync"
)

type Serie struct {
	Title   string   `json:"title"`
	Ep_list []string `json:"ep_list"`
}

type Response struct {
	List []Serie `json:"list"`
}

type Episode struct {
	Title string
	Path  string
}

var videoExtensions = []string{".mp4", ".avi"}

var ignoredPathPatterns = []string{
	"/go/pkg/mod/",
	"/go.bak/pkg/mod/",
	"/Android/Sdk/",
}

func IsVideoFile(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	for _, valid := range videoExtensions {
		if ext == valid {
			return true
		}
	}
	return false
}

func removeExtension(name string) string {
	return strings.TrimSuffix(name, filepath.Ext(name))
}

func shouldIgnoreDir(name string) bool {
	ignored := []string{"proc", "dev", "sys", "run", "var", "etc", "boot", "tmp", "snap", "lib", "SDK"}
	base := filepath.Base(name)
	if strings.HasPrefix(base, ".") {
		return true
	}
	for _, ig := range ignored {
		if base == ig {
			return true
		}
	}
	return false
}

func shouldIgnorePath(path string) bool {
	for _, pat := range ignoredPathPatterns {
		if strings.Contains(path, pat) {
			return true
		}
	}
	return false
}

func extractSeriesName(filename string) string {
	name := removeExtension(filepath.Base(filename))

	name = strings.ReplaceAll(name, "_", " ")
	name = strings.ReplaceAll(name, ".", " ")

	re := regexp.MustCompile(`(?i)^(.*?)(?:\s*S\d{1,2}E\d{1,2}|\s*E\d{1,2}|\s*Episode\s*\d+|\s*\d{1,3})(?:\s|$)`)
	matches := re.FindStringSubmatch(name)
	if len(matches) > 1 {
		seriesName := strings.TrimSpace(matches[1])
		return seriesName
	}

	reEndNum := regexp.MustCompile(`^(.*?)(?:\s*\d+)?$`)
	m2 := reEndNum.FindStringSubmatch(name)
	if len(m2) > 1 {
		return strings.TrimSpace(m2[1])
	}

	return strings.TrimSpace(name)
}

func isSeries(files []string) bool {
	if len(files) < 2 {
		return false
	}

	seriesNames := make(map[string]int)
	numbersBySeries := make(map[string][]int)

	numRegexp := regexp.MustCompile(`(?i)(?:S\d{1,2}E(\d{1,2})|E(\d{1,2})|Episode\s*(\d+)|(\d+))`)

	allAreNumeric := true 

	for _, f := range files {
		base := extractSeriesName(f)
		seriesNames[base]++

		name := removeExtension(filepath.Base(f))
		numMatches := numRegexp.FindStringSubmatch(name)

		episodeNum := -1
		if numMatches != nil {
			for _, match := range numMatches[1:] {
				if match != "" {
					episodeNum = atoiSafe(match)
					break
				}
			}
		} else {
			if onlyNumber := regexp.MustCompile(`^\d+$`).MatchString(name); onlyNumber {
				episodeNum = atoiSafe(name)
			} else {
				allAreNumeric = false
			}
		}

		numbersBySeries[base] = append(numbersBySeries[base], episodeNum)
	}

	if allAreNumeric {
		return true
	}

	var mainSeries string
	maxCount := 0
	for s, c := range seriesNames {
		if c > maxCount {
			maxCount = c
			mainSeries = s
		}
	}

	nums := numbersBySeries[mainSeries]
	validNums := []int{}
	for _, n := range nums {
		if n >= 0 {
			validNums = append(validNums, n)
		}
	}

	if len(validNums) < 2 {
		return false
	}

	for i := 0; i < len(validNums)-1; i++ {
		for j := i + 1; j < len(validNums); j++ {
			if validNums[i] > validNums[j] {
				validNums[i], validNums[j] = validNums[j], validNums[i]
			}
		}
	}

	for i := 1; i < len(validNums); i++ {
		if validNums[i] != validNums[i-1]+1 {
			return false
		}
	}

	return true
}


func atoiSafe(s string) int {
	i, _ := strconv.Atoi(s)
	return i
}

func walkOptimized(root string, episodes chan<- Episode, wg *sync.WaitGroup) {
	defer wg.Done()

	if shouldIgnorePath(root) {
		return
	}

	entries, err := os.ReadDir(root)
	if err != nil {
		return
	}

	var videoFiles []string
	var hasSubDir bool

	for _, entry := range entries {
		if entry.IsDir() {
			if shouldIgnoreDir(entry.Name()) {
				continue
			}
			hasSubDir = true
		} else if IsVideoFile(filepath.Join(root, entry.Name())) {
			videoFiles = append(videoFiles, filepath.Join(root, entry.Name()))
		}
	}

	if hasSubDir && len(videoFiles) > 0 {
		for _, f := range videoFiles {
			title := extractSeriesName(f)
			if title == "" {
				title = removeExtension(filepath.Base(f))
			}
			episodes <- Episode{Title: title, Path: f}
		}

		for _, entry := range entries {
			if entry.IsDir() && !shouldIgnoreDir(entry.Name()) {
				wg.Add(1)
				go walkOptimized(filepath.Join(root, entry.Name()), episodes, wg)
			}
		}
		return
	}

	if len(videoFiles) > 0 {
		if isSeries(videoFiles) {
			title := filepath.Base(root)
			for _, f := range videoFiles {
				episodes <- Episode{Title: title, Path: f}
			}
		} else {
			for _, f := range videoFiles {
				title := extractSeriesName(f)
				if title == "" {
					title = removeExtension(filepath.Base(f))
				}
				episodes <- Episode{Title: title, Path: f}
			}
		}
		return
	}

	for _, entry := range entries {
		if entry.IsDir() && !shouldIgnoreDir(entry.Name()) {
			wg.Add(1)
			go walkOptimized(filepath.Join(root, entry.Name()), episodes, wg)
		}
	}
}

func GetHomeDir() string {
	home, err := os.UserHomeDir()
	if err != nil {
		panic(err.Error())
	}
	return home
}

func GetAllPath() Response {
	home := GetHomeDir()
	episodes := make(chan Episode, 10000)
	var res Response

	var wg sync.WaitGroup
	wg.Add(1)
	go walkOptimized(home, episodes, &wg)

	go func() {
		wg.Wait()
		close(episodes)
	}()

	group := make(map[string][]string)
	for ep := range episodes {
		group[ep.Title] = append(group[ep.Title], ep.Path)
	}

	for title, paths := range group {
		if len(title) < 2 {
			continue
		}
		lowerTitle := strings.ToLower(title)
		if strings.Contains(lowerTitle, "mp4") || strings.Contains(lowerTitle, "image_room") {
			continue
		}
		serie := Serie{Title: title, Ep_list: paths}
		res.List = append(res.List, serie)
	}

	return res
}
