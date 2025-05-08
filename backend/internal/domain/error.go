package domain

type ErrorCode int

var (
	InternalError ErrorCode = 100
)

type ApplicationError struct {
	Err      error
	Code     ErrorCode
	HTTPCode int
}

func (e ApplicationError) Error() string {
	return e.Err.Error()
}
