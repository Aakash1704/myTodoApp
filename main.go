package main

import (
	"Golang/models"
	"Golang/routers"

	"fmt"
)

func main() {
	r := routers.RegisterRoutes()
	models.Init()

	fmt.Printf("\nSuccessfully connected to database!\n")

	r.Run("localhost:8080")
}
