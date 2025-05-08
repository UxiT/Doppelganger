package domain

type Request interface {
	Validate() error
}
