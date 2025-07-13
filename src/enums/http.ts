import { EnumAsUnion } from "@/decorators/enumAsUnion.decorator";

export enum HttpMethods {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE',
	PATCH = 'PATCH',
};

export type Method = keyof typeof HttpMethods;
export type MethodCode = EnumAsUnion<typeof HttpMethods>;

export enum HttpStatus {
	Ok = 200,
	Created = 201,
	Accepted = 202,
	NonAuthoritativeInformation = 203,
	NoContent = 204,
	ResetContent = 205,
	PartialContent = 206,
	MultiStatus = 207,
	AlreadyReported = 208,
	IMUsed = 226,

	MultipleChoices = 300,
	MovedPermanently = 301,
	Found = 302,
	SeeOther = 303,
	NotModified = 304,
	UseProxy = 305,
	Unused = 306,
	TemporaryRedirect = 307,
	PermanentRedirect = 308,

	BadRequest = 400,
	Unauthorized = 401,
	PaymentRequired = 402,
	Forbidden = 403,
	NotFound = 404,
	MethodNotAllowed = 405,
	NotAcceptable = 406,
	ProxyAuthenticationRequired = 407,
	RequestTimeout = 408,
	Conflict = 409,
	Gone = 410,
	LengthRequired = 411,
	PreconditionFailed = 412,
	PayloadTooLarge = 413,
	UriTooLong = 414,
	UnsupportedMediaType = 415,
	RangeNotSatisfiable = 416,
	ExpectationFailed = 417,
	ImTeapot = 418,
	MisdirectedRequest = 421,
	UnprocessableContent = 422,
	Locked = 423,
	FailedDependency = 424,
	TooEarly = 425,
	UpgradeRequired = 426,
	PreconditionRequired = 428,
	TooManyRequests = 429,
	RequestHeaderFieldsTooLarge = 431,
	UnavailableForLegalReasons = 451,

	InternalServerError = 500,
	NotImplemented = 501,
	BadGateway = 502,
	ServiceUnavailable = 503,
	GatewayTimeout = 504,
	HttpVersionNotSupported = 505,
	VariantAlsoNegotiates = 506,
	InsufficientStorage = 507,
	LoopDetected = 508,
	NotExtended = 510,
	NetworkAuthenticationRequired = 511,
};

export type Status = keyof typeof HttpStatus;
export type StatusCode = EnumAsUnion<typeof HttpStatus>;

export enum Middlewares {
	AUTH = 'auth',
	GUEST = 'guest',
}

export type Middleware = keyof typeof Middlewares;
export type MiddlewareCode = EnumAsUnion<typeof Middlewares>;

const Http = {
	Methods: HttpMethods,
	Status: HttpStatus,
	Middlewares: Middlewares,
	method: (method: Method) => HttpMethods[method],
	status: (status: Status) => HttpStatus[status],
	middleware: (middleware: Middleware) => Middlewares[middleware],
	ok: (status: StatusCode) => [HttpStatus.Ok, HttpStatus.Created, HttpStatus.Accepted, HttpStatus.NonAuthoritativeInformation, HttpStatus.NoContent, HttpStatus.ResetContent, HttpStatus.PartialContent, HttpStatus.MultiStatus, HttpStatus.AlreadyReported, HttpStatus.IMUsed].includes(status),
	failed: (status: StatusCode) => !Http.ok(status),
	is: (status: Status, code: StatusCode) => HttpStatus[status] === code,
}

export default Http;
