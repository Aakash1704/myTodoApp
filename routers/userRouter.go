package routers

import (
	"net/http"

	"Golang/models"

	"Golang/middleware"

	"github.com/gin-gonic/gin"
)

type taskk struct {
	Task string `json:"task"`
}

//var DB = models.Init()

func RegisterRoutes() *gin.Engine {
	router := gin.Default()
	router.Use(middleware.CORSMiddleware())

	//routes
	router.GET("/task", getTasks)
	router.POST("/task", postTasks)
	router.DELETE("/task/:id", deleteTask)
	router.PATCH("/task/:id", updateTask)

	return router
}

func getTasks(c *gin.Context) {

	var allTask []models.User
	models.DB.Find(&allTask)

	c.IndentedJSON(http.StatusOK, gin.H{"data": allTask})
}

func postTasks(c *gin.Context) {
	var newtask taskk
	if err := c.ShouldBindJSON(&newtask); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	listTask := models.User{Task: &newtask.Task}
	models.DB.Create(&listTask)

	getTasks(c)
}
func deleteTask(c *gin.Context) {
	var delTodo models.User
	if err := models.DB.Where("id = ?", c.Param("id")).First(&delTodo).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}
	models.DB.Delete(&delTodo)
	c.JSON(http.StatusOK, gin.H{"data": true})
}
func updateTask(c *gin.Context) {
	var upTodo models.User
	if err := models.DB.Where("id =?", c.Param("id")).First(&upTodo).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record not updated!"})
		return
	}
	var input models.User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}
	models.DB.Model(&upTodo).Updates(input)
	c.JSON(http.StatusOK, gin.H{"data": true})
}
